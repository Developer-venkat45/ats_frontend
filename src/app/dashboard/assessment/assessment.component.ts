import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, APIResponseModel } from '../../core/model/model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [NavbarComponent, DialogModule, ButtonModule, InputTextModule, AvatarModule, NgxSkeletonLoaderModule, FormsModule, RouterModule, ToastModule, ReactiveFormsModule, NgMultiSelectDropDownModule, CommonModule],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})
export class AssessmentComponent implements OnInit {
  clientService = inject(DashboardService);
  apiMessage: any = "";
  authToken: any = "";
  assessmentList: any[] = [];
  assessmentCatData: any[] = [];
  loader: boolean = true;
  loader2: boolean = true;
  loaderCount: number = 10;
  searchAssessmentTitle: any = '';
  searchAssessmentCategory: any = '';
  displayModalAdd: boolean = false;
  addEnadiCategory: boolean = false;
  total_record: any;
  visible: boolean = false;
  isBtnLoading: boolean = false;
  isFormSubmited: boolean = false;
  isFormSubmited2: boolean = false;
  apiMessage2: any = "";
  overallFormValid2: string = "";
  overallFormValid: string = "";
  dropdownSettings: IDropdownSettings = {};
  enadiWeightage: any[] = [];
  questionModalView: boolean = false;
  selectedAssessment: any;

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


  fb = inject(FormBuilder);



  showDialog() {
    this.visible = true;
    this.getAllAssessment(this.authToken, '', '', '', this.limit, this.skip);
  }

  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getAllAssessment(this.authToken, '', '', '', this.limit, this.skip);
    this.getAllAssessmentCategory(this.authToken, 'eandiCategory');

    this.dropdownSettings = {
      idField: 'item_text',
      textField: 'item_text',
      enableCheckAll: false,
      itemsShowLimit: 3,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };
  }


  getAllAssessment(authToken: string, id: string, title: string, category: string, limit: string, skip: number): void {
    this.clientService.getAllAssessment(authToken, id, title, category, limit, skip).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.assessmentList = res.result;
          this.total_record = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
          this.loader = false;
          this.loader2 = false;
          var i = 0;
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
          for (const assessment of this.assessmentList) {
            let weightageSum = 0;
            for (const assessment2 of assessment?.questions) {
              weightageSum += assessment2.weightage;
            }
            this.enadiWeightage[i] = weightageSum;
            i++;
          }
        } else {
          this.assessmentList = [];
          this.total_record = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader = false;
          this.loader2 = false;
          this.endIndex = 0;
        }
      },
      error => {
        // Handle error
      }
    );
  }



  getAllAssessmentCategory(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.assessmentCatData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }

  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }


  searchTitle(event: Event): void {
    const selectedValue = event.target as HTMLInputElement;
    this.searchAssessmentTitle = selectedValue.value;
    this.getAllAssessment(this.authToken, '', this.searchAssessmentTitle, this.searchAssessmentCategory, this.limit, this.skip);
    this.loader2 = true;
  }

  searchCategory(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchAssessmentCategory = selectedValue;
    this.getAllAssessment(this.authToken, '', this.searchAssessmentTitle, this.searchAssessmentCategory, this.limit, this.skip);
    this.loader2 = true;
  }

  onSearchSubmit(): void {
    if (this.searchAssessmentTitle || this.searchAssessmentCategory) {
      this.getAllAssessment(this.authToken, '', this.searchAssessmentTitle, this.searchAssessmentCategory, this.limit, this.skip);
      this.loader2 = true;
    } else {
      this.loader2 = false;
      this.searchAssessmentTitle = '';
      this.searchAssessmentCategory = '';
      this.total_record = 0;
    }

  }

  resetFilter() {
    this.searchAssessmentTitle = '';
    this.searchAssessmentCategory = '';
    this.getAllAssessment(this.authToken, '', '', '', this.limit, this.skip);
  }



  allQuestions(item: any) {
    this.questionModalView = true;
    this.selectedAssessment = item;
  }



  addEandi() {
    this.displayModalAdd = true;
  }


  addEnadiCategoryData() {
    this.addEnadiCategory = true;
  }

  insertEandiForm = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required]
  })

  // async InsertData(url = '', data={}, authToken: string) {
  //   return fetch(url, {
  //     method: 'POST', 
  //     mode: 'cors',
  //     cache: 'no-cache',
  //     headers: {
  //       'Authorization': `Bearer ${authToken}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   })
  //   .then(response => response.json());
  // }


  // async insertEandi(){
  //   this.isBtnLoading = true;
  //   this.isFormSubmited = true;
  //   const data = this.insertEandiForm.value;
  //   this.authToken = localStorage.getItem('access_token');

  //   if(this.insertEandiForm.valid){
  //     this.InsertData(environment.apiURL+constant.apiEndPoint.ADDASSESSMENT, data, this.authToken)
  //     .then(data => {
  //       if(data.status == 1){
  //         this.isBtnLoading = false;
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
  //         this.getAllAssessment(this.authToken, '', '', '');
  //       }else{
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
  //         this.isBtnLoading = false;
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  //     // this.overallFormValid = '';
  //   }else{
  //     // this.overallFormValid = "Please fill the form correctly";
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
  //     this.isBtnLoading = false;
  //   }
  // }


  async insertEandi() {
    this.isBtnLoading = true;
    this.isFormSubmited = true;
    const data = this.insertEandiForm.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.insertEandiForm.valid) {
      this.http.post<any>(`${environment.apiURL}${constant.apiEndPoint.ADDASSESSMENT}`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isBtnLoading = false;
          if (response.status === 1) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.getAllAssessment(this.authToken, '', '', '', this.limit, this.skip);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isBtnLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the assessment.' });
        }
      );
      // this.overallFormValid = '';
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

  insertEandiCategoryForm = this.fb.group({
    name: ['', Validators.required],
  })

  async insertEandiCategory() {
    this.isBtnLoading = true;
    this.isFormSubmited2 = true;
    const data = this.insertEandiCategoryForm.value;
    const dataType = this.insertEandiCategoryForm.controls.name.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.insertEandiCategoryForm.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.ADDINSERTEANDI}?type=eandiCategory&data=` + dataType;

      this.http.post<any>(url, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isBtnLoading = false;
          if (response.status === 1) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isBtnLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the eandi category.' });
        }
      );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecord) {
      this.currentPage++;

      if (this.currentPage == 2) {
        this.startIndex = 0;
        this.startIndex2 = 11;
        this.endIndex2 = this.itemsPerPage + 10;
      } else {
        this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.itemsPerPage + this.startIndex;
      }
      this.endIndex = this.startIndex + this.itemsPerPage;

      this.getAllAssessment(this.authToken, '', this.searchAssessmentTitle, this.searchAssessmentCategory, this.limit, this.endIndex);



      console.log(this.startIndex, this.endIndex2)



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



    }

    // if(this.currentPage < this.totalPages){

    // }
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

      // this.getAllIndent(this.authToken, this.limit, this.searchCategory, '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.endIndex);
      this.getAllAssessment(this.authToken, '', this.searchAssessmentTitle, this.searchAssessmentCategory, this.limit, this.endIndex);


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
    }
  }
}
