import { Component, ElementRef, OnInit, inject, ViewChild, } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { JobDetailsResponse, JobDetailsResponse3, total_record } from '../../core/model/model';
import { indentDetails } from '../../core/model/indent_model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DatePipe} from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-indent',
  standalone: true,
  imports: [RouterModule, FormsModule, TooltipModule, NgxSkeletonLoaderModule, DatePipe, OverlayPanelModule, CommonModule, DialogModule, NgMultiSelectDropDownModule, ReactiveFormsModule, ToastModule],
  templateUrl: './indent.component.html',
  styleUrl: './indent.component.css'
})
export class IndentComponent {

  indentService = inject(DashboardService);
  indentList: any [] = [];
  
  authToken: any = null;
  clientId: any = null;
  selectedIndentStatus: string;
  selectedIndentId: string;
  updatedIndentId: any;
  apiMessage:any="";
  isShown: boolean = false;
  isShown2: boolean = false;
  isShown3: boolean = true;
  isShown4: boolean = false;
  isShown5: boolean = false;
  isLoggedIn:boolean = false;
  limit:any = 10;
  skip:number = 0;
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
  isBtnLoading: boolean= false;
  partnerTouched: boolean = false;

  loader: boolean = true;
  loaderCount: number = 10;
  visible: boolean = false;
  indentStatusModal: boolean = false;
  currentStatus: any;
  apiMessage4:any="";
  isFormSubmited4: boolean = false;
  overallFormValid4: string = "";
  apiMessage5:any="";
  isFormSubmited5: boolean = false;
  overallFormValid5: string = "";
  assignPartnerModal: boolean = false;
  indentLocationModal: boolean = false;
  indentLocationStatusModal: boolean = false;
  currentLocatonStatus:any;
  apiMessage6:any="";
  isFormSubmited6: boolean = false;
  overallFormValid6: string = "";
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings={};
  fb = inject(FormBuilder);

  applyModal: boolean = false;
  myProfileData: any;
  loginUserId: any;
  loginUserName: any;
  recruiterId: any = '';
  candidateId: any = '';
  partnerId: any = '';
  isSuperAdmin: boolean = false;

