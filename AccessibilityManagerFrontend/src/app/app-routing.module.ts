import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { WebsiteListComponent } from './website-list/website-list.component';
import { AddWebsiteComponent } from './add-website/add-website.component';
import { WebsiteDetailsComponent } from './website-details/website-details.component';

import { HttpClientModule } from '@angular/common/http';
import { ReportDetailsComponent } from './report-details/report-details.component';


const routes: Routes = [
  { path: '', redirectTo: '/websites', pathMatch: 'full' },
  { path: 'add-website', component: AddWebsiteComponent },
  { path: 'website/:id', component: WebsiteDetailsComponent },
  { path: 'websites', component: WebsiteListComponent, },
  { path: 'report/:websiteId/:pageId', component: ReportDetailsComponent, }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  providers: [HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
