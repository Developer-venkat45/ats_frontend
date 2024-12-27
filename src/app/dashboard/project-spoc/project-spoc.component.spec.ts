import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSPOCComponent } from './project-spoc.component';

describe('ProjectSPOCComponent', () => {
  let component: ProjectSPOCComponent;
  let fixture: ComponentFixture<ProjectSPOCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSPOCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectSPOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
