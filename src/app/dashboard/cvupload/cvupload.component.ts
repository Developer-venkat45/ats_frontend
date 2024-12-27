import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { AutoCompleteModule } from 'primeng/autocomplete';


interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-cvupload',
  standalone: true,
  imports: [ToastModule,ReactiveFormsModule, CommonModule, RouterModule, FormsModule, AutoCompleteModule],
  templateUrl: './cvupload.component.html',
  styleUrl: './cvupload.component.css'
})
export class CvuploadComponent implements OnInit{
  indedentService = inject(DashboardService);
  authToken:any="";
  resume:any ="";
  loginUserName:any;
  loginUserId:any;
  loginRoleId: any;
  loginRoleName: any;
  apiURL:any;
  indentId:any;
  parsingData:any;
  stateData: any[] = [];
  cityData: any[] = [];
  years: number[] = [];
  workingStatusValue: boolean = true;
  workingStatusValue2: any [] = [];
  workingStatusValueIndex: number = 0;
  workingStatusValueIndex2: any [] =[];
  industryData: any [] = [];
  isFormSubmited: boolean = false;
  isFormSubmited2: boolean = false;
  isLoading: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  apiResponse: boolean = false;
  uploadBtnText: string = 'Submit';
  duplicateCandidate: boolean = false;
  duplicateEmail: boolean = false;
  duplicateMobile: boolean = false;
  duplicateIndent: boolean = false;
  indentData: any | null = null;
  uploadLocation: any = '';
  totalScore: number = 0;
  selectedScore: any [] = [];
  totalScorePercent: number = 0;
  ragTag: any;
  roleId: number = 0;
  selectedEandi: any;
  index: number = 1;
  eandiId:any;
  isCoolingPeriod: boolean = false;
  partnerId:any;
  emailEmpty: boolean = false;
  mobileEmpty: boolean = false;
  hq_qualification:any ='';
  allQualifications: any[] = [];
  filteredLocation: any[] = [];
  uploadedLocation: any[] = [];
  partnerFirmName: string = '';
  loopSlNo:number = 0;
  employeeDetailsTab:boolean =false;
  hideButton:boolean = true;
  CvUploadUrl: any [] = [];

