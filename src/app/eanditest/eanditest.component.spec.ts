import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EanditestComponent } from './eanditest.component';

describe('EanditestComponent', () => {
  let component: EanditestComponent;
  let fixture: ComponentFixture<EanditestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EanditestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EanditestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
