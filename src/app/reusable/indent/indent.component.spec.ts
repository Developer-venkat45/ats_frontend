import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentComponent } from './indent.component';

describe('IndentComponent', () => {
  let component: IndentComponent;
  let fixture: ComponentFixture<IndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
