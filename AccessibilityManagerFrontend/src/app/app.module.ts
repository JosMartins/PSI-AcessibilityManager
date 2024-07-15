import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebsiteListComponent } from './website-list/website-list.component';
import { AddWebsiteComponent } from './add-website/add-website.component';
import { WebsiteDetailsComponent } from './website-details/website-details.component';
import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WebsiteEvaluationComponent } from './website-evaluation/website-evaluation.component';
import { PageReportComponent } from './page-report/page-report.component';
import { ReportDetailsComponent } from './report-details/report-details.component';
import { MatListModule } from '@angular/material/list';  // Import MatListModule


@NgModule({
  declarations: [
    AppComponent,
    WebsiteListComponent,
    AddWebsiteComponent,
    WebsiteDetailsComponent,
    DeleteConfirmationDialogComponent,
    WebsiteEvaluationComponent,
    PageReportComponent,
    ReportDetailsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatListModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
