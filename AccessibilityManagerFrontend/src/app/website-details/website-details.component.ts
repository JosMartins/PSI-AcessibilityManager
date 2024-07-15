import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteService } from '../website.service';
import { Location } from '@angular/common';
import { Website } from '../website';
import { Page } from '../page';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin } from 'rxjs';
import { PageReportComponent } from '../page-report/page-report.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-website-details',
    templateUrl: './website-details.component.html',
    styleUrls: ['./website-details.component.css']
})
export class WebsiteDetailsComponent implements OnInit {

    website!: Website;
    pages: Page[] = [];
    message: string = '';
    pageUrl: string = '';
    selectAll: boolean = false;


    constructor(
        private route: ActivatedRoute,
        private websiteService: WebsiteService,
        private location: Location,
        public dialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getWebsite();
    }

    getWebsite(): void {
        const id = this.route.snapshot.paramMap.get('id');
        console.log(id);

        if (id) {
            this.websiteService.getWebsite(id).subscribe(
                websites => {
                    console.log(websites);
                    const index = websites.findIndex(item => item._id === id);
                    console.log("Index of website with ID", id, "is", index);
                    this.website = websites[index];
                    console.log(websites);

                    this.getPages();
                }
            );
        } else {
            console.error("ID is null.");
        }
    }

    getPages(): void {
        this.pages = [];
        if (this.website) {
            if (this.website.pages.length > 0) {
                const pageObservables: Observable<Page>[] = this.website.pages.map(pageId => {
                    return this.websiteService.getPage(pageId);
                });

                forkJoin(pageObservables).subscribe(
                    (pages: Page[]) => {
                        this.pages = pages.filter(page => !!page); // Filtrar páginas undefined, se houver
                    },
                    error => {
                        console.error('Error fetching pages:', error);
                    }
                );
            }
        } else {
            console.error("Website is undefined.");
        }
    }


    validUrl = true;

    tryAddPage(pageUrl: string): void {
        if (pageUrl.startsWith(this.website.url)) {
            console.log(this.website._id);
            console.log(pageUrl);

            this.websiteService.addPageToWebsite(this.website._id, pageUrl).subscribe(
                page => {
                    this.pages.push(page);
                    console.log(page);
                    window.location.reload();

                },
                error => {
                    if (error === 'Page already exists') {
                        this.message = "Page already exists.";
                        this.validUrl = true;
                        return;
                    }
                    console.error('Error adding page:', error);

                }
            );
        } else {

            this.message = "Error adding page. Invalid Domain.\nValid Domain: " + this.website.url;
            console.error("Website or page URL is not defined.");
        }
    }


    goBack(): void {
        this.location.back();
    }


