import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteEvaluationComponent } from './website-evaluation.component';

describe('WebsiteEvaluationComponent', () => {
  let component: WebsiteEvaluationComponent;
  let fixture: ComponentFixture<WebsiteEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteEvaluationComponent]
    });
    fixture = TestBed.createComponent(WebsiteEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