  recruiterData: any[] = [];
  partnerData: any[] = [];
  jobCategory: any = '';
  jobLocation: any = '';
  isDisabled: string='';
  isDisabled2: string='';
  searchCategory: any='';
  loginUserRole:any;
  indentStaging: any;
  indentLocationList: any;
  indentCurrentLocation: any;
  partnerList: any;
  invalidField: any = [];
  isLocationloader:boolean = true;
  isAllow: boolean= true;
  partnerExpired:boolean = false;
  allIndentDataShow: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private http: HttpClient) { 
    this.selectedIndentStatus = '1';
    this.selectedIndentId = '';
    this.loginUserId = localStorage.getItem('id');
    this.loginUserRole = localStorage.getItem('role_name');
    this.loginUserName = localStorage.getItem('name');

    if(this.loginUserRole == 'Partner SPOC - Manager'){
      this.partnerId = localStorage.getItem('partner_id');
      this.getPartner(this.authToken,this.partnerId);
    }
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.queryParamMap.get('client');
    //this.limit = this.route.snapshot.queryParamMap.get('limit');
    this.authToken = localStorage.getItem('access_token');
    
    this.jobCategory = this.route.snapshot.paramMap.get('jobCategory')!;
    this.jobLocation = this.route.snapshot.paramMap.get('jobLocation')!;

    if(this.jobCategory != null){
      this.jobCategory = this.jobCategory;
    }else{
      this.jobCategory = '';
    }
    if(this.jobLocation != null){
      this.jobLocation = this.jobLocation;
    }else{
      this.jobLocation = '';
    }


    if(this.currentPage > 1){
      this.isDisabled = "";
    }else{
      this.isDisabled = "disabled";
    }

    if(this.currentPage > this.totalPages){
      this.isDisabled2 = "";
    }else{
      this.isDisabled2 = "disabled";
    }
    
    
    

    const user: any = localStorage.getItem('user');
    if(user == 3){
      this.isShown = false;
    }else{
      this.isShown = true;
    }
    if(user == 'Super Admin'){
      this.isSuperAdmin = true;
    }
    if (user == 'Candidate'){
      this.isShown = false;
      this.isShown2 = false;
      this.isShown4 = true;
    }else if(user == 'Recruiter'){
      //this.recruiterId = this.loginUserId;
      this.isShown2 = true;
      this.isShown3 = false;
      this.isShown4 = true;
      this.isShown5 = true;
    }else if(user == 'Partner SPOC - Recruiter' || user == 'Partner SPOC - Manager' || user == 'Partner Manager'){
      this.partnerId = localStorage.getItem('partner_id');
      this.isShown2 = true;
      this.isShown3 = false;
      this.isShown4 = false;
      this.isShown5 = false;
    }else{
      this.isShown2 = true;
      this.isShown4 = true;
      this.isShown5 = true;
    }
    const localData: any = localStorage.getItem('access_token');
    if (localData !== null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    if (user != 'Candidate'){
      this.getAllIndent(this.authToken, this.limit, this.jobCategory, '',this.jobLocation, this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.skip);
    }else{
      this.getUserCandidateData(this.authToken,this.loginUserId);
    }

    this.dropdownList = [
      { item_id: "6651780e7aedb49b9fefd882", item_text: 'Recruiter' },
      { item_id: "6659ac42daa103fabb77fdae", item_text: 'Jhon Duke' },
    ];



    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll:false,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };

  }

  getIndentLocationData(id: string): void {
    this.indentService.getIndentLocationStatus(id).subscribe(
      (res: any) => {
        this.indentLocationList = res.data;
        this.isLocationloader=false;
      },
      error => {
        // Handle error
      }
    );
  }

  getPartner(authToken: string, id: string): void {
    this.indentService.getSinglePartner(authToken, id).subscribe(
      (res: any) => {
        this.partnerList = res.result[0];
        const expirationDate = new Date(this.partnerList.aggrementExpirationdate);
        const currentDate = new Date();
        if (expirationDate < currentDate) {
          this.partnerList.expired = true;
          this.partnerExpired = true;
        } else {
          this.partnerList.expired = false;
          this.partnerExpired = false;
        }
      },
      error => {
        // Handle error
      }
    );
  }



  getUserCandidateData(authToken: string, id: string): void {
    this.indentService.getUserCandidateData(authToken, id).subscribe(
      (res: any) => {
        this.myProfileData = res.result;
        this.candidateId = this.myProfileData?._id;
        this.getAllIndent(this.authToken, this.limit, '', '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.skip);
        //this.populateCandidateEditForm(this.myProfileData);

        if(this.myProfileData?.resume_path == '' || this.myProfileData?.resume_path == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please upload your CV')
        }

        if(this.myProfileData?.dob == '' || this.myProfileData?.dob == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please enter your dob')
        }

        if(this.myProfileData?.highestQualification == '' || this.myProfileData?.highestQualification == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please update highest qualification')
        }

        if(this.myProfileData?.highestQualificationPassedOn == '' || this.myProfileData?.highestQualificationPassedOn == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please update highest qualification passed year')
        }

        if(this.myProfileData?.highestQualificationPercentage === '' || this.myProfileData?.highestQualificationPercentage === null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please update highest qualification percentage')
        }

        if(this.myProfileData?.totWorkExp == '' || this.myProfileData?.totWorkExp == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please update total work experience')
        }

        if(this.myProfileData?.gender == '' || this.myProfileData?.gender == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please update gender')
        }

        if(this.myProfileData?.city == '' || this.myProfileData?.city == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please update your city')
        }

        if(this.myProfileData?.skills == '' || this.myProfileData?.skills == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please upload Update skills')
        }

        if(this.myProfileData?.education == '' || this.myProfileData?.education == null){
          this.isAllow = false;
          this.allIndentDataShow = false;
          this.invalidField.push('Please upload your education details')
        }

      },
      error => {
        // Handle error
      }
    );
  }


  // Helper method to create an array of numbers
  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  getAllIndent(authToken: string, limit: string, category: string, searchQuery: string, searchLocationData: string, clientId: string, timePeriod: string, indentType: string, recruiterId: string, candidateId: string, partnerId: string, skip: number): void {
    this.indentService.getAllIndent(authToken, limit, category, searchQuery, searchLocationData, clientId, timePeriod, indentType, recruiterId, candidateId, partnerId, skip).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.indentList = res.result;
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

          // var i = 0;
          // for (const item of this.indentList) {
          //   this.indentStaging = this.convertStageingToArray2(this.indentList[i].indentStep5);
          //   this.indentList[i]['newstage'] = this.convertStageingToArray2(this.indentList[i].indentStep5);
          //   this.indentList[i]['activeLocation'] =this.indentList[i].indentStep2.jobLocations.filter((location: any) => location.status === 'Open').map((location: any) => location.location); 
          //   i++;
          // }

        }else{
          this.indentList = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader = false;
          this.endIndex = 0;
        }
      }
    );
  }

  // convertStageingToArray2(stageing: any): { stageName: string, details: { key: string, status: string, date: string, created_by?: string, isSubmitted: string }[] }[] {
  //   return Object.keys(stageing).map(stageName => ({
  //     stageName,
  //     details: Object.keys(stageing[stageName]).map(key => ({
  //       key,
  //       ...stageing[stageName][key]
  //     }))
  //   }));
  // }

  onSelectChange(event: Event): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage;
   // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;
    this.getAllIndent(this.authToken, this.limit, '', '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId,this.endIndex);
  }


  // updateIndentStatus(status: string){
  //   this.indentService.updateIndentStatus(this.authToken, this.selectedIndentId, this.selectedIndentStatus).subscribe(
  //     (res: any) => {
  //       if(res.status = 1){
  //         this.apiMessage = "Data Inserted";
  //         this.getAllIndent(this.authToken, '10', '', '', '', this.clientId, '');
  //       }else{
  //         this.apiMessage = "Data Not Inserted";
  //       }
  //     }
  //   );
  // }

  @ViewChild('myModal') model : ElementRef | undefined;

  openModal(indentId: string){
    if(this.model != null){
      this.model.nativeElement.style.display = 'block';
      this.selectedIndentId = indentId;
    }
  }

  closeModal(){
    if(this.model != null){
      this.model.nativeElement.style.display = 'none';
    }
  }

  
  async recruit(jobid: string): Promise<void> {
    const dataToSend = { jobid: jobid };
    this.router.navigate(['/jobpopup'], { queryParams: dataToSend });
  }



  
  confirmStatusChange(client: indentDetails): void {
    Swal.fire({
      title: `Are you sure you want to ${client.status ? 'deactivate' : 'activate'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleUserStatus(client);
      }
    });
  }


  toggleUserStatus(user: any): void {
    const newStatus = user.status === 1 ? 0 : 1;
    this.indentService.updateIndentStatus(this.authToken, user._id, newStatus).subscribe(() => {
      user.status = newStatus;
      Swal.fire('Updated!', `User has been ${newStatus === 1 ? 'activated' : 'deactivated'}.`, 'success');
    }, error => {
      Swal.fire('Error!', 'There was an error updating the user.', 'error');
    });
  }



  updateRecruiter(iteam:any){
    this.getRecruiter();
    this.visible = true;
    this.selectedItems = iteam.indentStep1.recruiterList;
    this.updatedIndentId = iteam._id;
  }




  async reassignRecruter(f: any) {
    this.isBtnLoading = true;
    this.isFormSubmited4 = true;
    this.visible = false;
    this.partnerTouched = true;
    const data = f.form.value;
    const updatedId = f.form.controls.indentId.value;
    this.authToken = localStorage.getItem('access_token');

    if (f.form.controls.recruiter_list.value !== '') {
      const url = `${environment.apiURL}${constant.apiEndPoint.REASSIGNRECRUTER}?indent_id=${updatedId}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.isBtnLoading = false;
              // this.getAllIndent(this.authToken, this.limit, '', '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.skip);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while reassigning the recruiter.' });
          }
        );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  indentStatusForm = this.fb.group({
    indent_status: ['Open', Validators.required],
    comment: ['', Validators.required]
  });


  indentStatusModalPop(oldStatus: any, indent_id: any){
    this.indentStatusModal = true;
    this.updatedIndentId = indent_id;
    this.currentStatus = oldStatus;
  }


  
  async InsertData(url = '', data = {}, authToken: string) {
    return fetch(url, {
      method: 'PUT', 
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json());
  }


  async updateIndentStatus(){
    this.isFormSubmited5 = true;
    const data = this.indentStatusForm.value;
    this.authToken = localStorage.getItem('access_token');
    const updatedIndentId = this.updatedIndentId;

    if(this.indentStatusForm.valid){
      this.InsertData(environment.apiURL+constant.apiEndPoint.UPDATEINDENTSTATUS+'/'+updatedIndentId, data, this.authToken)
      .then(data => {
        if(data.status == 1){
          this.isBtnLoading = false;
          this.getAllIndent(this.authToken, this.limit, '', '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.skip);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else{
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
    }
  }


  applyNow(indentId: any){
    this.applyModal = true;
    this.selectedIndentId = indentId;
  }

  applyThisIndent(){
    const indent_id = this.selectedIndentId;
    const candidate_id = this.myProfileData._id;
    const data = ''
    
    this.InsertData(environment.apiURL+constant.apiEndPoint.APPALYINDENT+'?candidate_id='+candidate_id+'&indent_id='+indent_id, data, this.authToken)
    .then(data => {
      if(data.status == 1){
        this.apiMessage5 = data.message;
      }else{
        this.apiMessage5 = data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  }




  getRecruiter(): void{
    this.indentService.getAllRecruiterList().subscribe(
      (res:any)=>{
        this.recruiterData = res.result.map((re: any) => ({
          item_id: re._id,
          item_text: re.name
        }));
      },
      error => {

      }
    );
  }



  updatePartner(iteam:any){
    this.getAllPartner();
    this.assignPartnerModal = true;
    this.selectedItems = iteam.indentStep1.partnerList;
    this.updatedIndentId = iteam._id;
  }

  getAllPartner(): void{
    this.indentService.getAllPartnerList().subscribe(
      (res:any)=>{
        this.partnerData = res.result.map((re: any) => ({
          item_id: re._id,
          item_text: re.vendorName+'('+re.firmName+')'
        }));
      },
      error => {

      }
    );
  }


  async reassignPartner(fp: any) {
    this.isBtnLoading=true;
    this.isFormSubmited6 = true;
    this.assignPartnerModal = false;
    const data = fp.form.value;
    const updatedId = fp.form.controls.indentId.value;
    this.authToken = localStorage.getItem('access_token');

    if (fp.form.controls.partner_list.value !== '') {
      const url = `${environment.apiURL}${constant.apiEndPoint.REASSIGNPARTNER}?indent_id=${updatedId}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.isBtnLoading = false;
              // this.getAllIndent(this.authToken, this.limit, '', '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.skip);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while reassigning the partner.' });
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

      if(this.currentPage == 1){
        this.startIndex = 0;
        this.startIndex2 = 11;
        this.endIndex2 = this.itemsPerPage+10; 
      }else{
        this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.startIndex2 = this.startIndex+1;
        this.endIndex2 = this.itemsPerPage+this.startIndex; 
      }
      this.endIndex = this.startIndex + this.itemsPerPage;
      this.endIndex = this.endIndex-10;
      this.getAllIndent(this.authToken, this.limit, this.searchCategory, '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.endIndex);
      // console.log(this.startIndex, this.endIndex2)

      if(this.currentPage > 1){
        this.isDisabled = "";
      }else{
        this.isDisabled = "disabled";
      }

      
      if(this.currentPage < this.totalPages){
        this.isDisabled2 = "";
      }else{
        this.isDisabled2 = "disabled";
      }

    this.getAllIndent(this.authToken, this.limit, this.searchCategory, '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.endIndex);
}
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      if(this.currentPage == 1){
        this.endIndex = 0;
        this.startIndex2 = this.startIndex+1;
        this.endIndex2 = this.itemsPerPage+this.startIndex; 
      }else{
        this.endIndex = this.startIndex + this.itemsPerPage;
        this.startIndex2 = this.startIndex+1;
        this.endIndex2 = this.itemsPerPage+this.startIndex;
        this.endIndex = this.endIndex-10;
      }
      this.getAllIndent(this.authToken, this.limit, this.searchCategory, '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.endIndex);
      
      if(this.currentPage > 1){
        this.isDisabled = "";
      }else{
        this.isDisabled = "disabled";
      }

      if(this.currentPage < this.totalPages){
        this.isDisabled2 = "";
      }else{
        this.isDisabled2 = "disabled";
      }

    this.getAllIndent(this.authToken, this.limit, this.searchCategory, '', '', this.clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.endIndex);
}
  }

  manageLocation(item:any, indentId: string){
    //this.indentLocationList = item;
    this.indentLocationModal = true;
    this.updatedIndentId = indentId;
    this.getIndentLocationData(this.updatedIndentId);
  }

  indentLocationStatusModalPop(oldStatus: any, location: any){
    this.indentLocationStatusModal = true;
    this.currentLocatonStatus = oldStatus;
    this.indentCurrentLocation = location;
    this.indentLocationStatusForm.patchValue({
      indent_id: '',
      location: '',
      status: 'Open',
      createdById: '',
      createdByName: '',
      comment: ''
    })
  }

  indentLocationStatusForm = this.fb.group({
    indent_id: '',
    location: '',
    status: ['Open', Validators.required],
    createdById: '',
    createdByName: '',
    comment: ['', Validators.required]
  });


  async updateIndentLocationStatus(){
    this.isFormSubmited5 = true;
    this.isBtnLoading = true;
    const data = this.indentLocationStatusForm.value;
    data.indent_id = this.updatedIndentId;
    data.location = this.indentCurrentLocation;
    data.createdById = this.loginUserId;
    data.createdByName = this.loginUserName;

    this.authToken = localStorage.getItem('access_token');
    const updatedIndentId = this.updatedIndentId;

    if (this.indentLocationStatusForm.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATELOCATIONSTATUS}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.isBtnLoading = false;
              this.getIndentLocationData(this.updatedIndentId);
              this.indentLocationStatusModal = false;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
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
