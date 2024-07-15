import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWebsiteComponent } from './add-website.component';

describe('AddWebsiteComponent', () => {
  let component: AddWebsiteComponent;
  let fixture: ComponentFixture<AddWebsiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWebsiteComponent]
    });
    fixture = TestBed.createComponent(AddWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
