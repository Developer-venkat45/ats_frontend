import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeandiQuestionComponent } from './editeandi-question.component';

describe('EditeandiQuestionComponent', () => {
  let component: EditeandiQuestionComponent;
  let fixture: ComponentFixture<EditeandiQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeandiQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditeandiQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
