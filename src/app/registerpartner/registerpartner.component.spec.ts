import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterpartnerComponent } from './registerpartner.component';

describe('RegisterpartnerComponent', () => {
  let component: RegisterpartnerComponent;
  let fixture: ComponentFixture<RegisterpartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterpartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterpartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
