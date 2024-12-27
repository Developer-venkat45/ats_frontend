import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, APIResponseModel } from '../../core/model/model';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeSelectModule } from 'primeng/treeselect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-eandi',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, NgMultiSelectDropDownModule, MultiSelectModule, CommonModule, FormsModule, NgxSkeletonLoaderModule, TreeSelectModule, ToastModule, RouterModule],
  templateUrl: './eandi.component.html',
  styleUrl: './eandi.component.css'
})
export class EandiComponent implements OnInit {
  clientService = inject(DashboardService);
  authToken: any = "";
  eandiList: any[] = [];
  assessmentCatData: any[] = [];
  loader: boolean = true;
  loader2: boolean = true;
  loaderCount: number = 9;
  displayModalAdd: boolean = false;
  fb = inject(FormBuilder);
  categoryData: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  apiMessage: any = "";
  isFormSubmited: boolean = false;
  overallFormValid: string = "";
  questionModalAdd: boolean = false;
  addEnadiCategory: boolean = false;
  apiMessage2: any = "";
  isFormSubmited2: boolean = false;
  overallFormValid2: string = "";
  apiMessage3: any = "";
  isFormSubmited3: boolean = false;
  overallFormValid3: string = "";
  questionModalView: boolean = false;
  selectedEandi: any;
  total_record: any;
  isBtnLoading: boolean = false;
  isBtnLoading2: boolean = false;
  searchEandiCategory: any = '';
  searchEandiName: any = "";
  weightageSum: number = 0;
  enadiWeightage: any[] = [];

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
  displayModalUpdate: boolean = false;
  currentEandiId: string = '';
  eandiData: any;
  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');

    this.getAlleandi(this.authToken, '', '', '', this.limit, 0);
    this.getAllAssessmentCategory(this.authToken, 'eandiCategory')

    this.dropdownSettings = {
      idField: 'item_text',
      textField: 'item_text',
      enableCheckAll: false,
      itemsShowLimit: 3,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };

