import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditindentComponent } from './editindent.component';

describe('EditindentComponent', () => {
  let component: EditindentComponent;
  let fixture: ComponentFixture<EditindentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditindentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditindentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
