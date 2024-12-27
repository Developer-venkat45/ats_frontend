import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../reusable/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../core/service/dashboard.service';
import { APIResponseModel, JobDetailsResponse, JobDetailsResponse3, Recoom_candidate } from '../core/model/model';
import { indentDetails } from '../core/model/indent_model';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DatePipe} from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { constant } from '../core/constant/constant';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, AccordionModule, TooltipModule, NgxSkeletonLoaderModule, DatePipe, CommonModule, OverlayPanelModule, NgMultiSelectDropDownModule, FormsModule, DialogModule, ToastModule, RouterModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent {
  indentService = inject(DashboardService);
  indentData: any | null = null;
  recommData: Recoom_candidate[] = [];
  isLoggedIn:boolean = false;
  loader: boolean = true;
  isShown: boolean = false;
  isShown2: boolean = false;
  isShown3: boolean = false;
  isShown4: boolean = false;
  isShown5: boolean = false;
  isCandidate:boolean = false;
  loginUserId: any;
  eandIsubmitButton: boolean = true;
  enadiAnswerData: any;
  candidateAssessmentScoreData: any | null = null;
  submitButton: boolean = true;
  visible: boolean = false;
  selectedItems:any = [];
  updatedIndentId: any;
  authToken: any = null;
  htmlContent: string = '';
  sanitizedContent: SafeHtml = '';
  sanitizedContent2: SafeHtml = '';
  sanitizedContent3: SafeHtml = '';
  baseAPIURL:any;
  indentStatusModal: boolean = false;
  currentStatus: any;
  apiMessage4:any="";
  isFormSubmited4: boolean = false;
  overallFormValid4: string = "";
  apiMessage5:any="";
  isFormSubmited5: boolean = false;
  overallFormValid5: string = "";
  userType:any;
  assignPartnerModal: boolean = false;
  apiMessage6:any="";
  isFormSubmited6: boolean = false;
  overallFormValid6: string = "";
  candidateId: any = '';
  indentId: any = '';
  isSuperAdmin: boolean = false;
  partnerId: any = '';
  isAllow: boolean= true;
  invalidField: any = [];
  loginUserName: any;
  indentLocationModal: boolean = false;
  indentLocationStatusModal: boolean = false;
  currentLocatonStatus:any;
  indentLocationList: any;
  indentCurrentLocation: any;
  activeLocation: any[] = [];
  dropdownSettings:IDropdownSettings={};
  recruiterData: any[] = [];
  myProfileData: any;
  partnerData: any[] = [];
  loginUserRole:any;
  partnerList: any;
  allIndentDataShow: boolean = true;
  fb = inject(FormBuilder);


  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private messageService: MessageService, private http: HttpClient) { 
    this.loginUserId = localStorage.getItem('id');
    this.loginUserRole = localStorage.getItem('role_name');
    this.baseAPIURL= environment.apiURL;
    this.loginUserName = localStorage.getItem('name');
    
    this.route.queryParams.subscribe(params => {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          if (key.startsWith('utm_')) {
            localStorage.setItem('user_source', params[key]);
          }
        }
      }
      const source = params['platform'] || params['job_platform'];
      if(source){
        localStorage.setItem('user_source', source);
      }
    });
  }

  ngOnInit(): void {
    this.indentId = this.route.snapshot.paramMap.get('id')!;
    this.authToken = localStorage.getItem('access_token');

    const localData: any = localStorage.getItem('access_token');
    if (localData !== null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      localStorage.setItem('prevoius', 'job_details');
      localStorage.setItem('job', this.indentId);
    }

    this.userType = localStorage.getItem('user');
    const user: any = localStorage.getItem('user');
    if(user == 'Super Admin'){
      this.isSuperAdmin = true;
    }
    if (user == 'Candidate'){
      this.isShown = false;
      this.isShown2 = false;
      this.isCandidate = true;
      this.isShown3 = true;
      this.isShown4 = true;
    }else if(user == 'Recruiter'){
      this.isShown = true;
      //this.recruiterId = this.loginUserId;
      this.isShown2 = true;
      this.isShown3 = false;
      this.isShown4 = true;
      this.isShown5 = true;
    }else if(user == 'Partner SPOC - Recruiter' || user == 'Partner SPOC - Manager' || user == 'Partner Manager'){
      this.partnerId = localStorage.getItem('partner_id');
      this.isShown = true;
      this.isShown2 = true;
      this.isShown3 = false;
      this.isShown4 = false;
      this.isShown5 = false;
    }else{
      this.isShown = true;
      this.isShown2 = true;
      this.isShown3 = true;
      this.isShown4 = true;
      this.isShown5 = true;
    }
    if (user != 'Candidate'){
      this.getSingleIndent(this.authToken, this.indentId, '');
    }else{
      this.getUserCandidateData(this.authToken,this.loginUserId);
    }

    

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll:false,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };

    if(user == 'Partner SPOC - Manager'){
      this.partnerId = localStorage.getItem('partner_id');
      this.getPartner(this.authToken,this.partnerId);
    }
  }


  getPartner(authToken: string, id: string): void {
    this.indentService.getSinglePartner(authToken, id).subscribe(
      (res: any) => {
        this.partnerList = res.result[0];
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

  getIndentLocationData(id: string): void {
    this.indentService.getIndentLocationStatus(id).subscribe(
      (res: any) => {
        this.indentLocationList = res.data;
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
        this.getSingleIndent(this.authToken, this.indentId, this.candidateId);




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


  indentStaging:any[] = [];
  getSingleIndent(authToken: string, indentId: string, candidateId: string): void {
    this.indentService.getSingleIndent(authToken, indentId, candidateId).subscribe(
      (res: any) => {
        this.indentData = res.result[0];
        if (this.indentData?.indentStep5) {
           this.indentStaging =this.convertStageingToArray2(this.indentData?.indentStep5);
        }
        console.log(this.indentStaging);
        this.loader = false;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.indentData?.indentStep2?.clientDescription);
        this.sanitizedContent2 = this.sanitizer.bypassSecurityTrustHtml(this.indentData?.indentStep2?.jobDescription);
        this.sanitizedContent3 = this.sanitizer.bypassSecurityTrustHtml(this.indentData?.indentStep2?.mustCriteria);
        if(this.userType == 'Candidate'){
          // this.checkEandI(authToken, indentId, this.indentData?.indentStep4?.eandiId, this.myProfileData._id);
          // this.getCandidateEandi(authToken, indentId, this.indentData?.indentStep4?.eandiId, this.myProfileData._id);
          // this.checkAssessment(authToken, indentId, this.indentData?.indentStep6?.assessmentId, this.myProfileData._id);
          // this.getCandidateAssessmentScore(authToken,this.myProfileData._id)
        }
        this.activeLocation = this.indentData?.indentStep2?.jobLocations?.filter((location: any) => location.status === 'Open').map((location: any) => location.location); 
      },
      error => {
        // Handle error
      }
    );
  }


  checkAssessment(authToken: string, indentId: string, assessmentId: string, candidateId: string): void {
    this.indentService.checkAssessment(authToken, indentId, assessmentId, candidateId).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.submitButton = false;
        }else{
          this.submitButton = true;
        }
      },
      error => {
        // Handle error
      }
    );
  }

  getCandidateAssessmentScore(authToken: string, indentId: string): void {
    this.indentService.getCandidateAssessmentScore(authToken, indentId).subscribe(
      (res: APIResponseModel) => {
        this.candidateAssessmentScoreData = res.result[0];
        console.log(this.candidateAssessmentScoreData);
      },
      error => {
        // Handle error
      }
    );
  }

  checkEandI(authToken: string, indentId: string, eandiId: string, candidateId: string): void {
    this.indentService.checkEandi(authToken, indentId, eandiId, candidateId).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.eandIsubmitButton = false;
        }else{
          this.eandIsubmitButton = true;
        }
      },
      error => {
        // Handle error
      }
    );
  }

  getCandidateEandi(authToken: string, indentId: string, eandiId: string, candidateId: string): void {
    this.indentService.getCandidateEandi(authToken, indentId, eandiId, candidateId).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.enadiAnswerData = res.result[0];
        }
        // console.log(this.enadiAnswerData);
      },
      error => {
        // Handle error
      }
    );
  }

  convertStageingToArray2(stageing: any): { stageName: string, details: { key: string, status: string, date: string, created_by?: string, isSubmitted: string }[] }[] {
    return Object.keys(stageing).map(stageName => ({
      stageName,
      details: Object.keys(stageing[stageName]).map(key => ({
        key,
        ...stageing[stageName][key]
      }))
    }));
  }

  getRecommCandidate(authToken: string, indentId: string): void {
    this.indentService.getRecommCandidate(authToken, indentId).subscribe(
      (res: APIResponseModel) => {
        this.recommData = res.result;
        console.log(this.recommData);
      },
      error => {
        // Handle error
      }
    );
  }

  updateRecruiter(iteam:any){
    this.getRecruiter();
    this.visible = true;
    this.selectedItems = iteam.indentStep1.recruiterList;
    this.updatedIndentId = iteam._id;
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



  async postData(url = '', data={}, authToken: string) {
    return fetch(url, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json());
  }



  // async reassignRecruter(f:any){
  //   this.isFormSubmited4 = true;
  //   const data = f.form.value;
  //   const updatedId = f.form.controls.indentId.value;
  //   this.authToken = localStorage.getItem('access_token');

  //   if(f.form.controls.recruiter_list.value != ''){
  //     this.postData(environment.apiURL+constant.apiEndPoint.REASSIGNRECRUTER+'?indent_id='+updatedId, data, this.authToken)
  //     .then(data => {
  //       if(data.status == 1){
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
  //       }else{
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  //   }else{
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
  //   }
  // }


  async reassignRecruter(f: any) {
    this.isFormSubmited4 = true;
    this.visible = false;
    const data = f.form.value;
    const updatedId = f.form.controls.indentId.value;
    this.authToken = localStorage.getItem('access_token');

    if (f.form.controls.recruiter_list.value !== '') {
      const url = `${environment.apiURL}${constant.apiEndPoint.REASSIGNRECRUTER}?indent_id=${updatedId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.getSingleIndent(this.authToken, this.indentId, '');
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while reassigning the recruiter.' });
          }
        );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

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

  indentStatusForm = this.fb.group({
    indent_status: ['Open', Validators.required],
    comment: ['', Validators.required]
  });

  // async updateIndentStatus(){
  //   this.isFormSubmited5 = true;
  //   const data = this.indentStatusForm.value;
  //   this.authToken = localStorage.getItem('access_token');
  //   const updatedIndentId = this.updatedIndentId;

  //   if(this.indentStatusForm.valid){
  //     this.InsertData(environment.apiURL+constant.apiEndPoint.UPDATEINDENTSTATUS+'/'+updatedIndentId, data, this.authToken)
  //     .then(data => {
  //       if(data.status == 1){
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
  //         this.getSingleIndent(this.authToken, this.updatedIndentId, this.candidateId);
  //       }else{
  //         this.apiMessage5 = data.message;
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  //   }else{
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
  //   }
  // }


  async updateIndentStatus() {
    this.isFormSubmited5 = true;
    const data = this.indentStatusForm.value;
    this.authToken = localStorage.getItem('access_token');
    const updatedIndentId = this.updatedIndentId;

    if (this.indentStatusForm.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATEINDENTSTATUS}/${updatedIndentId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.getSingleIndent(this.authToken, this.updatedIndentId, this.candidateId);
            } else {
              this.apiMessage5 = response.message;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the indent status.' });
          }
        );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
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
        console.log(this.partnerData);
      },
      error => {

      }
    );
  }




  
  // async reassignPartner(fp:any){
  //   this.isFormSubmited6 = true;
  //   const data = fp.form.value;
  //   const updatedId = fp.form.controls.indentId.value;
  //   this.authToken = localStorage.getItem('access_token');

  //   if(fp.form.controls.partner_list.value != ''){
  //     this.postData(environment.apiURL+constant.apiEndPoint.REASSIGNPARTNER+'?indent_id='+updatedId, data, this.authToken)
  //     .then(data => {
  //       if(data.status == 1){
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
  //       }else{
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  //   }else{
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
  //   }
  // }


  async reassignPartner(fp: any) {
    this.isFormSubmited6 = true;
    this.assignPartnerModal = false;
    const data = fp.form.value;
    const updatedId = fp.form.controls.indentId.value;
    this.authToken = localStorage.getItem('access_token');

    if (fp.form.controls.partner_list.value !== '') {
      const url = `${environment.apiURL}${constant.apiEndPoint.REASSIGNPARTNER}?indent_id=${updatedId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.getSingleIndent(this.authToken, this.indentId, '');
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while reassigning the partner.' });
          }
        );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
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
    this.loader = true;
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
              this.loader = false;
              this.getIndentLocationData(this.updatedIndentId);
              this.indentLocationStatusModal = false;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.loader = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the Eandi question.' });
          }
        );
    } else {
      this.loader = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  
  }
}
