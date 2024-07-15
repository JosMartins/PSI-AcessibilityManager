import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Page } from '../page';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebsiteService } from '../website.service';


@Component({
  selector: 'app-page-report',
  templateUrl: './page-report.component.html',
  styleUrls: ['./page-report.component.css']
})
export class PageReportComponent {

  pageReport?: any;
  constructor(public dialogRef: MatDialogRef<PageReportComponent>,private websiteService: WebsiteService,
  @Inject(MAT_DIALOG_DATA) public data: {websiteId:string, page: Page}  )
  {this.pageReport = Object.values(this.websiteService.getPageReport(this.data.websiteId,this.data.page))
    console.log(this.pageReport);
  }

    report_infos() {
      console.log(this.pageReport);
      const passed = this.pageReport.metadata.passed;
      const failed = this.pageReport.metadata.failed;
      const warning = this.pageReport.metadata.warning;
      const inpplicable = this.pageReport.metadata.inapplicable;
      const total = passed + failed + warning + inpplicable;
      let rep : String;
      rep = "Total e percentagem de testes passados: " + passed + " (" + (passed / total * 100).toFixed(2) + "%)\n";
      rep + "Total e percentagem de testes com aviso " + warning + " (" + (warning / total * 100).toFixed(2) + "%)\n";
      rep + "Total e percentagem de testes falhados" + failed + " (" + (failed / total * 100).toFixed(2) + "%)\n";
      rep + "Total e percentagem de testes não aplicáveis" + inpplicable + " (" + (inpplicable / total * 100).toFixed(2) + "%)\n";

      return rep;
    }
}
