import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvuploadComponent } from './cvupload.component';

describe('CvuploadComponent', () => {
  let component: CvuploadComponent;
  let fixture: ComponentFixture<CvuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvuploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CvuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
