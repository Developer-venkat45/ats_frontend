import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { DashboardService } from '../../core/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray,FormBuilder,ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RouterModule,Router } from '@angular/router';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-enitest',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,ToastModule,AutoCompleteModule,RouterModule],
  templateUrl: './enitest.component.html',
  styleUrl: './enitest.component.css'
})
export class EnitestComponent implements OnInit{
  clientService = inject(DashboardService);
  apiMessage:any="";
  authToken:any="";
  selectedEandi: any;
  eandId: any ="";
  indentId: any ="";
  candidateId: any ="";
  apiResponseMessage: string = "";
  submitButton: boolean = true;
  apiMessage3:any="";
  isFormSubmited3: boolean = false;
  overallFormValid3: string = "";
  indentData: any | null = null;
  loginUserName:any;
  loginUserId:any;
  loginRoleId: any;
  partnerId:any;
  partnerFirmName: string = '';
  totalScore: number = 0;
  selectedScore: any [] = [];
  totalScorePercent: number = 0;
  ragTag: any;
  isLoading: boolean = false;
  myProfileData: any;
  isCandidate: boolean = false;
  isAllow: boolean = true;
  invalidField: any = [];
  rolemap:any = "";
  candidateData : any | null = null;
  filteredLocation: any[] = [];
  uploadedLocation: any[] = [];
  isLoading2: boolean = false;
  apiResponse: boolean = false;
  uploadBtnText: string = 'Apply';
  theAIscore = '0';
  explanation = '';
  employeeDetailsTab:boolean =false;
  loginRoleName: any;
  fb = inject(FormBuilder);

  private customValidator= new CustomValidatorComponent();
  constructor(private route: ActivatedRoute, private messageService: MessageService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.eandId = this.route.snapshot.paramMap.get('eandiid')!;
    this.indentId = this.route.snapshot.paramMap.get('indentid')!;
    this.candidateId = this.route.snapshot.paramMap.get('candidateid')!;
    this.loginRoleName = localStorage.getItem('role_name');
    this.loginRoleId = localStorage.getItem('role_id');
    this.partnerId = localStorage.getItem('partner_id');

    this.authToken = localStorage.getItem('access_token');
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    
    this.checkEandi(this.authToken, this.indentId, this.eandId, this.candidateId);
    this.getSingleIndent(this.authToken, this.indentId);

    const user: any = localStorage.getItem('user');

    if(user == 'Super Admin' || user == 'Partner SPOC - Recruiter' || user == 'Partner SPOC - Manager' || user == 'Partner Manager' || user == 'Recruiter'){
      this.clientService.getSingleCandidateDetails(this.authToken, this.candidateId).subscribe(
        (res: any) => {
          this.candidateData = res.result;
          this.getUserCandidateData(this.authToken,this.candidateData?.user_id);
        },
        error => {
          // Handle error
        }
      );
    }
    if(this.partnerId != '' && this.partnerId != null){
      this.getPartner(this.authToken, this.partnerId);
    }
  }


