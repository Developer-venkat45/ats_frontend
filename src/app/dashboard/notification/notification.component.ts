import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { constant } from '../../core/constant/constant';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgxSkeletonLoaderModule,CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{ 
  
  indedentService = inject(DashboardService);
  authToken: any='';
  apiURL:any;
  notificationData: any[] = [];
  loginUserId: any;
  totalRecord: number = 0;
  loader: boolean = true;
  loaderCount: number = 10;
  UpdateNotificationData: any[] = [];

  limit:any = 10;
  skip:number = 0;
  // totalRecord:number = 0;
  filterdRecord:number = 0;
  fetchedRecord:number = 0;
  currentPage:number = 1;
  itemsPerPage:number = 10;
  startIndex:number = 0;
  endIndex:number = 10;
  totalPages:number = 0;
  startIndex2:number = 1;
  endIndex2:number = 10;
  sanitizedContent: SafeHtml = '';
  isDisabled: string='';
  isDisabled2: string='';
  
  UpdateNotificationViewData: any [] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private messageService: MessageService, private sanitizer: DomSanitizer) { 
    this.apiURL= environment.apiURL;
    this.loginUserId = localStorage.getItem('id');
  }
  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getAllNotification(this.authToken,this.loginUserId, this.limit,0);
  }

  // Helper method to create an array of numbers
  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  getAllNotification(authToken: string, id: string, limit: string, skip: number): void {
    this.indedentService.getAllNotification(authToken,id, limit, skip).subscribe(
      (res: any) => {
      if(res.status == 1){
        this.notificationData = res.result;
        this.totalRecord = res.total_record;
        this.filterdRecord = res.filter_record;
        this.fetchedRecord = res.fetched_record;
        this.loader = false;
        if(this.fetchedRecord < this.limit){
          if(this.fetchedRecord <= 10){
            this.endIndex2 = this.totalRecord;
          }else{
            this.endIndex2 = this.fetchedRecord;
          }
          this.endIndex = this.fetchedRecord;
          this.startIndex = 0;
        }
        this.totalPages = Math.ceil(this.totalRecord / this.itemsPerPage);
        this.updateNotificationViewStatus(this.notificationData);
        var i = 0;
        for (const notif of this.notificationData) {
          this.notificationData[i]['message'] = this.sanitizer.bypassSecurityTrustHtml(notif.message);
          //console.log(notif.message);
          i++;
        }
      }else{
        this.notificationData = [];
        this.totalRecord = 0;
        this.filterdRecord = 0;
        this.fetchedRecord = 0;
        this.loader = false;
        this.endIndex = 0;
      }
      },
      error => {
        // Handle error
      }
    );
  }

  
  onRemoveNotification(index: any){
    this.updateNotificationStatus(this.authToken,this.notificationData[index]["_id"],false);
  }


  updateNotificationStatus(authToken: string, id: string, status: boolean): void {
    this.indedentService.updateNotificationStatus(authToken,id, status).subscribe(
      (res: any) => {
      if(res.status === 1){
        this.UpdateNotificationData = res.result;
        
      }else{
        this.UpdateNotificationData = [];
      }
        
      },
      error => {
        // Handle error
      }
    );
  }


  async updateNotificationViewStatus(notificationData: any[]){
    this.authToken = localStorage.getItem('access_token');
    const notificationIds = notificationData.map((notification) => notification._id);
    const data = {
      'view': true,
      'notification_ids': notificationIds
    }
    const url = `${environment.apiURL}${constant.apiEndPoint.UPDATENOTIFICATIONVIEWSTATUS}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });

    this.http.put<any>(url, data, { headers })
      .subscribe(
        response => {
          if(response.status === 1) {
          
          }
        }
      );
  }




  onSelectChange(event: any): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage; // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;

    // Fetch the data for the new itemsPerPage value
    this.getAllNotification(this.authToken,this.loginUserId, this.limit,0);
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

        this.endIndex = this.startIndex + this.itemsPerPage - 10;
        
        // Fetch the new set of partners based on pagination
        this.getAllNotification(this.authToken,this.loginUserId, this.limit,this.endIndex);

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

        this.endIndex = this.startIndex + this.itemsPerPage-10;

        // Fetch the previous set of partners based on pagination
        this.getAllNotification(this.authToken,this.loginUserId, this.limit,this.endIndex);
        // Enable/disable pagination buttons
        this.isDisabled = this.currentPage > 1 ? "" : "disabled";
        this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }

}
