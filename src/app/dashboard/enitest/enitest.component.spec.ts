import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnitestComponent } from './enitest.component';

describe('EnitestComponent', () => {
  let component: EnitestComponent;
  let fixture: ComponentFixture<EnitestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnitestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnitestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
