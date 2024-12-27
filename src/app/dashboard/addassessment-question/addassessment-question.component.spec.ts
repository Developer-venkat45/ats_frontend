import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddassessmentQuestionComponent } from './addassessment-question.component';

describe('AddassessmentQuestionComponent', () => {
  let component: AddassessmentQuestionComponent;
  let fixture: ComponentFixture<AddassessmentQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddassessmentQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddassessmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