  totalAge: number = 0;
  private customValidator= new CustomValidatorComponent();
  constructor(private route: ActivatedRoute, private messageService: MessageService, private http: HttpClient) { 
    this.apiURL= environment.apiURL;
    this.getYears();
  }


  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    this.loginRoleId = localStorage.getItem('role_id');
    this.loginRoleName = localStorage.getItem('role_name');
    this.indentId = this.route.snapshot.paramMap.get('id')!;
    this.partnerId = localStorage.getItem('partner_id');
    this.getStateData(this.authToken, '');
    this.getJobIndustryData(this.authToken, 'job industry');
    this.getSingleIndent(this.indentId);
    this.workingStatusValue2[0] = true;
    if(this.partnerId != '' && this.partnerId != null){
    this.getPartner(this.authToken, this.partnerId);
    }
    this.getJobTypeData('CV Upload Url');
  }

  getJobTypeData(master: string): void {
    this.indedentService.getAllConfigMasterData( master).subscribe(
      (res: any) => {
        this.CvUploadUrl = res.data[0];
      },
      error => {
        // Handle error
      }
    );
  }

  getPartner(authToken: string, id: string): void {
    this.indedentService.getSinglePartner(authToken, id).subscribe(
      (res: any) => {
        this.partnerFirmName = res.result[0].firmName;
      },
      error => {
        // Handle error
      }
    );
  }

  getJobIndustryData(authToken: string, master: string): void {
    this.indedentService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.industryData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }
  
  getStateData(authToken: string, zoneId: string): void {
    this.indedentService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
        //console.log(this.stateData);
      },
      error => {
        // Handle error
      }
    );
  }

  getSingleIndent(indentId: string): void {
    this.indedentService.getSingleIndentDetails(indentId).subscribe(
      (res: any) => {
        this.indentData = res.result;
        this.eandiId = this.indentData?.eandiId;
        this.uploadedLocation = this.indentData?.jobLocations?.filter((location: any) => location.status === 'Open').map((location: any) => location.location); 
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

  getAlleandi2(authToken:string,id:string,title:string,category:string): void {
    this.indedentService.getAlleandi(authToken,id,title,category).subscribe(
      (res: any) => {
        this.selectedEandi = res.result[0];
        this.selectedEandi.questions.forEach((questionData: any) => {
          this.questions.push(this.createQuestion(questionData));
        });
        this.populateCandidateForm(this.parsingData);
      },
      error => {
        // Handle error
      }
    );
  }


  get questions(): FormArray {
    return this.updateCandidate.get('answers') as FormArray;
  }

  createQuestion(questionData: any): FormGroup {
    let answerControl;
  
    if (questionData.inputType === 'msq' || questionData.inputType === 'hqs' || questionData.inputType === 'skill') {
      answerControl = this.fb.array([]);
    } else {
      answerControl = this.fb.control('', Validators.required);
    }
  
    return this.fb.group({
      question: [questionData.question],
      answer: answerControl,
    });
  }

  onCheckboxChange(event: any, index: number, value: string) {
    const answersArray = this.updateCandidate.get('answers') as FormArray;
    const answerArray = answersArray.at(index).get('answer') as FormArray;
  
    if (event.target.checked) {
      answerArray.push(new FormControl(value));
    } else {
      const indexToRemove = answerArray.controls.findIndex(x => x.value === value);
      answerArray.removeAt(indexToRemove);
    }
  }














  getCityOnStateChnage(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    const selectedState = this.stateData.find(state => state.name === selectedStateName);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken, selectedStateId);
  }

  getCityData(authToken: string, stateId: string): void {
    this.indedentService.getCity(authToken, stateId).subscribe(
      (res: any) => {
        this.cityData = res.result[0].data;
      },
      error => {
        // Handle error
      }
    );
  }




  onProfileResume(event: any) {
    this.resume= File = event.target.files[0];
    if(this.resume){

    }
  }


  requestUrl:any = '';
  async resumeUpload() {
    this.isLoading = true;
    this.isFormSubmited2 = true;
    const formData: FormData = new FormData();
    formData.append('resume', this.resume);
    this.testReset();
    this.apiResponse = false;
    this.authToken = localStorage.getItem('access_token');
    // this.resume !== '' && this.uploadLocation !== '' && this.uploadLocation != null
    if (this.cvParsing.valid && this.resume !== '') {
      // if(this.loginRoleName == 'Super Admin'){
      //   this.requestUrl = `https://tmirts.tminetwork.com/${constant.apiEndPoint.SINGLERESUME}?indent_id=${this.indentId}&upload_id=${this.loginUserId}&upload_name=${this.loginUserName}&role_id=${this.loginRoleId}&role_name=${this.loginRoleName}`;
      // }else{
      //   this.requestUrl = `${environment.apiURL}${constant.apiEndPoint.SINGLERESUME}?indent_id=${this.indentId}&upload_id=${this.loginUserId}&upload_name=${this.loginUserName}&role_id=${this.loginRoleId}&role_name=${this.loginRoleName}`;
      // }
      this.requestUrl = `${this.CvUploadUrl}${constant.apiEndPoint.SINGLERESUME}?indent_id=${this.indentId}&upload_id=${this.loginUserId}&upload_name=${this.loginUserName}&role_id=${this.loginRoleId}&role_name=${this.loginRoleName}`;
      
      this.http.post<any>(this.requestUrl, formData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false; // Stop loading
          if (response.status === 1) {
            this.uploadBtnText = 'Regenerate';
            this.parsingData = response.result.data;
            this.getAlleandi2(this.authToken, this.indentData?.eandiId, '', '');
            this.apiResponse = response.status;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.duplicateCandidate = this.parsingData.duplicate_db;
            if(this.parsingData.email != null){
              if(this.parsingData.duplicate_email){
                this.duplicateEmail = this.parsingData.duplicate_email;
              }else{
                this.duplicateEmail = false;
              }
            }else{
              this.emailEmpty = true;
            }
            if(this.parsingData.mobile != null){
              if(this.parsingData.duplicate_mobile){
                this.duplicateMobile = this.parsingData.duplicate_mobile;
              }else{
                this.duplicateMobile = false;
              }
            }else{
              this.mobileEmpty = true;
            }
            this.duplicateIndent = this.parsingData?.duplicate_indent ? this.parsingData?.duplicate_indent : false;

            if(this.parsingData?.state != null){
              const selectedState = this.stateData.find(state => state.name === this.parsingData?.state);
              const selectedStateId = selectedState ? selectedState.id : '';
            this.getCityData(this.authToken, selectedStateId);
            }

            if (this.parsingData?.exits_cand != null) {
              if (this.parsingData?.source?.role_id === 12 && this.parsingData?.old_score?.partner_id !== this.partnerId) {
                this.isCoolingPeriod = true;
              }
            }


          } else {
            this.uploadBtnText = 'Regenerate';
            this.apiResponse = response.status;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false; // Stop loading
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while uploading the resume.' });
        }
      );
    } else {
      this.isLoading = false; // Stop loading
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }



  searchCanRagTag(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.uploadLocation = selectedValue;
    //console.log(this.uploadLocation);
  }


  fb = inject(FormBuilder);

  updateCandidate = this.fb.group({
    indent_id: [''],
    name: ['',[Validators.required,Validators.maxLength(50),this.customValidator.alphabetValidator()]],
    mobile: ['', [Validators.required,this.customValidator.onlynumberValidator()]],
    email: ['',[Validators.required,this.customValidator.emailValidator()]],
    dob: ['',[Validators.required,this.customValidator.minAgeValidator(18)]],
    totWorkExp: ['', [Validators.required,this.customValidator.numbersAndFloatnumValidator(),Validators.maxLength(3)]],
    fatherName: ['',[Validators.maxLength(50),this.customValidator.alphabetValidator()]],
    skills: [''],
    strengths: [''],
    gender: ['Male', Validators.required],
    highestQualificationCategory: ['',Validators.required],
    highestQualification: [''],
    highestQualificationPassedOn: [''],
    highestQualificationPercentage: [''],
    state: ['', Validators.required],
    city: ['', Validators.required],
    address: ['',[Validators.maxLength(500)]],
    education: this.fb.array([
      /*to be remove*/
        this.fb.group({
          qualification: ['',Validators.maxLength(150)],
          institute: ['',[Validators.maxLength(150)]],
          passedOn: [''],
          percentage: [0,[this.customValidator.numbersdotsValidator()]]
        })
      
    ]),
    experience: this.fb.array([
      /* to be remove*/
      this.fb.group({
        workingStatus: ['',],
        compName: ['',[Validators.maxLength(150),this.customValidator.alphabetValidator()]],
        industry: ['',],
        designation: ['',[Validators.maxLength(150),this.customValidator.alphabetValidator()]],
        startDate: ['',],
        endDate: ['',]
      })
    ]),
    resume_path: [''],
    unique_id: [''],
    score: ['0'],
    auth: 'CV Upload',
    candidate_summary: ['',[Validators.maxLength(5000)]],
    strength: [''],
    explanation: [''],
    uploadLocation: [''],
    source: this.fb.group({
      name: [''],
      id: [''],
      role_id: [''],
      role_name: [''],
      partner_id: [''],
      partner_firm_name: ['']
    }),
    answers: this.fb.array([]),
    eandiId: '',
    referName: [''],
    referEmail: [''],
    referMobile: [''],
    referEmployeId: [''],
    referEmployeeLocation:['']
  })




  
  testReset(){
    this.updateCandidate.reset();
    this.parsingData = [];
    while (this.educationGroups.length !== 0) {
      this.educationGroups.removeAt(0);
    }
    while (this.expGroups.length !== 0) {
      this.expGroups.removeAt(0);
    }
    while (this.questions.length !== 0) {
      this.questions.removeAt(0);
    }
    this.loopSlNo = 0;
    this.allQualifications.length = 0;

  }

  get educationGroups() {
    return this.updateCandidate.get('education') as FormArray;
  }

  
  addEducation(){
    this.educationGroups.push(
      this.fb.group({
        qualification: [''],
        institute: [''],
        passedOn: [''],
        percentage: [0]
      })
    );
  }


  removeEducation(index: number){
    this.educationGroups.removeAt(index);
  }


  get expGroups() {
    return this.updateCandidate.get('experience') as FormArray;
  }

  
  addExperience(){
    this.expGroups.push(
      this.fb.group({
        workingStatus: [''],
        compName: [''],
        industry: [''],
        designation: [''],
        startDate: [''],
        endDate: ['']
      })
    );
    this.workingStatusValue2[this.index] = true;
    this.index++;
    //console.log(this.workingStatusValue2);
  }


  removeExperience(index: number){
    this.expGroups.removeAt(index);
  }



  getYears() {
    const startYear = 1980;
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  
  workingStatusSelect(event: Event, index: number): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.workingStatusValueIndex = index;
    if(selectedValue == "Currently Working"){
      this.workingStatusValue = false;
      this.workingStatusValue2[index] = false;
    }else{
      this.workingStatusValue = true;
      this.workingStatusValue2[index] = true;
    }
    //console.log(selectedValue, index, this.workingStatusValue2);
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  populateCandidateForm(parsingData: any): void {
    if(parsingData){
      this.updateCandidate.patchValue({
        name: parsingData.name,
        mobile: parsingData.mobile,
        email: parsingData.email,
        //dob: parsingData.dob !== null ? parsingData.dob : '',
        dob: parsingData.dob !== null ? this.formatDate(parsingData.dob) : '',
        totWorkExp: parsingData.totWorkExp,
        fatherName: parsingData.fatherName !== null ? parsingData.fatherName : '',
        skills: parsingData.skills !== null ? parsingData.skills : '',
        strengths: parsingData.strengths !== null ? parsingData.strengths:'',
        gender: parsingData.gender !== null ? parsingData.gender: 'Male',
        highestQualificationCategory: parsingData.highest_qualification_category !== null ? parsingData.highest_qualification_category : '',
        highestQualification: parsingData.highest_qualification !== null ? parsingData.highest_qualification : '',
        highestQualificationPassedOn: parsingData.highestQualificationPassedOn !== null ? parsingData.highestQualificationPassedOn : '',
        highestQualificationPercentage: parsingData.highestQualificationPercentage !== null ? parsingData.highestQualificationPercentage : '',
        state: parsingData.state !== null ? parsingData.state : '',
        city: parsingData.city !== null ? parsingData.city : '',
        address: parsingData.address !== null ? parsingData.address : '',
        resume_path: parsingData.resume_path,
        unique_id: parsingData.unique_id,
        score: parsingData.score !== null ? parsingData.score.toString() : '0',
        candidate_summary: parsingData.candidate_summary !== null ? parsingData.candidate_summary : '',
        strength: parsingData.strength !== null ? parsingData.strength : '',
        explanation: parsingData.explanation,
        uploadLocation: this.uploadLocation,
        source: {
          name: this.loginUserName,
          id: this.loginUserId,
          role_id: this.loginRoleId,
          role_name: this.loginRoleName,
          partner_id: this.partnerId,
          partner_firm_name: this.partnerFirmName
        },
        auth: 'CV Upload',
        indent_id: this.indentId,
        eandiId: this.eandiId
      });
    }
    this.calculateAge(parsingData.dob);
    this.hq_qualification = parsingData.highest_qualification !== null ? parsingData.highest_qualification : '';

    const educationArray = this.updateCandidate.get('education') as FormArray;
    if(parsingData.education && Array.isArray(parsingData.education) && parsingData.education != ''){
      parsingData.education.forEach((edu: { qualification: any; institute: any; passedOn: any; percentage: any; }) => {
        educationArray.push(this.fb.group({
          qualification: [edu.qualification || ''],
          institute: [edu.institute || ''],
          passedOn: [edu.passedOn || ''],
          percentage: [edu.percentage || 0,[this.customValidator.numbersdotsValidator()]]
        }));
        this.allQualifications.push(edu.qualification || '');
      });
    }else{
      educationArray.push(this.fb.group({
        qualification: [''],
        institute: [''],
        passedOn: [0],
        percentage: [0]
      }));
    }

    this.loopSlNo=0;
    for(const value of this.allQualifications){
      if(this.hq_qualification == this.allQualifications[this.loopSlNo]){
        // console.log('mhqtest445t'+this.loopSlNo);
        this.markAsHighestQualification(this.loopSlNo);
      }
      this.loopSlNo++;
    }


    const experenceArray = this.updateCandidate.get('experience') as FormArray;
    if(parsingData.experience && Array.isArray(parsingData.experience) && parsingData.experience != ''){
      parsingData.experience.forEach((exe: { workingStatus: any, compName: any; industry: any; designation: any; startDate: any; endDate: any;}) => {
        experenceArray.push(this.fb.group({
          workingStatus: [exe.workingStatus || ''],
          compName: [exe.compName || ''],
          industry: [exe.industry || ''],
          designation: [exe.designation || ''],
          startDate: [exe.startDate || ''],
          endDate: [exe.endDate || '']
        }));
        this.workingStatusValue2[this.index] = true;
        this.index++;
      });
    }else{
      experenceArray.push(this.fb.group({
        workingStatus: [''],
        compName: [''],
        industry: [''],
        designation: [''],
        startDate: [''],
        endDate: ['']
      }));
    }



    if(this.parsingData.duplicate_db){
      const answers = this.updateCandidate.get('answers') as FormArray;
      this.selectedEandi?.questions.forEach((question:any, index:any) => {
        if(question.fieldType == "candidate field"){
          if(question.inputType == 'dob'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.exits_cand.dob !== null ? this.parsingData.exits_cand.dob : '');
            answerGroup.controls['question'].setValue('dob');
          }
          if(question.inputType == 'twe'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.exits_cand.totWorkExp !== null ? this.parsingData.exits_cand.totWorkExp : '');
            answerGroup.controls['question'].setValue('twe');
          }
          if(question.inputType == 'hq'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.exits_cand.highestQualificationCategory !== null ? this.parsingData.exits_cand.highestQualificationCategory : '');
            answerGroup.controls['question'].setValue('hq');
          }
          if(question.inputType == 'city'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.exits_cand.city !== null ? this.parsingData.exits_cand.city : '');
            answerGroup.controls['question'].setValue('city');
          }
          if(question.inputType == 'gender'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.exits_cand.gender !== null ? this.parsingData.exits_cand.gender: '');
            answerGroup.controls['question'].setValue('gender');
          }
          if(question.inputType == 'hqpy'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.exits_cand.highestQualificationPassedOn !== null ? this.parsingData.exits_cand.highestQualificationPassedOn: '');
          }
          if(question.inputType == 'hqp'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.exits_cand.highestQualificationPercentage !== null ? this.parsingData.exits_cand.highestQualificationPercentage: '');
          }
        }
      });
    }else{
      const answers = this.updateCandidate.get('answers') as FormArray;
      this.selectedEandi.questions.forEach((question:any, index:any) => {
        if(question.fieldType == "candidate field"){
          if(question.inputType == 'dob'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(parsingData.dob !== null ? parsingData.dob : '');
            answerGroup.controls['question'].setValue('dob');
          }
          if(question.inputType == 'twe'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(parsingData.totWorkExp !== null ? parsingData.totWorkExp : '');
            answerGroup.controls['question'].setValue('twe');
          }
          if(question.inputType == 'hq'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(parsingData.highest_qualification_category !== null ? parsingData.highest_qualification_category : '');
            answerGroup.controls['question'].setValue('hq');
          }
          if(question.inputType == 'city'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.city !== null ? this.parsingData.city : '');
            answerGroup.controls['question'].setValue('city');
          }
          if(question.inputType == 'gender'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(parsingData.gender !== null ? parsingData.gender: '');
            answerGroup.controls['question'].setValue('gender');
          }
          if(question.inputType == 'hqpy'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.highestQualificationPassedOn !== null ? this.parsingData.highestQualificationPassedOn: '');
          }
          if(question.inputType == 'hqp'){
            const answerGroup = answers.at(index) as FormGroup;
            answerGroup.controls['answer'].setValue(this.parsingData.highestQualificationPercentage !== null ? this.parsingData.highestQualificationPercentage: '');
          }
        }
      });
    }
  }

  insertCandidateData() {
    this.isFormSubmited = true;
    const data = this.updateCandidate.value;
    data.uploadLocation = this.cvParsing.controls.uploadLocation.value;
    data.referName = this.cvParsing.controls.referName.value;
    data.referEmail = this.cvParsing.controls.referEmail.value;
    data.referMobile = this.cvParsing.controls.referMobile.value;
    data.referEmployeId = this.cvParsing.controls.referEmployeId.value;
    data.referEmployeeLocation = this.cvParsing.controls.referEmployeeLocation.value;

    this.authToken = localStorage.getItem('access_token');

    if (this.updateCandidate.valid) {
      this.http.post<any>(`${environment.apiURL}${constant.apiEndPoint.SAVESINGLECANDIDATE}`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          if (response.status === 1) {
            this.testReset();
            this.apiResponse = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while saving the candidate data.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields, Mark as Highest Qualification and Complete E&I' });
    }
  }


  draftCandidateData() {
    this.isFormSubmited = true;
    const data = this.updateCandidate.value;
    this.authToken = localStorage.getItem('access_token');

    //if (this.updateCandidate.valid) {
      this.http.post<any>(`${environment.apiURL}${constant.apiEndPoint.SAVEASDRAFTCANDIDATE}`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          if (response.status === 1) {
            this.testReset();
            this.apiResponse = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while saving the candidate data.' });
        }
      );
    // } else {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields, Mark as Highest Qualification and E&I' });
    // }
  }


  // Check candidate mobile and email duplicate
  // Version 1.0
  verifyCandidate() {
    this.isLoading2 = true;
    const mobile = this.updateCandidate.get('mobile')?.value;
    const email = this.updateCandidate.get('email')?.value;
    this.authToken = localStorage.getItem('access_token');

    if (mobile !== '' && mobile != null && email !== '' && email != null) {
      this.mobileEmpty = false;
      this.emailEmpty = false;
      const data = { mobile: mobile, email: email };

      this.http.post<any>(`${environment.apiURL}${constant.apiEndPoint.CHECKDUPLICATE}`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading2 = false; // Stop loading
          if (response.status === 1) {
            this.duplicateMobile = response.mobile !== 0;
            this.duplicateEmail = response.email !== 0;

            if (response.mobile === 0 && response.email === 0) {
              this.duplicateCandidate = false;
              this.duplicateIndent = false;
              this.isCoolingPeriod = false;
            } else {
              this.duplicateCandidate = true;
            }
          } else {
            this.duplicateCandidate = true;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading2 = false; // Stop loading
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while verifying the candidate.' });
        }
      );
    } else {
      this.isLoading2 = false; // Stop loading
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill Mobile and Email id!' });
    }
  }


  // Apply duplicate candidate to indent
  // Version 0.1
  applyToIndent() {
    this.isLoading3 = true;
    const data = {
      "indent_id": this.indentId,
      "candidate_id": this.parsingData.exits_cand.id,
      "score": this.parsingData.score.toString(),
      "explanation": this.parsingData.explanation,
      "uploadLocation": this.uploadLocation,
      "referName": this.cvParsing.controls.referName.value,
      "referEmail": this.cvParsing.controls.referEmail.value,
      "referMobile": this.cvParsing.controls.referMobile.value,
      "referEmployeId": this.cvParsing.controls.referEmployeId.value,
      "referEmployeeLocation":this.cvParsing.controls.referEmployeeLocation.value,
      "source": this.parsingData.source,
      "answers": this.updateCandidate.controls.answers.value,
      "eandiId": this.eandiId
    };
    this.authToken = localStorage.getItem('access_token');

    if (data.indent_id !== '') {
      if(this.updateCandidate.controls.answers.status == 'VALID'){
        this.http.post<any>(`${environment.apiURL}${constant.apiEndPoint.DCATOINDENT}`, data, {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        }).subscribe(
          response => {
            this.isLoading3 = false; // Stop loading
            if (response.status === 1) {
              this.testReset();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            console.log(error);
            this.isLoading3 = false; // Stop loading
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while applying to the indent.' });
          }
        );
      }else{
        this.isLoading3 = false; // Stop loading
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill the form correctly' });
      }
    } else {
      this.isLoading3 = false; // Stop loading
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong, please try again later.' });
    }
  }


  controlValue:any = '';
  updateEandi(controlName: string): void{
    
    if(controlName == 'twe'){
      this.controlValue = this.updateCandidate.get('totWorkExp')?.value;
    }else if (controlName == 'hq'){
      this.controlValue = this.updateCandidate.get('highestQualificationCategory')?.value;
    }else{
      this.controlValue = this.updateCandidate.get(controlName)?.value;
    }

    const answers = this.updateCandidate.get('answers') as FormArray;
    this.selectedEandi.questions.forEach((question:any, index:any) => {
      if(question.inputType == controlName){
        const answerGroup = answers.at(index) as FormGroup;
        answerGroup.controls['answer'].setValue(this.controlValue);
        answerGroup.controls['question'].setValue(controlName);
        //console.log(answerGroup, this.controlValue)
      }
      
    });
    if(controlName === 'dob'){
      const dob = this.updateCandidate.get('dob')?.value;
      //console.log(dob)
      this.calculateAge(dob);
    }
    
  }




  markAsHighestQualification(index: number): void{
    const selectedEducation = this.educationGroups.at(index) as FormGroup;
    //console.log('mhqtest'+selectedEducation);
    const passedOnValue = selectedEducation.get('passedOn')?.value;
    const percentageValue = selectedEducation.get('percentage')?.value;
    const hqualification = selectedEducation.get('qualification')?.value;

    this.updateCandidate.patchValue({
      highestQualification: hqualification,
      highestQualificationPassedOn: passedOnValue,
      highestQualificationPercentage: percentageValue
    });
    const answers = this.updateCandidate.get('answers') as FormArray;
    this.selectedEandi.questions.forEach((question:any, index:any) => {
      if(question.inputType == "hqpy"){
        const answerGroup = answers.at(index) as FormGroup;
        answerGroup.controls['answer'].setValue(passedOnValue);
        answerGroup.controls['question'].setValue('hqpy');
      }
      if(question.inputType == "hqp"){
        const answerGroup = answers.at(index) as FormGroup;
        answerGroup.controls['answer'].setValue(percentageValue);
        answerGroup.controls['question'].setValue('hqp');
      }
      //console.log(question)
    });
  }

  calculateAge(dob:any) {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      
      if (birthDate > today) {
        //console.log("The date of birth is in the future");
        this.totalAge = 0;  // Set age to 0 or handle as needed
        return;
      }
  
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
  
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
  
      this.totalAge = age;
      //console.log("Age:", this.totalAge);
    }
  }

  cvParsing=this.fb.group({
    uploadLocation: ['',Validators.required],
    uploadFile: ['',Validators.required],
    referName:[''],
    referEmail:[''],
    referMobile:[''],
    referEmployeId:[''],
    referEmployeeLocation:['']
  })

  
  onCheckBoxChange(event: Event):void{
    const checked = (event.target as HTMLInputElement).checked;
    const rffNameRequired = this.cvParsing.get('referName');
    const rffMailRequired = this.cvParsing.get('referEmail');
    const rffMobileRequired = this.cvParsing.get('referMobile');
    const rffEmployeIdRequired = this.cvParsing.get('referEmployeId');
    const rffEmployeeLocation = this.cvParsing.get('referEmployeeLocation');
    console.log(checked);
    if(checked){
      this.employeeDetailsTab = true;
      this.hideButton = false;
      rffNameRequired?.setValidators([Validators.required,Validators.maxLength(50),this.customValidator.alphabetValidator()])
      rffMailRequired?.setValidators([this.customValidator.emailValidator()]);
      rffMobileRequired?.setValidators([this.customValidator.onlynumberValidator()]);
      rffEmployeIdRequired?.setValidators([Validators.required,this.customValidator.alphaNumaricValidator()]);
      rffEmployeeLocation?.setValidators([Validators.required,this.customValidator.alphabetValidator()]);
    }else{
      this.employeeDetailsTab = false;
      this.hideButton = true;
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
