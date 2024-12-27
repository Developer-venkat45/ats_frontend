import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeandiQuestionComponent } from './addeandi-question.component';

describe('AddeandiQuestionComponent', () => {
  let component: AddeandiQuestionComponent;
  let fixture: ComponentFixture<AddeandiQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddeandiQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddeandiQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
