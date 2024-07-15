import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Page } from '../page';
import { WebsiteService } from '../website.service';

@Component({
    selector: 'app-website-evaluation-dialog',
    templateUrl: './website-evaluation.component.html',
    styleUrls: ['./website-evaluation.component.css']
})
export class WebsiteEvaluationComponent {
    website: string = '';
    pages: Page[] = [];
    selectedPages: string[] = [];
    constructor(
        public dialogRef: MatDialogRef<WebsiteEvaluationComponent>,
        private websiteService: WebsiteService,
        @Inject(MAT_DIALOG_DATA) public data: { websiteId: string, pages: Page[] }
    ) {
        this.websiteService.getPages(data.websiteId).subscribe(pages => {
            this.pages = pages;
            console.log(this.pages);
            
        });

    }

    onCheckboxChange(page: Page, isChecked: boolean) {

        if (isChecked) {
            this.selectedPages.push(page._id);
        } else {
            this.selectedPages = this.selectedPages.filter(p => p !== page._id);
        }
        console.log(this.selectedPages);
    }

    evaluatePages() {
        this.dialogRef.close(this.selectedPages);
        // window.location.reload();
    }

    onCancel() {
        this.dialogRef.close();
    }


}