    deleteConfirmationDialog(websiteId: string, pages: Page[]): void {

        console.log("Open delete confirmation dialog");

        if (pages.length > 0) {
            const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.deleteWebsite(websiteId);
                }
                this.dialog.closeAll();
            });

        } else {
            this.deleteWebsite(websiteId);
        }
    }

    deleteWebsite(id: string): void {
        this.websiteService.deleteWebsite(id).subscribe(() => {
            this.goBack();
        });
    }

    toggleSelectAll() {
        for (const page of this.pages) {
            page.selected = this.selectAll;
        }
    }


    async deleteSelectedPages() {
        const pages_selected_to_delete: Page[] = [];

        for (const page of this.pages) {
            if (page.selected) {
                pages_selected_to_delete.push(page);
            }
        }
        console.log("Pages Selected to Delete");
        console.log(pages_selected_to_delete);

        console.log("Pages que o website tem antes de eliminar");
        console.log(this.website.pages);

        for (let page of pages_selected_to_delete) {
            await new Promise<void>((resolve, reject) => {
                this.websiteService.deletePage(this.website._id, page._id).subscribe(
                    () => {
                        console.log("Page excluída com sucesso. Atualizando páginas...");


                        // Remove the deleted page from this.pages
                        const index = this.pages.findIndex(p => p._id === page._id);
                        if  (index !== -1) {
                            this.pages.splice(index, 1);
                        }

                        console.log('Numero de páginas', this.website.pages.length);
                        if (this.website.pages.length === 0) {
                            this.website.status = 'Por Avaliar';
                        }
                        resolve(); // Resolve the promise after successful deletion
                    },
                    error => {
                        console.error("Erro ao excluir página:", error);
                        reject(error); // Reject the promise if there's an error
                    }
                );
            });
            window.location.reload();
        }


    }


    async evaluateSelectedPages() {
        console.log('Vai avaliar as selecionadas');

        let selected_pages_counter = 0;
        let evaluated_pages_counter = 0;
        this.website.status = 'Em Avaliação';

        for (const page of this.pages) {
            console.log('Page a analisar', page._id);
            if (page.selected) {
                selected_pages_counter++;
                this.websiteService.evaluatePage(this.website._id, page._id).subscribe(
                    () => {
                        console.log('Page avaliada com sucesso ', page);
                        evaluated_pages_counter++;

                        if (evaluated_pages_counter === selected_pages_counter) {
                            console.log('Todas as páginas selecionadas foram avaliadas');
                            window.location.reload();
                        }
                    }
                );
            }
        }
    }

    counterPagesWithoutAccessibilityErrors(): number {
        let counter = 0;

        for (const page of this.pages) {
            if (page.status === 'Conforme' && page.lastReportDate !== undefined) {
                counter++;
            }
        }
        return counter;
    }

    counterPagesWithAccessibilityErrors(): number {
        let counter = 0;

        for (const page of this.pages) {
            if (page.status === 'Não Conforme' && page.lastReportDate !== undefined) {
                counter++;
            }
        }

        return counter;

    }

    counterPagesWithLevelAAccessibilityErrors(): number {
        let counter = 0;

        for (const page of this.pages) {
            if (page.lastReportDate !== undefined && page.aErrors !== undefined && page.aErrors > 0) {
                counter++;
            }
        }

        return counter;
    }


    counterPagesWithLevelAAAccessibilityErrors(): number {
        let counter = 0;

        for (const page of this.pages) {
            if (page.lastReportDate !== undefined && page.aaErrors !== undefined && page.aaErrors > 0) {
                counter++;
            }
        }

        return counter;
    }


    counterPagesWithLevelAAAAccessibilityErrors(): number {
        let counter = 0;

        for (const page of this.pages) {
            if (page.lastReportDate !== undefined && page.aaaErrors !== undefined && page.aaaErrors > 0) {
                counter++;
            }
        }
        return counter;
    }


    percentageOfPagesWithoutAccessibilityErrors(): number {

        if (this.pages.length === 0) {
            return 0;
        }
        return (this.counterPagesWithoutAccessibilityErrors() / this.pages.length) * 100;
    }


    percentageOfPagesWithAccessibilityErrors(): number {

        if (this.pages.length === 0) {
            return 0;
        }
        return (this.counterPagesWithAccessibilityErrors() / this.pages.length) * 100;
    }


    percentageOfPagesWithLevelAAccessibilityErrors(): number {

        if (this.pages.length === 0) {
            return 0;
        }
        return (this.counterPagesWithLevelAAccessibilityErrors() / this.pages.length) * 100;
    }


    percentageOfPagesWithLevelAAAccessibilityErrors(): number {

        if (this.pages.length === 0) {
            return 0;
        }
        return (this.counterPagesWithLevelAAAccessibilityErrors() / this.pages.length) * 100;
    }


    percentageOfPagesWithLevelAAAAccessibilityErrors(): number {

        if (this.pages.length === 0) {
            return 0;
        }
        return (this.counterPagesWithLevelAAAAccessibilityErrors() / this.pages.length) * 100;
    }

    top10Errors(): string {
        if (this.pages.length === 0 || !this.website.topErrors) {
            return "-";
        }
        return Object.entries(this.website.topErrors).map(([key, value]) => key + ':' + value).join("\n");

    }




    handleKeyPress(page: Page): void {
        console.log('Enter pressed in page', page);
        page.selected = !page.selected;
    }

    hasSelectedPages(): boolean {
        return this.pages.some(page => page.selected);

    }

    open_page_report(page: Page): void {
        this.router.navigate(['/report/' + this.website._id + "/" + page._id]);


    }


    generateHTMLReport(): void {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`
                <html>
                <head>
                    <title>Website Accessibility Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { margin: 20px; }
                        h1 { color: #333; }
                        p { font-size: 14px; }
                        pre { background: #f4f4f4; padding: 10px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Website Details</h1>
                        <p><strong>ID:</strong> ${this.website._id}</p>
                        <p><strong>URL:</strong> ${this.website.url}</p>
                        <p><strong>Status:</strong> ${this.website.status}</p>
                        <p><strong>Date Added:</strong> ${this.website.dateAdded}</p>
                        <p><strong>Pages without accessibility errors:</strong> ${this.counterPagesWithoutAccessibilityErrors()} [${this.percentageOfPagesWithoutAccessibilityErrors()}%]</p>
                        <p><strong>Pages with at least one accessibility error:</strong> ${this.counterPagesWithAccessibilityErrors()} [${this.percentageOfPagesWithAccessibilityErrors()}%]</p>
                        <p><strong>Pages with at least one level A accessibility error:</strong> ${this.counterPagesWithLevelAAccessibilityErrors()} [${this.percentageOfPagesWithLevelAAccessibilityErrors()}%]</p>
                        <p><strong>Pages with at least one level AA accessibility error:</strong> ${this.counterPagesWithLevelAAAccessibilityErrors()} [${this.percentageOfPagesWithLevelAAAccessibilityErrors()}%]</p>
                        <p><strong>Pages with at least one level AAA accessibility error:</strong> ${this.counterPagesWithLevelAAAAccessibilityErrors()} [${this.percentageOfPagesWithLevelAAAAccessibilityErrors()}%]</p>
                        <p><strong>10 most common accessibility mistakes:</strong></p>
                        <pre>${this.top10Errors()}</pre>
                        <p><strong>Last Report Date:</strong> ${this.website.lastReportDate}</p>
                    </div>
                </body>
                </html>
            `);
            newWindow.document.close();
        }
    }


    generateReportPDF(): void {
        const element = document.createElement('div');
        element.innerHTML = `
          <html>
          <head>
            <title>Website Accessibility Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { margin: 20px; }
              h1 { color: #333; }
              p { font-size: 14px; }
              pre { background: #f4f4f4; padding: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Website Details</h1>
              <p><strong>ID:</strong> ${this.website._id}</p>
              <p><strong>URL:</strong> ${this.website.url}</p>
              <p><strong>Status:</strong> ${this.website.status}</p>
              <p><strong>Date Added:</strong> ${this.website.dateAdded}</p>
              <p><strong>Pages without accessibility errors:</strong> ${this.counterPagesWithoutAccessibilityErrors()} [${this.percentageOfPagesWithoutAccessibilityErrors()}%]</p>
              <p><strong>Pages with at least one accessibility error:</strong> ${this.counterPagesWithAccessibilityErrors()} [${this.percentageOfPagesWithAccessibilityErrors()}%]</p>
              <p><strong>Pages with at least one level A accessibility error:</strong> ${this.counterPagesWithLevelAAccessibilityErrors()} [${this.percentageOfPagesWithLevelAAccessibilityErrors()}%]</p>
              <p><strong>Pages with at least one level AA accessibility error:</strong> ${this.counterPagesWithLevelAAAccessibilityErrors()} [${this.percentageOfPagesWithLevelAAAccessibilityErrors()}%]</p>
              <p><strong>Pages with at least one level AAA accessibility error:</strong> ${this.counterPagesWithLevelAAAAccessibilityErrors()} [${this.percentageOfPagesWithLevelAAAAccessibilityErrors()}%]</p>
              <p><strong>10 most common accessibility mistakes:</strong></p>
              <pre>${this.top10Errors()}</pre>
              <p><strong>Last Report Date:</strong> ${this.website.lastReportDate}</p>
            </div>
          </body>
          </html>
        `;
    
        document.body.appendChild(element);
    
        html2canvas(element).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('website_report.pdf');
    
          document.body.removeChild(element);
        });
      }
    

    
}