  getPartner(authToken: string, id: string): void {
    this.clientService.getSinglePartner(authToken, id).subscribe(
      (res: any) => {
        this.partnerFirmName = res.result[0].firmName;
      },
      error => {
        // Handle error
      }
    );
  }

  

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredLocation = this.uploadedLocation
      .filter(item => item.toLowerCase().includes(query))
      .sort((a, b) => a.localeCompare(b));
  }

  getUserCandidateData(authToken: string, id: string): void {
    this.clientService.getUserCandidateData(authToken, id).subscribe(
      (res: any) => {
        this.myProfileData = res.result;
        if(res.status == 1){
          this.getAlleandi2(this.authToken,this.eandId,'','');
        }
        
        if(this.myProfileData?.resume_path == '' || this.myProfileData?.resume_path == null){
          this.isAllow = false;
          this.invalidField.push('Please upload CV Upload')
        }

        if(this.myProfileData?.dob == '' || this.myProfileData?.dob == null){
          this.isAllow = false;
          this.invalidField.push('Please enter your dob')
        }

        if(this.myProfileData?.highestQualification == '' || this.myProfileData?.highestQualification == null){
          this.isAllow = false;
          this.invalidField.push('Please update highest qualification')
        }

        if(this.myProfileData?.highestQualificationPassedOn == '' || this.myProfileData?.highestQualificationPassedOn == null){
          this.isAllow = false;
          this.invalidField.push('Please update highest qualification passed year')
        }

        if(this.myProfileData?.highestQualificationPercentage === '' || this.myProfileData?.highestQualificationPercentage === null ){
          this.isAllow = false;
          this.invalidField.push('Please update highest qualification percentage'+this.myProfileData?.highestQualificationPercentage)
        }

        if(this.myProfileData?.totWorkExp == '' || this.myProfileData?.totWorkExp == null){
          this.isAllow = false;
          this.invalidField.push('Please update total work exp')
        }

        if(this.myProfileData?.gender == '' || this.myProfileData?.gender == null){
          this.isAllow = false;
          this.invalidField.push('Please update gender')
        }

        if(this.myProfileData?.city == '' || this.myProfileData?.city == null){
          this.isAllow = false;
          this.invalidField.push('Please update your city')
        }

        if(this.myProfileData?.skills == '' || this.myProfileData?.skills == null){
          this.isAllow = false;
          this.invalidField.push('Please upload Update skills')
        }

        if(this.myProfileData?.education == '' || this.myProfileData?.education == null){
          this.isAllow = false;
          this.invalidField.push('Please upload your education details')
        }
        
      },
      error => {
        // Handle error
      }
    );
  }

  getSingleIndent(authToken: string, indentId: string): void {
    this.clientService.getSingleIndentDetails(indentId).subscribe(
      (res: any) => {
        this.indentData = res.result;
        this.uploadedLocation = this.indentData?.jobLocations?.filter((location: any) => location.status === 'Open').map((location: any) => location.location); 
      },
      error => {
        // Handle error
      }
    );
  }

  checkEandi(authToken: string, indentId: string, assessmentId: string, candidateId: string): void {
    this.clientService.checkEandi(authToken, indentId, assessmentId, candidateId).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.apiMessage3 = "You already submitted your E & I ";
          this.submitButton = false;
        }
      },
      error => {
        // Handle error
      }
    );
  }

  getAlleandi2(authToken:string,id:string,title:string,category:string): void {
    this.clientService.getAlleandi(authToken,id,title,category).subscribe(
      (res: any) => {
        this.selectedEandi = res.result[0];
        this.selectedEandi.questions.forEach((questionData: any) => {
          this.questions.push(this.createQuestion(questionData));
        });

        const answers = this.enaditest.get('answers') as FormArray;
        this.selectedEandi?.questions.forEach((question:any, index:any) => {
          if(question.fieldType == "candidate field"){
            if(question.inputType == 'dob'){
              const answerGroup = answers.at(index) as FormGroup;
              answerGroup.controls['answer'].setValue(this.myProfileData.dob !== null ? this.myProfileData.dob : '');
              answerGroup.controls['question'].setValue('dob');
            }
            if(question.inputType == 'twe'){
              const answerGroup = answers.at(index) as FormGroup;
              answerGroup.controls['answer'].setValue(this.myProfileData.totWorkExp !== null ? this.myProfileData.totWorkExp : '');
              answerGroup.controls['question'].setValue('twe');
            }
            if(question.inputType == 'hq'){
              const answerGroup = answers.at(index) as FormGroup;
              answerGroup.controls['answer'].setValue(this.myProfileData.highestQualificationCategory !== null ? this.myProfileData.highestQualificationCategory : '');
              answerGroup.controls['question'].setValue('hq');
            }
            if(question.inputType == 'city'){
              const answerGroup = answers.at(index) as FormGroup;
              answerGroup.controls['answer'].setValue(this.myProfileData.city !== null ? this.myProfileData.city : '');
              answerGroup.controls['question'].setValue('city');
            }
            if(question.inputType == 'gender'){
              const answerGroup = answers.at(index) as FormGroup;
              answerGroup.controls['answer'].setValue(this.myProfileData.gender !== null ? this.myProfileData.gender: '');
              answerGroup.controls['question'].setValue('gender');
            }
            if(question.inputType == 'hqpy'){
              const answerGroup = answers.at(index) as FormGroup;
              answerGroup.controls['answer'].setValue(this.myProfileData.highestQualificationPassedOn !== null ? this.myProfileData.highestQualificationPassedOn: '');
            }
            if(question.inputType == 'hqp'){
              const answerGroup = answers.at(index) as FormGroup;
              answerGroup.controls['answer'].setValue(this.myProfileData.highestQualificationPercentage !== null ? this.myProfileData.highestQualificationPercentage: '');
            }
          }
        });
      },
      error => {
        // Handle error
      }
    );
  }




  async generateScore() {
    this.isLoading2 = true;
    this.apiResponse = false;
    this.authToken = localStorage.getItem('access_token');
    const data = {
      'eandiId': this.eandId,
      'indentId': this.indentId,
      'candidateId': this.candidateId
    }


    if(this.eandId !== '' && this.indentId !== '' && this.candidateId != ''){

      const url = `${environment.apiURL}${constant.apiEndPoint.APPLYEXISTCANDIDATEAISCORE}`;
      
      this.http.post<any>(url, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading2 = false; // Stop loading
          if (response.status === 1) {
            this.uploadBtnText = 'Regenerate';
            this.theAIscore = response.result.score;
            this.explanation = response.result.explanation;
            this.apiResponse = response.status;
            //this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.uploadBtnText = 'Regenerate';
            this.apiResponse = response.status;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading2 = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while uploading the resume.' });
        }
      );
    } else {
      this.isLoading2 = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }





  enaditest = this.fb.group({
    eandiId: [''],
    candidateId: [''],
    indentId: [''],
    createdName: [''],
    created_by: [''],
    uploadLocation: ['', Validators.required],
    score: '0',
    explanation: [''],
    answers: this.fb.array([]),
    referName:[''],
    referEmail:[''],
    referMobile:[''],
    referEmployeId:[''],
    referEmployeLocation:[''],
    source: this.fb.group({
      name: [''],
      id: [''],
      role_id: [''],
      role_name: [''],
      partner_id: [''],
      partner_firm_name: ['']
    }),
  });
  

  get questions(): FormArray {
    return this.enaditest.get('answers') as FormArray;
  }

  createQuestion(questionData: any): FormGroup {
    let answerControl;
  
    if (questionData.inputType === 'msq' || questionData.inputType === 'hqs' || questionData.inputType === 'skill') {
      answerControl = this.fb.array([],Validators.required);
    } else {
      answerControl = this.fb.control('', Validators.required);
    }
  
    return this.fb.group({
      question: [questionData.question],
      answer: answerControl,
    });
  }




  onCheckboxChange(event: any, index: number, value: string) {
    const answersArray = this.enaditest.get('answers') as FormArray;
    const answerArray = answersArray.at(index).get('answer') as FormArray;
  
    if (event.target.checked) {
      answerArray.push(new FormControl(value));
    } else {
      const indexToRemove = answerArray.controls.findIndex(x => x.value === value);
      answerArray.removeAt(indexToRemove);
    }
  }


  async submitAssessment() {
    this.isLoading = true;
    this.isFormSubmited3 = true;

    const data = this.enaditest.value;
    data.eandiId = this.eandId;
    data.candidateId = this.candidateId;
    data.indentId = this.indentId;
    data.createdName = this.loginUserName;
    data.created_by = this.loginUserId;
    data.score = this.theAIscore.toString();
    data.explanation = this.explanation;
    data.source = {
      name : this.loginRoleName,
      id : this.loginUserId,
      role_id: this.loginRoleId,
      role_name: this.loginRoleName,
      partner_id: this.partnerId,
      partner_firm_name: this.partnerFirmName,
    }


    this.authToken = localStorage.getItem('access_token');
    console.log(this.enaditest)

    if (this.enaditest.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.APPLYEXISTCANDIDATESENI}?role_name=${this.loginRoleName}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.apiMessage3 = response.message;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.submitButton = false;           
            } else {
              this.apiMessage3 = response.message;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while submitting the assessment.' });
          }
        );
      this.overallFormValid3 = '';
    } else {
      this.isLoading = false;
      this.overallFormValid3 = 'Please fill the form correctly';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

  
  onCheckBoxChange(event: Event):void{
    const checked = (event.target as HTMLInputElement).checked;
    const rffNameRequired = this.enaditest.get('referName');
    const rffMailRequired = this.enaditest.get('referEmail');
    const rffMobileRequired = this.enaditest.get('referMobile');
    const rffEmployeIdRequired = this.enaditest.get('referEmployeId');
    const rffEmployeeLocation = this.enaditest.get('referEmployeLocation');
    if(checked){
      this.employeeDetailsTab = true;
      // this.hideButton = false;
      rffNameRequired?.setValidators([Validators.required,Validators.maxLength(50),this.customValidator.alphabetValidator()])
      rffMailRequired?.setValidators([this.customValidator.emailValidator()]);
      rffMobileRequired?.setValidators([this.customValidator.onlynumberValidator()]);
      rffEmployeIdRequired?.setValidators([Validators.required,this.customValidator.alphaNumaricValidator()]);
      rffEmployeeLocation?.setValidators([Validators.required,this.customValidator.alphabetValidator()]);
    }else{
      this.employeeDetailsTab = false;
      // this.hideButton = true;
      rffNameRequired?.clearValidators();
      rffMailRequired?.clearValidators();
      rffMobileRequired?.clearValidators();
      rffEmployeIdRequired?.clearValidators();
      rffEmployeeLocation?.clearValidators();
    }
    rffNameRequired?.updateValueAndValidity();
    rffMailRequired?.updateValueAndValidity();
    rffMobileRequired?.updateValueAndValidity();
    rffEmployeIdRequired?.updateValueAndValidity();
    rffEmployeeLocation?.updateValueAndValidity();
  }
}
