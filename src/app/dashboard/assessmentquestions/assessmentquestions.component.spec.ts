import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentquestionsComponent } from './assessmentquestions.component';

describe('AssessmentquestionsComponent', () => {
  let component: AssessmentquestionsComponent;
  let fixture: ComponentFixture<AssessmentquestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentquestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
