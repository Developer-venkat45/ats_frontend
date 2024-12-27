import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, Candidate, total_record } from '../../core/model/model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import Swal from 'sweetalert2';
import { TreeSelectModule } from 'primeng/treeselect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { FormBuilder, Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';


@Component({
  selector: 'app-indent-candidate',
  standalone: true,
  imports: [NavbarComponent, FormsModule, TooltipModule, TreeSelectModule, NgxSkeletonLoaderModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './indent-candidate.component.html',
  styleUrl: './indent-candidate.component.css'
})
export class IndentCandidateComponent {
  indentService = inject(DashboardService);
  recommData: any[] = [];
  maxScore = 10;
  indentId: any = null;

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

  authToken: any = null;
  searchName: string = '';
  searchMobile: string = '';
  searchEducation: string = '';
  searchGender: string = '';
  searchState: string = '';
  searchCity: string = '';

  isDisabled: string = '';
  isDisabled2: string = '';

  loader: boolean = true;
  loader2: boolean = true;
  loaderCount: number = 10;

  loginUserName: any;
  loginUserId: any;
  stateData: any[] = [];
  cityData: any[] = [];
  selectedType: any;
  selectedIndent: any = '';
  indentData: any | null = null;
  partnerId: any = '';
  loginUserRole: any;

  fb = inject(FormBuilder);



  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.selectedIndent = this.route.snapshot.queryParamMap.get('indentid') || '';
    this.partnerId = localStorage.getItem('partner_id');
    // this.limit = this.route.snapshot.queryParamMap.get('limit');
    this.getAllCandidates(this.authToken, '', '', this.limit, '', '', '', '', this.skip, this.selectedIndent, this.partnerId);
    this.loginUserId = localStorage.getItem('id');
    this.loginUserRole = localStorage.getItem('role_name');
    this.loginUserName = localStorage.getItem('name');
    this.getStateData(this.authToken, '');
    if (this.selectedIndent != '') {
      this.getSingleIndent(this.selectedIndent);
    }
    console.log(this.selectedIndent)
  }



  getAllCandidates(authToken: string, name: string, mobile: string, limit: string, eduction: string, gender: string, state: string, city: string, skip: number, indentId: string, partnerId: string): void {
    this.indentService.getAllCandidates(authToken, name, mobile, limit, eduction, gender, state, city, skip, indentId, partnerId).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.recommData = res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
          this.loader = false;
          this.loader2 = false;
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
          this.recommData = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader = false;
          this.loader2 = false;
          this.endIndex = 0;
        }
      }
    );
  }

  getSingleIndent(indentId: string): void {
    this.indentService.getSingleIndentDetails(indentId).subscribe(
      (res: any) => {
        this.indentData = res.result;
      },
      error => {
        // Handle error
      }
    );
  }

  onStageChange(event: Event): void {
    const limit = (event.target as HTMLSelectElement).value;
    this.askConfirmation();
  }



  askConfirmation() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to recruit for this position?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, recruit!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Recruited!',
          'The recruitment process has been started.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'The recruitment process was cancelled.',
          'error'
        );
      }
    });
  }



  searchCanName(): void {
    this.searchName = this.searchName;
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
    this.loader2 = true;

  }

  searchCanMobile(): void {
    this.searchMobile = this.searchMobile;
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
    this.loader2 = true;
  }

  searchCanEducation(event: Event): void {
    const selectedValue1 = (event.target as HTMLSelectElement).value;
    this.searchEducation = selectedValue1
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
    this.loader2 = true;
  }

  searchCanGender(): void {
    this.searchGender = this.searchGender;
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
    this.loader2 = true;
  }

  // searchCanState():void{
  //   this.searchState = this.searchState;
  //   this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity); 
  // }

  searchCanCity(): void {
    this.searchCity = this.searchCity;
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
    this.loader2 = true;
  }

  onSearchSubmit(): void {
    if (this.searchName || this.searchMobile || this.searchEducation || this.searchGender || this.searchCity) {
      this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
      this.loader2 = true;
    } else {
      this.loader2 = false;
      this.searchName = '';
      this.searchMobile = '';
      this.searchEducation = '';
      this.searchGender = '';
      this.searchCity = '';
    }
  }


  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }


  resetFilter() {
    this.searchName = '';
    this.searchMobile = '';
    this.searchEducation = '';
    this.searchGender = '';
    this.searchState = '';
    this.searchCity = '';
    this.getAllCandidates(this.authToken, '', '', this.limit, '', '', '', '', 0, this.selectedIndent, this.partnerId);
  }
  onSelectChange(event: Event): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage; // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
  }
  getStateOnZoneChnage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    let selectedZoneId = 0;
    if (selectedStateName == 'East') selectedZoneId = 1;
    else if (selectedStateName == 'West') selectedZoneId = 4;
    else if (selectedStateName == 'North') selectedZoneId = 2;
    else if (selectedStateName == 'South') selectedZoneId = 3;
  }
  getStateData(authToken: string, zoneId: string): void {
    this.indentService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
      },
      error => {
        // Handle error
      }
    );
  }
  getCityOnStateChnage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    const selectedState = this.stateData.find(state => state.name === selectedStateName);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken, selectedStateId);
    this.searchState = this.searchState;
    this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.skip, this.selectedIndent, this.partnerId);
  }

  getCityData(authToken: string, stateId: string): void {
    this.indentService.getCity(authToken, stateId).subscribe(
      (res: any) => {
        this.cityData = res.result[0].data;
      },
      error => {
        // Handle error
      }
    );
  }
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecord) {
      this.currentPage++;

      if (this.currentPage == 1) {
        this.startIndex = 0;
        this.startIndex2 = 11;
        this.endIndex2 = this.itemsPerPage + 10;
      } else {
        this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.itemsPerPage + this.startIndex;
      }
      this.endIndex = this.startIndex + this.itemsPerPage;
      this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.endIndex, this.selectedIndent, this.partnerId);
      // console.log(this.startIndex, this.endIndex2)

      if (this.currentPage > 1) {
        this.isDisabled = "";
      } else {
        this.isDisabled = "disabled";
      }


      if (this.currentPage < this.totalPages) {
        this.isDisabled2 = "";
      } else {
        this.isDisabled2 = "disabled";
      }

      this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.endIndex, this.selectedIndent, this.partnerId);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      if (this.currentPage == 1) {
        this.endIndex = 0;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.itemsPerPage + this.startIndex;
      } else {
        this.endIndex = this.startIndex + this.itemsPerPage;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.itemsPerPage + this.startIndex;
      }
      this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.endIndex, this.selectedIndent, this.partnerId);

      if (this.currentPage > 1) {
        this.isDisabled = "";
      } else {
        this.isDisabled = "disabled";
      }

      if (this.currentPage < this.totalPages) {
        this.isDisabled2 = "";
      } else {
        this.isDisabled2 = "disabled";
      }

      this.getAllCandidates(this.authToken, this.searchName, this.searchMobile, this.limit, this.searchEducation, this.searchGender, this.searchState, this.searchCity, this.endIndex, this.selectedIndent, this.partnerId);
    }
  }

}
