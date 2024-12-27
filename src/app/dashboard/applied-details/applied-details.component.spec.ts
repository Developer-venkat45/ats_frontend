import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedDetailsComponent } from './applied-details.component';

describe('AppliedDetailsComponent', () => {
  let component: AppliedDetailsComponent;
  let fixture: ComponentFixture<AppliedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppliedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
