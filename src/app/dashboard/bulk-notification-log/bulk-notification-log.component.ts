import { Component, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DashboardService } from '../../core/service/dashboard.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-bulk-notification-log',
  standalone: true,
  imports: [TableModule, RouterModule, InputTextModule, InputIconModule, IconFieldModule, CommonModule, FormsModule, NgxSkeletonLoaderModule],
  templateUrl: './bulk-notification-log.component.html',
  styleUrl: './bulk-notification-log.component.css'
})
export class BulkNotificationLogComponent implements OnInit {
  clientService = inject(DashboardService);
  authToken: any;
  bulkNotificationList: any[] = [];
  loader: boolean = true;

  limit: any = 10;
  skip: number = 0;
  totalRecord: number = 0;
  filterdRecord: number = 0;
  fetchedRecord: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  startIndex: number = 0;
  endIndex: number = 10;
  totalPages: number = 0;
  startIndex2: number = 1;
  endIndex2: number = 10;

  isDisabled: string = '';
  isDisabled2: string = '';

  searchQuery = '';

  ngOnInit() {
    this.authToken = localStorage.getItem('access_token');
    this.getBulkNotificationLog(this.authToken, this.limit, 0, this.searchQuery);
  }

  getBulkNotificationLog(authToken: string, limit: string, skip: number, search: string): void {
    this.clientService.getBulkNotificationLog(authToken, limit, skip, search).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.bulkNotificationList = res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
          this.loader = false;
          if (this.fetchedRecord < this.limit) {
            if (this.fetchedRecord <= 10) {
              this.endIndex2 = this.totalRecord;
            } else {
              this.endIndex2 = this.fetchedRecord;
            }
            this.endIndex = this.fetchedRecord;
            this.startIndex = 0;
          }
          this.totalPages = Math.ceil(this.totalRecord / this.itemsPerPage);
        } else {
          this.bulkNotificationList = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader = false;
          this.endIndex = 0;
        }

      },
      error => {
        //Handel error
      }
    );
  }

  searchBulkNotificationData(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.searchQuery = inputElement.value;
    // console.log(this.searchQuery)
  }

  onSubmit(): void {
    if (this.searchQuery) {
      this.getBulkNotificationLog(this.authToken, this.limit, 0, this.searchQuery);
    } else {
      this.bulkNotificationList = []
      this.totalRecord = 0;
    }
    // console.log(this.searchQuery)
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecord) {
      this.currentPage++;

      // Calculate startIndex2 and endIndex2 based on the current page and itemsPerPage
      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.startIndex2 = this.startIndex + 1;
      this.endIndex2 = this.currentPage * this.itemsPerPage;

      // Ensure endIndex2 doesn't exceed the total records
      if (this.endIndex2 > this.totalRecord) {
        this.endIndex2 = this.totalRecord;
      }

      this.endIndex = this.startIndex + this.itemsPerPage;
      this.endIndex = this.endIndex - 10;

      // Fetch the new set of partners based on pagination
      this.getBulkNotificationLog(this.authToken, this.limit, this.endIndex, this.searchQuery);
      // Enable/disable pagination buttons
      this.isDisabled = this.currentPage > 1 ? "" : "disabled";
      this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }

  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      // Calculate startIndex and endIndex dynamically based on the current page
      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.startIndex2 = this.startIndex + 1;
      this.endIndex2 = this.currentPage * this.itemsPerPage;

      // Ensure endIndex2 doesn't exceed total records
      if (this.endIndex2 > this.totalRecord) {
        this.endIndex2 = this.totalRecord;
      }

      this.endIndex = this.startIndex + this.itemsPerPage;
      this.endIndex = this.endIndex - 10;

      // Fetch the previous set of partners based on pagination
      this.getBulkNotificationLog(this.authToken, this.limit, this.endIndex, this.searchQuery);
      // Enable/disable pagination buttons
      this.isDisabled = this.currentPage > 1 ? "" : "disabled";
      this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }
}
