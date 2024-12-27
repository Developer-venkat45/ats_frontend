import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddindentComponent } from './addindent.component';

describe('AddindentComponent', () => {
  let component: AddindentComponent;
  let fixture: ComponentFixture<AddindentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddindentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddindentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
