import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentCandidateComponent } from './indent-candidate.component';

describe('IndentCandidateComponent', () => {
  let component: IndentCandidateComponent;
  let fixture: ComponentFixture<IndentCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentCandidateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndentCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
