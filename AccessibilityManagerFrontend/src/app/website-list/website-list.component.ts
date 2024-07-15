import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../website.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WebsiteEvaluationComponent } from '../website-evaluation/website-evaluation.component';
import { Website } from '../website';


@Component({
    selector: 'app-website-list',
    templateUrl: './website-list.component.html',
    styleUrls: ['./website-list.component.css'],
})
export class WebsiteListComponent implements OnInit {
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 25];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    pageEvent: PageEvent | null = null;

    selectedOption = "all";


    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        console.log(this.pageSize);
    }

    columns = [
        { columnDef: 'url', header: 'URL' },
        { columnDef: 'status', header: 'Status' },
        { columnDef: 'pages', header: 'Pages' },
        { columnDef: 'dateAdded', header: 'Date Added' },
        { columnDef: 'lastReportDate', header: 'Last Report Date' },
        { columnDef: 'evaluateWebsite', header: '' },
        { columnDef: 'deleteWebsite', header: '' },
    ];

    @ViewChild(MatSort) sort: any | MatSort;

    @ViewChild(MatPaginator) paginator: any | MatPaginator;

    ngAfterViewInit(): void {
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
        }
    }

    displayedColumns = this.columns.map(c => c.columnDef);

    dataSource: any;

    constructor(private websiteService: WebsiteService, private router: Router, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.getWebsites();

        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
        }
    }

    getWebsites(): void {
        this.websiteService.getWebsites().subscribe(
            websites => {
                this.dataSource = new MatTableDataSource(websites);
                this.length = this.dataSource.length;
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;

            }
        );
    }

    getPagesCount(pages: string[]): number {
        return pages.length;
    }

    openWebsite(id: string) {
        this.router.navigate(['/website', id]);
    }

    goToAddWebsite() {
        this.router.navigate(['/add-website']);
    }

    deleteConfirmationDialog(event: Event, websiteId: string, pages: string[]) {

        event.stopPropagation(); //Evita que seja chamada a página das informações do website

        console.log('Numero de pages do website');
        console.log(pages.length);

        if (pages.length > 0) {
            const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.deleteWebsite(websiteId);
                }
                this.dialog.closeAll();
            });
        } else {
            console.log("Não tem páginas");
            this.deleteWebsite(websiteId);
        }
       
        
    }

    deleteWebsite(id: string): void {
        this.websiteService.deleteWebsite(id).subscribe(() => {
            this.getWebsites();
        });
    }

    applyFilter(event: any): void {
        let filterValue = event.value;
      
        if (filterValue === 'all') {
          this.dataSource.filter = '';
        } else {
          this.dataSource.filterPredicate = (data: Website, filter: string) => {
            return data.status === filter;
          };
          this.dataSource.filter = filterValue;
        }
      }

    evaluateWebsiteDialog(event: Event, website: string, pages: string[]) {
        console.log('evaluate website', website);
        event.stopPropagation();
    
        const dialogRef = this.dialog.open(WebsiteEvaluationComponent, {
            data: {
                websiteId: website,
                pages: pages
            }
        });
    
        dialogRef.afterClosed().subscribe(selectedPages => {
            console.log("Selected Pages",selectedPages);
    
            if (selectedPages) {
                this.evaluateSelectedPages(website, selectedPages);
            }
            this.dialog.closeAll();
        });
    }
    
    async evaluateSelectedPages(websiteId: string, pages: string[]) {
        console.log('Evaluate Selected Pages');

        console.log("Data Source:", this.dataSource.data);
        console.log("Website ID:", websiteId);



    
        const selectedWebsite = this.dataSource.data.find((website: any) => website._id === websiteId);

        console.log("Website", selectedWebsite);
    
        if (selectedWebsite) {
            selectedWebsite.status = 'Em Avaliação';
    

            const pageEvaluationPromises = pages.map(pageId => {
                return this.websiteService.evaluatePage(websiteId, pageId).toPromise();
            });
    

            try {
                await Promise.all(pageEvaluationPromises);
                console.log("All pages evaluated successfully");
    
                
                this.getWebsites();
            } catch (error) {
                console.error("Error occurred during page evaluation:", error);
                window.location.reload();
            }
        }
    }
    
}


