import { Component } from '@angular/core';
import { WebsiteService } from '../website.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-website',
  templateUrl: './add-website.component.html',
  styleUrls: ['./add-website.component.css']
})
export class AddWebsiteComponent {
  url: string = '';
  message: string = '';

  constructor(private websiteService: WebsiteService, private router: Router, private location: Location
  ) { }

  addWebsite(): void {
    this.message = '';
    this.websiteService.addWebsite(this.url).subscribe(
      response => {
        console.log('Website added successfully!', response);
        this.url = '';
        this.message = 'Website added successfully!';
        this.goToWebsites();
      },
      error => {
        if (error === 'Website already exists') {
          this.message = 'Website already exists.';
          return;
        }
        console.error('Error adding website: ', error);
        this.message = 'Error adding website. Invalid URL. \nValid Format: https://www.example.com';
        return; 
      }
    );
  }

  goToWebsites() {
    console.log('Going to websites');
    this.router.navigate(['/websites']);
  }

  goBack(): void {
    this.location.back();
  }
}
