import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EandiComponent } from './eandi.component';

describe('EandiComponent', () => {
  let component: EandiComponent;
  let fixture: ComponentFixture<EandiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EandiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EandiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
