import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, ClientResponse } from '../../core/model/model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-partner-details',
  standalone: true,
  imports: [RouterModule, CommonModule,NgxSkeletonLoaderModule,TooltipModule],
  templateUrl: './partner-details.component.html',
  styleUrl: './partner-details.component.css'
})
export class PartnerDetailsComponent implements OnInit {

  partnerService = inject(DashboardService);
  partnerList: any;
  baseAPIURL:any;
  loader: boolean =true;
  pancardImageUrl: string = '../assets/images/preview.png';
  gstImageUrl: string = '../assets/images/preview.png';
  msmeImageUrl: string = '../assets/images/preview.png';
  chequeImageUrl: string = '../assets/images/preview.png';
  indentList: any [] = [];
  loginUserRole: string ='';
  
  authToken: any = null;
  jobCategory: any = '';
  jobLocation: any = '';
  recruiterId: any = '';
  candidateId: any = '';
  skip:number = 0;
  partnerId: any = '';
  limit:any =10;

  recommData: any[] = [];
  searchName: string = '';
  searchMobile: string = '';
  searchEducation: string = '';
  searchGender: string = '';
  searchState: string ='';
  searchCity: string = '';

  totalRecord:number = 0;
  filterdRecord:number = 0;
  fetchedRecord:number = 0;
  currentPage:number = 1;
  itemsPerPage:number = 10;
  startIndex:number = 0;
  endIndex:number = 10;
  totalPages:number = 0;
  startIndex2:number = 1;
  endIndex2:number = 10;
  
  isDisabled: string='';
  isDisabled2: string='';

  clickIndentCount: number = 0;
  clickCandidateCount: number = 0

  constructor(private route: ActivatedRoute) {
    this.baseAPIURL= environment.apiURL;
  }

  ngOnInit(): void {
    const authToken:any = localStorage.getItem('access_token');
    const partnerId: any = this.route.snapshot.paramMap.get('id')!;
    this.getPartner(authToken,partnerId);
    const user: any = localStorage.getItem('user');
    this.loginUserRole = user;
  }

  getPartner(authToken: string, id: string): void {
    this.partnerService.getSinglePartner(authToken, id).subscribe(
      (res: any) => {
        this.partnerList = res.result[0];
        this.loader = false;
        if(this.partnerList.pancardImage != ""){ 
          const fileExtensionPancard = this.partnerList.pancardImage.split('.').pop()?.toLowerCase();
          if(fileExtensionPancard != 'pdf'){
            this.pancardImageUrl = environment.apiURL+''+this.partnerList.pancardImage;
          }else{
            this.pancardImageUrl = '../assets/images/pdfpreview.png';
          }
        }

        if(this.partnerList.gstinImage != null){ 
          const fileExtensionGst = this.partnerList.gstinImage.split('.').pop()?.toLowerCase();
          if(fileExtensionGst != 'pdf'){
            this.gstImageUrl = environment.apiURL+this.partnerList.gstinImage; 
          }else{
            this.gstImageUrl = '../assets/images/pdfpreview.png';
          }
        }

        if(this.partnerList.msmeImage != null){ 
          const fileExtensionMsmse = this.partnerList.msmeImage.split('.').pop()?.toLowerCase();
          if(fileExtensionMsmse != 'pdf'){
            this.msmeImageUrl = environment.apiURL+this.partnerList.msmeImage; 
          }else{
            this.msmeImageUrl = '../assets/images/pdfpreview.png';
          }
        }
        
        if(this.partnerList.chequeImage != ""){ 
          const fileExtensionCheque = this.partnerList.chequeImage.split('.').pop()?.toLowerCase();
          if(fileExtensionCheque != 'pdf'){
            this.chequeImageUrl = environment.apiURL+''+this.partnerList.chequeImage; 
          }else{
            this.chequeImageUrl = '../assets/images/pdfpreview.png';
          }
        }

        const expirationDate = new Date(this.partnerList.aggrementExpirationdate);
        const currentDate = new Date();
        if (expirationDate < currentDate) {
          this.partnerList.expired = true;
        } else {
          this.partnerList.expired = false;
        }
      },
      error => {
        // Handle error
      }
    );
  }


  getAllIndent(authToken: string, limit: string, category: string, searchQuery: string, searchLocationData: string, clientId: string, timePeriod: string, indentType: string, recruiterId: string, candidateId: string, partnerId: string, skip: number): void {
    this.partnerService.getAllIndent(authToken, limit, category, searchQuery, searchLocationData, clientId, timePeriod, indentType, recruiterId, candidateId, partnerId, skip).subscribe(
      (res: any) => {
        this.indentList = res.result;
      }
    );
  }

  onIndentsClick():void{
    this.clickIndentCount++
    if(this.clickIndentCount == 1){
      const authToken:any = localStorage.getItem('access_token');
      const partnerId: any = this.route.snapshot.paramMap.get('id')!;
      this.getAllIndent(this.authToken, this.limit, this.jobCategory, '',this.jobLocation, '', '','', this.recruiterId, this.candidateId, partnerId, this.skip);
    }else{
      this.clickIndentCount = 1;

    }
    
  }



  getAllCandidates(authToken: string, name: string, mobile: string, limit: string, eduction: string, gender: string, state: string, city: string, skip: number, indentId: string, partnerId: string): void {
    this.partnerService.getAllCandidates(authToken, name, mobile, limit, eduction, gender, state, city, skip, indentId, partnerId).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.recommData = res.result;
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
        }else{
          this.recommData = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader = false;
          this.endIndex = 0;
        }
      }
    );
  }

  onCandidatesClick():void{
    this.clickCandidateCount++
    if(this.clickCandidateCount == 1){
    const authToken:any = localStorage.getItem('access_token');
    const partnerId: any = this.route.snapshot.paramMap.get('id')!;
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, '', partnerId);
    }else{
      this.clickCandidateCount = 1;
    }
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
        this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.endIndex, '', this.partnerId); 

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
        this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.endIndex, '', this.partnerId); 

        // Enable/disable pagination buttons
        this.isDisabled = this.currentPage > 1 ? "" : "disabled";
        this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }

}
