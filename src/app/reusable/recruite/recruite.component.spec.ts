import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiteComponent } from './recruite.component';

describe('RecruiteComponent', () => {
  let component: RecruiteComponent;
  let fixture: ComponentFixture<RecruiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecruiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