    this.categoryData = ['Bachelor of Technology (B.Tech)', 'Master of Technology (M.Tech)'];
  }

  getAlleandi(authToken: string, id: string, title: string, category: string, limit: string, skip: number): void {
    this.clientService.getAlleandi(authToken, id, title, category, limit, skip).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.eandiList = res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
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
          for (const eandi of this.eandiList) {
            let weightageSum = 0; // Reset weightageSum for each eandi
            for (const eandi2 of eandi?.questions) {
              weightageSum += eandi2.weightage;
            }
            this.enadiWeightage[i] = weightageSum;
            i++;
          }

          this.total_record = res.total_record;
          this.loader = false;
          this.loader2 = false;
        } else {
          this.eandiList = [];
          this.total_record = 0;
          this.totalRecord = 0;
          this.loader = false;
          this.loader2 = false;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
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
  //     this.InsertData(environment.apiURL+constant.apiEndPoint.ADDEANDI, data, this.authToken)
  //     .then(data => {
  //       if(data.status == 1){
  //         this.isBtnLoading = false;
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
  //         this.getAlleandi(this.authToken,'','','');
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
      const url = `${environment.apiURL}${constant.apiEndPoint.ADDEANDI}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isBtnLoading = false;
            if (response.status === 1) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.getAlleandi(this.authToken, '', '', '', '', this.skip);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the Eandi.' });
          }
        );
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
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isBtnLoading = false;
            if (response.status === 1) {
              this.getAlleandi(this.authToken, '', '', '', '', 0);
              this.getAllAssessmentCategory(this.authToken, 'eandiCategory');
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the Eandi Category.' });
          }
        );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }






  addQuestion(item: any) {
    this.questionModalAdd = true;
    this.populateClientEditForm(item);
    console.log(item);
  }

  insertEandiQuestion = this.fb.group({
    eandiId: ['', Validators.required],
    questions: this.fb.array([
      this.fb.group({
        question: ['', Validators.required],
        question_type: ['', Validators.required]
      })
    ])
  });


  get questionGroups() {
    return this.insertEandiQuestion.get('questions') as FormArray;
  }

  addMoreQuestion() {
    this.questionGroups.push(
      this.fb.group({
        question: ['', Validators.required],
        question_type: ['', Validators.required]
      })
    );
  }

  removeQuestion(index: number) {
    this.questionGroups.removeAt(index);
  }

  populateClientEditForm(item: any): void {
    if (item) {
      this.insertEandiQuestion.patchValue({
        eandiId: item
      });
    }
  }


  async insertEandiQuestions() {
    this.isBtnLoading = true;
    this.isFormSubmited3 = true;
    const data = this.insertEandiQuestion.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.insertEandiQuestion.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.ADDEANDIQUESTION}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isBtnLoading = false;
            if (response.status === 1) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.insertEandiQuestion.reset();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the Eandi question.' });
          }
        );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }



  allQuestions(item: any) {
    this.questionModalView = true;
    this.selectedEandi = item;
  }


  searchName(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    this.searchEandiName = selectedValue
    this.getAlleandi(this.authToken, '', this.searchEandiName, this.searchEandiCategory, this.limit, this.skip);
    this.loader2 = true;
  }

  searchCategory(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchEandiCategory = selectedValue;
    this.getAlleandi(this.authToken, '', this.searchEandiName, this.searchEandiCategory, this.limit, this.skip);
    this.loader2 = true;
  }

  onSearchSubmit(): void {
    if (this.searchEandiName || this.searchEandiCategory) {
      this.getAlleandi(this.authToken, '', this.searchEandiName, this.searchEandiCategory, this.limit, this.skip);
      this.loader2 = true;
    } else {
      this.loader2 = false;
      this.searchEandiName = '';
      this.searchEandiCategory = '';
      this.totalRecord = 0;
    }
  }



  resetFilter() {
    this.searchEandiName = '';
    this.searchEandiCategory = '';
    this.getAlleandi(this.authToken, '', '', '', '', this.skip);
  }


  onSelectChange(event: any): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage; // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;
    // Fetch the data for the new itemsPerPage value
    this.getAlleandi(this.authToken, '', this.searchEandiName, this.searchEandiCategory, this.limit, 0);

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
      this.getAlleandi(this.authToken, '', this.searchEandiName, this.searchEandiCategory, this.limit, this.endIndex);

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
      this.getAlleandi(this.authToken, '', this.searchEandiName, this.searchEandiCategory, this.limit, this.endIndex);

      // Enable/disable pagination buttons
      this.isDisabled = this.currentPage > 1 ? "" : "disabled";
      this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }
  


  async cloneEandi(id: any) {
    this.isBtnLoading2 = true;

    if (id != '' && id != null) {
      const url = `${environment.apiURL}${constant.apiEndPoint.CLONEENI}?eandiId=${id}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`
      });

      this.http.post<any>(url, { headers })
        .subscribe(
          response => {
            this.isBtnLoading2 = false;
            if (response.status === 1) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.getAlleandi(this.authToken, '', '', '', '', this.skip);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading2 = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the Eandi.' });
          }
        );
    } else {
      this.isBtnLoading2 = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something error, Try again!' });
    }
  }


  updateEandiForm = this.fb.group({
    title: [''],
    category: ['']
  })


  showEditModel(item: any) {
    this.displayModalUpdate = true;
    this.updateEandiForm.patchValue({
      title: item.title,
      category: item.category
    })
    this.currentEandiId = item._id;
  }


  async updateEandI() {
    this.isBtnLoading = true;
    this.isFormSubmited = true;
    const data = this.updateEandiForm.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.updateEandiForm.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATEEANDI}?id=${this.currentEandiId}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isBtnLoading = false;
            if (response.status === 1) {
              this.getAlleandi(this.authToken, '', '', '', '', this.skip);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.displayModalUpdate = false;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the Eandi question.' });
          }
        );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

}
