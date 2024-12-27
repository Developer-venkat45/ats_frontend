import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateprofileComponent } from './candidateprofile.component';

describe('CandidateprofileComponent', () => {
  let component: CandidateprofileComponent;
  let fixture: ComponentFixture<CandidateprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandidateprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
