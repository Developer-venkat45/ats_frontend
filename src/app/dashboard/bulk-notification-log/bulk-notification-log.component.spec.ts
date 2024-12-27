import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkNotificationLogComponent } from './bulk-notification-log.component';

describe('BulkNotificationLogComponent', () => {
  let component: BulkNotificationLogComponent;
  let fixture: ComponentFixture<BulkNotificationLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkNotificationLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkNotificationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
