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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [TableModule, RouterModule, InputTextModule, InputIconModule, IconFieldModule, CommonModule, FormsModule, NgxSkeletonLoaderModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  clientService = inject(DashboardService);
  authToken: any;
  loader: boolean = true;
  apiURL: any;
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
  partnerList: any[] = [];
  serialNumber: number = 0;
  searchFirmName: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiURL;
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getAllPartner(this.authToken, '', '', '', this.limit, this.skip, '', 'approved', '', '', '');
  }



  getAllPartner(authToken: string, id: string, name: string, firmName: string, limit: string, skip: number, approve: string, accStatus: string, industry: string, location: string, partnerType: string): void {
    this.clientService.getAllPartner(authToken, id, name, firmName, limit, skip, approve, accStatus, industry, location, partnerType).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.partnerList = res.result;
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
          var i = 0;
          for (const data of this.partnerList) {
            const expirationDate = new Date(data.aggrementExpirationdate);
            const currentDate = new Date();
            if (expirationDate < currentDate) {
              this.partnerList[i]['expired'] = true;
            } else {
              this.partnerList[i]['expired'] = false;
            }
            i++;
          }
        } else {
          this.partnerList = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader = false;
          this.endIndex = 0;
        }
        // console.log(this.partnerList)
      },
      error => {
        // Handle error
      }
    );
  }


  searchPartnerVendorName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchFirmName = inputElement.value;
  }

  searchPartner(): void {
    if (this.searchFirmName) {
      this.getAllPartner(this.authToken, '', '', this.searchFirmName, this.limit, 0, '', '', '', '', '');
    } else {
      this.searchFirmName = '';
    }
    // console.log(this.searchFirmName);
  }


  getAllPartnerDataDownload(authToken: string, fileType: 'excel' | 'csv'): void {
    this.clientService.getAllPartnerDataDownload(authToken, fileType).subscribe(
      (response: HttpResponse<Blob>) => {
        // Access the Blob from the response body
        const blob = new Blob([response.body!], { type: this.getFileMimeType(fileType) });
        const downloadURL = window.URL.createObjectURL(blob);
        // Create a download link
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = `partner_data.${fileType === 'excel' ? 'xlsx' : 'csv'}`;
        link.click();

        // Clean up the object URL
        window.URL.revokeObjectURL(downloadURL);
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }

  getFileMimeType(fileType: string): string {
    return fileType === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv';
  }


  downloadFile(event: Event, downloadType: 'excel' | 'csv'): void {
    const authToken = this.authToken;
    this.getAllPartnerDataDownload(authToken, downloadType);
    this.isLoading = false;
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
      this.getAllPartner(this.authToken, '', '', '', this.limit, this.endIndex, '', '', '', '', '');
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
      this.getAllPartner(this.authToken, '', '', '', this.limit, this.endIndex, '', '', '', '', '');
      // Enable/disable pagination buttons
      this.isDisabled = this.currentPage > 1 ? "" : "disabled";
      this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }
}
