import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { usersDetails } from '../../core/model/model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule ,DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { DialogModule } from 'primeng/dialog';
import { NgMultiSelectDropDownModule, IDropdownSettings } from 'ng-multiselect-dropdown';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, DialogModule, 
    NgMultiSelectDropDownModule, ToastModule
  ],
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css'],
  providers: [DatePipe]
})
export class MyaccountComponent implements OnInit {
  indedentService = inject(DashboardService);
  isToggled = false;
  profileData: usersDetails | null = null;
  isFormSubmited = false;
  apiMessage: any = "";
  authToken: any = "";
  overallFormValid = "";
  selectedUser: usersDetails | null = null;
  apiMessage2: any = "";
  isFormSubmited2 = false;
  overallFormValid2 = "";
  passwordMatch = "";
  apiMessage3: any = "";
  isFormSubmited3 = false;
  overallFormValid3 = "";
  file: any = "";
  imageUrl = '';
  uploadBtn = false;
  loginUserId: any;
  loginUserRole: string = '';
  isCandidate = false;
  isPartner = false;
  myProfileData: any;
  resume: any = "";
  resumeUploadBtn = false;
  resumeUrl = '';
  resumeUploadMsg = '';
  resumeLoader = false;
  baseAPIURL: any;
  zoneData: any[] = [];
  stateData: any[] = [];
  stateData2: any[] = [];
  cityData: any[] = [];
  isLoading = false;
  datePipe = inject(DatePipe);
  clientService = inject(DashboardService);
  dropdownSettings: IDropdownSettings = {};
  workingStatusValue = true;
  workingStatusValueIndex = 0;
  years: number[] = [];
  skillsData: any[] = [];
  industryData: any[] = [];
  workingStatusValue2: any[] = [];
  index: number =1;
  fb = inject(FormBuilder);
  private customValidator = new CustomValidatorComponent();
  showmsme:boolean = true;
  partnerList: any;
  partnerId:any;
  showgst:boolean= true;
  showgst2:boolean=true;
  degreeData: any [] = [];
  isSubmited: boolean = false;
  partnerAccStatus: string = '';
  hq_qualification:any ='';
  allQualifications: any[] = [];
  loopSlNo:number = 0;

  partnerImageUrl: string = '../assets/images/preview.png';
  partnerLogoFile:any="";
  gstLogoFile:any="";
  gstImageUrl: string = '../assets/images/preview.png';
  pancardLogoFile:any="";
  pancardImageUrl: string = '../assets/images/preview.png';
  msmeLogoFile:any="";
  msmeImageUrl: string = '../assets/images/preview.png';
  chequeLogoFile:any="";
  chequeImageUrl: string = '../assets/images/preview.png';
  uploadBtnText: string = 'Submit';


  constructor(private messageService: MessageService, private http: HttpClient,private router: Router) {
    this.loginUserId = localStorage.getItem('id');
    this.partnerId = localStorage.getItem('partner_id');
    this.baseAPIURL = environment.apiURL;
    this.getStateData2(this.authToken, '');
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getProfileData(this.authToken, this.loginUserId);
    this.getJobIndustryData(this.authToken, 'job industry');
    this.getSkillsData(this.authToken, 'skills');
    //this.getStateData(this.authToken, '');
    this.workingStatusValue2[0] = true;
    this.getYears();
    const user: any = localStorage.getItem('user');
    this.loginUserRole = user;

    if (user == 'Candidate') {
      this.testReset();
      this.isCandidate = true;
      this.getUserCandidateData(this.authToken, this.loginUserId);
    }

    if(user == 'Partner SPOC - Manager'){
      this.isPartner = true;
      this.getPartner(this.authToken,this.partnerId);
    }
    

    this.degreeData = [ 'Offroll Hiring', 'BFSI', 'Non BFSI', 'IT Hiring', 'Pharma', 'Manufacturing', 'Lateral Hiring'];

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      allowSearchFilter: true
    };
    
  }

  getPartner(authToken: string, id: string): void {
    this.indedentService.getSinglePartner(authToken, id).subscribe(
      (res: any) => {
        this.partnerList = res.result[0];
        if(this.partnerList){
          this.populatePartnerEditForm(this.partnerList);
          this.isSubmited = this.partnerList.isSubmited??true;
          this.partnerAccStatus = this.partnerList.partnerStatus;
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
        }
      },
      error => {
        // Handle error
      }
    );
  }

  async setActiveTab(tab:any){
    if(tab=="profile"){
      //this.getUserCandidateData(this.authToken, this.loginUserId);
    }
  }

  getProfileData(authToken: string, id: string): void {
    this.indedentService.getProfileData(authToken, id).subscribe(
      (res: any) => {
        this.profileData = res.result[0];
        if (this.profileData) {
          if(this.profileData.image !=''){
          this.imageUrl = environment.apiURL + this.profileData.image;
          }
          this.populateEditForm(this.profileData);
          if(this.profileData?.state != ""){
            //this.getStateData(this.authToken, '');
            const selectedState = this.stateData2.find(state => state.name === this.profileData?.state);
            const selectedStateId = selectedState ? selectedState.id : '';

            this.getCityData(this.authToken,selectedStateId);
          }
        }

        const selectedState = this.stateData.find(state => state.name === this.profileData?.state);
        const selectedStateId = selectedState ? selectedState.id : '';
      },
      error => {
        // Handle error
      }
    );
  }

  getStateOnZoneChnage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    let selectedZoneId:any = 0;
    if (selectedStateName == 'East') selectedZoneId = 1;
    else if (selectedStateName == 'West') selectedZoneId = 4;
    else if (selectedStateName == 'North') selectedZoneId = 2;
    else if (selectedStateName == 'South') selectedZoneId = 3;
    this.getStateData(this.authToken, selectedZoneId);
  }

  getStateData(authToken: string, zoneId: string): void {
    this.indedentService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
      },
      error => {
        // Handle error
      }
    );
  }

  getStateData2(authToken: string, zoneId: string): void {
    this.indedentService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData2 = res.result[0].data;
      },
      error => {
        // Handle error
      }
    );
  }

  getCityOnStateChnage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    const selectedState = this.stateData2.find(state => state.name === selectedStateName);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken,selectedStateId);
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

  getUserCandidateData(authToken: string, id: string): void {
    this.indedentService.getUserCandidateData(authToken, id).subscribe(
      (res: any) => {

        this.myProfileData = res.result;
        if(this.myProfileData?.state != ""){
        const selectedState = this.stateData2.find(state => state.name === this.myProfileData?.state);
        const selectedStateId = selectedState ? selectedState.id : '';
        this.getCityData(this.authToken,selectedStateId);
        }


        this.populateCandidateEditForm(this.myProfileData);
      },
      error => {
        // Handle error
      }
    );
  }

  editMyAccount = this.fb.group({
    updateUserId: ['', Validators.required],
    name: ['', [Validators.required, this.customValidator.alphaSpaceValidator()]],
    mobile: ['', [Validators.required, this.customValidator.onlynumberValidator()]],
    company: ['', [Validators.maxLength(150)]],
    department: ['', [Validators.maxLength(150)]],
    designation: ['', [Validators.maxLength(150), Validators.pattern('^[a-zA-Z ,-]{1,100}$')]],
    role_id: ['', Validators.required],
    role_text: ['', Validators.required],
    gender: ['Male'],
    zone: ['0'],
    state: [''],
    city: [''],
    pincode: ['', [Validators.pattern('^[0-9]*$')]],
    address: ['', [Validators.maxLength(500)]]
  })

  populateEditForm(profileData: usersDetails): void {
    if (profileData) {
      this.editMyAccount.patchValue({
        updateUserId: profileData._id,
        name: profileData.name,
        mobile: profileData.mobile,
        company: profileData.company,
        department: profileData.department,
        designation: profileData.designation,
        role_id: profileData.role_id.toString(),
        role_text: profileData.role_text,
        gender: profileData.gender || 'Male',
        zone: profileData.zone,
        state: profileData.state,
        city: profileData.city,
        pincode: profileData.pincode,
        address: profileData.address,
      });
    }
  }

  onMyRoleChnage(event: any) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    this.editMyAccount.patchValue({
      role_text: selectedText
    });
  }

  async postData(url = '', data = {}, authToken: string) {
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

  async oneditform(){
    console.log("clicked");

  }

  async onSubmit() {
    console.log("clicked");
    this.isFormSubmited = true;
    this.isLoading = true;
    const data = this.editMyAccount.value;
    console.log(data);
    return
    this.authToken = localStorage.getItem('access_token');
    const updatedId = this.editMyAccount.controls.updateUserId.value;
  }

  changePasswordForm = this.fb.group({
    id: [''],
    old_password: ['', Validators.required],
    new_password: ['', [Validators.required,this.customValidator.passwordValidValidator()]],
    confirm_password: ['', Validators.required],
  })

  


  async changePassword() {
    this.isLoading = true;
    this.isFormSubmited3 = true;

    const data = this.changePasswordForm.value;
    data.id = this.loginUserId;
    this.authToken = localStorage.getItem('access_token');

    const newpassword = this.changePasswordForm.controls.new_password.value;
    const confirmpassword = this.changePasswordForm.controls.confirm_password.value;

    if (newpassword === confirmpassword) {
      this.passwordMatch = '';

      if (this.changePasswordForm.valid) {
        const url = `${environment.apiURL}${constant.apiEndPoint.CHANGEPASSWORD}`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        });

        this.http.post<any>(url, data, { headers })
          .subscribe(
            response => {
              this.isLoading = false; // Stop loading
              this.changePasswordForm.reset();
              this.messageService.add({ severity: response.status === 1 ? 'success' : 'error', summary: response.status === 1 ? 'Success' : 'Error', detail: response.message });
            },
            error => {
              this.isLoading = false; // Stop loading
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while changing the password.' });
            }
          );
        this.overallFormValid3 = '';
      } else {
        this.isLoading = false; // Stop loading
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
      }
    } else {
      this.isLoading = false; // Stop loading
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'New and Confirm password does not match' });
    }
  }



  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // onProfileImage(event: any) {
  //   this.file = event.target.files[0];
  //   const maxSize = 2 * 1024 * 1024; // 2 MB
  //   const validFileTypes = ['image/jpeg', 'image/jpg','image/png'];

  //   if (this.file.size > maxSize) {
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
  //   } else if (!validFileTypes.includes(this.file.type)) {
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
  //   } else {
  //     this.uploadBtn = true;
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imageUrl = reader.result as string;
  //     };
  //     reader.readAsDataURL(this.file);
  //   }
  // }


  onProfileImage(event: any) {
    this.file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2 MB
    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const fileName = this.file.name;
  
    // Regular expression to check if the file name has only one valid extension at the end
    const validExtensionPattern = /\.(jpg|jpeg|png)$/i;
  
    // Check for invalid file name pattern
    if (!validExtensionPattern.test(fileName)) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: "* Invalid file name. Please ensure the file has a valid extension (.jpg, .jpeg, .png) without additional extensions." 
      });
    } else if (this.file.size > maxSize) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: "* File size should be less than 2 MB" 
      });
    } else if (!validFileTypes.includes(this.file.type)) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" 
      });
    } else {
      this.uploadBtn = true;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.file);
    }
  }
  


  async updateProfileImage() {
    if (this.profileData) {
      this.isLoading = true;

      const formData: FormData = new FormData();
      const updatedId = this.profileData._id;
      formData.append('image', this.file);
      this.authToken = localStorage.getItem('access_token');

      const url = `${environment.apiURL}${constant.apiEndPoint.CHANGEPROFILEIMAGE}?id=${updatedId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      });

      this.http.put<any>(url, formData, { headers })
        .subscribe(
          response => {
            this.isLoading = false; // Stop loading
            this.messageService.add({ severity: response.status === 1 ? 'success' : 'error', summary: response.status === 1 ? 'Success' : 'Error', detail: response.message });
            this.uploadBtn = false;
          },
          error => {
            this.isLoading = false; // Stop loading
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the profile image.' });
          }
        );
    }
  }


  insertCandidate = this.fb.group({
    dob: ['', [Validators.required,this.customValidator.minAgeValidator(18)]],
    totWorkExp: ['',[Validators.required,this.customValidator.numbersAndFloatnumValidator()]],
    fatherName: ['',[this.customValidator.alphabetValidator()]],
    skills: ['', Validators.required],
    strengths: [''],
    gender: ['Male'],
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
        qualification: ['',[Validators.required,Validators.maxLength(150)]],
        institute: ['',[Validators.required,Validators.maxLength(150)]],
        passedOn: ['',Validators.required],
        percentage: ['',[Validators.required,this.customValidator.numbersdotsValidator()]]
      })
    ]),
    experience: this.fb.array([
      /* to be remove*/
      this.fb.group({
        workingStatus: ['',Validators.required],
        compName: ['',[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
        industry: ['',Validators.required],
        designation: ['',[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
        startDate: ['',Validators.required],
        endDate: ['']
      },{ validators: [
        this.customValidator.dateRangeValidator('startDate', 'endDate'),
        
      ],
    })
    ]),
    resume_path: [''],
    candidate_summary: ['',[Validators.maxLength(5000)]],
  })

  get educationGroups() {
    return this.insertCandidate.get('education') as FormArray;
  }

  get expGroups() {
    return this.insertCandidate.get('experience') as FormArray;
  }

  addAnswer(qualification = '', institute = '', passedOn = '', percentage = '') {
    this.educationGroups.push(
      this.fb.group({
        qualification: [qualification, [Validators.required,Validators.maxLength(150)]],
        institute: [institute,[ Validators.required,Validators.maxLength(150)]],
        passedOn: [passedOn, Validators.required],
        percentage: [percentage, [Validators.required,this.customValidator.numbersdotsValidator()]]
      })
    );
  }

  addExperience(workingStatus = '', compName = '', industry = '', designation = '', startDate = '', endDate = '') {
    this.expGroups.push(
      this.fb.group({
        workingStatus: [workingStatus, Validators.required],
        compName: [compName,[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
        industry: [industry, Validators.required],
        designation: [designation, [Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
        startDate: [this.formatDate(startDate), Validators.required],
        endDate: [this.formatDate(endDate), Validators.required]
      },{ validators: [
        this.customValidator.dateRangeValidator('startDate', 'endDate'),
        
      ],
    })
    );
    this.workingStatusValue2[this.index] = true;
    this.index++;
    console.log(this.workingStatusValue2);
    // this.workingStatusValue = true;
    // this.workingStatusValueIndex += 1;
  }

  removeAnswer(index: number) {
    this.educationGroups.removeAt(index);
  }

  removeExperience(index: number) {
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

  workingStatusSelect(event: Event, index: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.workingStatusValueIndex = index;
    const experienceFormArray = this.insertCandidate.controls.experience as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const expEnddate = experienceFromGroup.get('endDate')
    if(selectedValue == "Currently Working"){
      this.workingStatusValue = false;
      this.workingStatusValue2[index]=false;
      expEnddate?.clearValidators();
    }else{
      this.workingStatusValue = true;
      this.workingStatusValue2[index]=true;
      expEnddate?.setValidators([Validators.required]);
    }
    expEnddate?.updateValueAndValidity();
  }

  workingStatusSelect2(status:any, index: number): void {
    const selectedValue = status;
    this.workingStatusValueIndex = index;
    const experienceFormArray = this.insertCandidate.controls.experience as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const expEnddate = experienceFromGroup.get('endDate')
    if(selectedValue == "Currently Working"){
      this.workingStatusValue = false;
      this.workingStatusValue2[index]=false;
      expEnddate?.clearValidators();
    }else{
      this.workingStatusValue = true;
      this.workingStatusValue2[index]=true;
      expEnddate?.setValidators([Validators.required]);
    }
    expEnddate?.updateValueAndValidity();
  }

  getJobIndustryData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.industryData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }

  getSkillsData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.skillsData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }

  

  populateCandidateEditForm(myProfileData: any): void {
    if (myProfileData) {
      this.insertCandidate.patchValue({
        dob: this.formatDate(myProfileData.dob),
        highestQualificationCategory: myProfileData.highestQualificationCategory !== null ? myProfileData.highestQualificationCategory : '',
        totWorkExp: myProfileData.totWorkExp,
        fatherName: myProfileData.fatherName,
        skills: myProfileData.skills,
        strengths: myProfileData.strengths,
        gender: myProfileData.gender !== '' ? myProfileData.gender : 'Male',
        state: myProfileData.state !== null ? myProfileData.state : '',
        city: myProfileData.city !== null ? myProfileData.city : '',
        address: myProfileData.address,
        resume_path: myProfileData.resume_path,
        candidate_summary: myProfileData.candidate_summary,
      });
    }
    this.hq_qualification = myProfileData.highestQualification !== null ? myProfileData.highestQualification : '';

    const educationArray = this.insertCandidate.get('education') as FormArray;
    if(myProfileData.education && Array.isArray(myProfileData.education)){
      myProfileData.education.forEach((edu: { qualification: any; institute: any; passedOn: any; percentage: any; }) => {
        educationArray.push(this.fb.group({
          qualification: [edu.qualification || '',[Validators.maxLength(150)]],
          institute: [edu.institute || '',[Validators.maxLength(150)]],
          passedOn: [edu.passedOn || '',[Validators.required]],
          percentage: [edu.percentage || 0,this.customValidator.numbersdotsValidator()]
        }));
        this.allQualifications.push(edu.qualification || '');
      });
    }else{
      educationArray.push(this.fb.group({
        qualification: [''],
        institute: [''],
        passedOn: ['',[Validators.required]],
        percentage: [0,[Validators.required,this.customValidator.numbersdotsValidator()]]
      }));
    }

    this.loopSlNo=0;
    for(const value of this.allQualifications){
      if(this.hq_qualification == this.allQualifications[this.loopSlNo]){
        this.markAsHighestQualification(this.loopSlNo);
      }
      this.loopSlNo++;
    }
    
    const experenceArray = this.insertCandidate.get('experience') as FormArray;
    if(myProfileData.experience && Array.isArray(myProfileData.experience)){
      myProfileData.experience.forEach((exe: { workingStatus: any, compName: any; industry: any; designation: any; startDate: any; endDate: any;}, index: number) => {
        experenceArray.push(this.fb.group({
          workingStatus: [exe.workingStatus || '',Validators.required],
          compName: [exe.compName || '',[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
          industry: [exe.industry || '',Validators.required],
          designation: [exe.designation || '',[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
          startDate: [this.formatDate(exe.startDate) || '',Validators.required],
          endDate: [exe.endDate || '',Validators.required]
        },{ validators: [
          this.customValidator.dateRangeValidator('startDate', 'endDate'),
          
        ],
      }));
        this.workingStatusSelect2(exe.workingStatus, index);
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
  }


  populateCandidateEditForm2(myProfileData: any): void {
    if (myProfileData) {
      this.insertCandidate.patchValue({
        dob: this.formatDate(myProfileData.dob),
        highestQualificationCategory: myProfileData.highest_qualification_category !== null ? myProfileData.highest_qualification_category : '',
        totWorkExp: myProfileData.totWorkExp,
        fatherName: myProfileData.fatherName,
        skills: myProfileData.skills,
        strengths: myProfileData.strengths,
        gender: myProfileData.gender !== null ? myProfileData.gender : 'Male',
        state: myProfileData.state !== null ? myProfileData.state : '',
        city: myProfileData.city !== null ? myProfileData.city : '',
        address: myProfileData.address,
        resume_path: myProfileData.resume_path,
        candidate_summary: myProfileData.candidate_summary
      });
    }
    this.hq_qualification = myProfileData.highest_qualification !== null ? myProfileData.highest_qualification : '';

    const educationArray = this.insertCandidate.get('education') as FormArray;
    if(myProfileData.education && Array.isArray(myProfileData.education)){
      myProfileData.education.forEach((edu: { qualification: any; institute: any; passedOn: any; percentage: any; }) => {
        educationArray.push(this.fb.group({
          qualification: [edu.qualification || '',[Validators.maxLength(150)]],
          institute: [edu.institute || '',[Validators.maxLength(150)]],
          passedOn: [edu.passedOn || '',[Validators.required]],
          percentage: [edu.percentage || 0,this.customValidator.numbersdotsValidator()]
        }));
        this.allQualifications.push(edu.qualification || '');
      });
    }else{
      educationArray.push(this.fb.group({
        qualification: [''],
        institute: [''],
        passedOn: ['', Validators.required],
        percentage: [0,[Validators.required,this.customValidator.numbersdotsValidator()]]
      }));
    }

    this.loopSlNo=0;
    for(const value of this.allQualifications){
      if(this.hq_qualification == this.allQualifications[this.loopSlNo]){
        this.markAsHighestQualification(this.loopSlNo);
      }
      this.loopSlNo++;
    }
    
    const experenceArray = this.insertCandidate.get('experience') as FormArray;
    if(myProfileData.experience && Array.isArray(myProfileData.experience)){
      myProfileData.experience.forEach((exe: { workingStatus: any, compName: any; industry: any; designation: any; startDate: any; endDate: any;}, index: number) => {
        experenceArray.push(this.fb.group({
          workingStatus: [exe.workingStatus || '',Validators.required],
          compName: [exe.compName || '',[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
          industry: [exe.industry || '',Validators.required],
          designation: [exe.designation || '',[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
          startDate: [this.formatDate(exe.startDate) || '',Validators.required],
          endDate: [exe.endDate || '',Validators.required]
        }));
        this.workingStatusSelect2(exe.workingStatus, index);
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
  }


  testReset(){
    this.insertCandidate.reset();
    this.myProfileData = [];
    while (this.educationGroups.length !== 0) {
      this.educationGroups.removeAt(0);
    }
    while (this.expGroups.length !== 0) {
      this.expGroups.removeAt(0);
    }
    this.loopSlNo = 0;
    this.allQualifications.length = 0;
  }

  testReset2(){
    this.insertCandidate.reset();
    while (this.educationGroups.length !== 0) {
      this.educationGroups.removeAt(0);
    }
    while (this.expGroups.length !== 0) {
      this.expGroups.removeAt(0);
    }
    this.loopSlNo = 0;
    this.allQualifications.length = 0;
  }

  async insertCandidateData() {
    this.isFormSubmited = true;
    const data = this.insertCandidate.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.insertCandidate.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.EDITCANDIDATE}/${this.myProfileData._id}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            //this.messageService.add({ severity: response.status === 1 ? 'success' : 'error', summary: response.status === 1 ? 'Success' : 'Error', detail: response.message });
            if(this.loginUserRole == 'Candidate' || response.status === 1){
              //this.confirmStatusChange()
              const jobId = localStorage.getItem('job');
              if(jobId){
                localStorage.removeItem("job");
                this.confirmStatusChange2(jobId)
              }else{
                this.confirmStatusChange()
              }
            }
           
            
          },
          error => {
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting candidate data.' });
          }
        );

      this.overallFormValid = '';
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

  triggerResumeInput() {
    const resumeInput = document.getElementById('resumeInput') as HTMLInputElement;
    resumeInput.click();
  }

  onProfileResume(event: any) {
    this.resume = event.target.files[0];
    if (this.resume) {
      const maxSize = 5 * 1024 * 1024; // 2 MB
      const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/rtf', 'text/plain'];
      this.resumeUploadBtn = true;
      this.resumeUrl = this.resume.name;  

      if (this.resume.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 5 MB" });
        

      }else if (!validFileTypes.includes(this.resume.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only .pdf, .doc, .docx, .rtf, .txt are allowed" });
        
        
      }else{
        const reader = new FileReader();
        reader.onload = () => {
          // this.partnerImageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.resume);
      }
    }
  }


  async resumeUpload() {
    this.resumeLoader = true;
    const formData: FormData = new FormData();
    
    if (this.myProfileData) {
      const updatedId = this.myProfileData._id;
      formData.append('resume', this.resume);
      this.testReset2();

      this.authToken = localStorage.getItem('access_token');
      const url = `${environment.apiURL}${constant.apiEndPoint.RESUMEEXTRACT}?candidateId=${updatedId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      });

      this.http.post<any>(url, formData, { headers })
        .subscribe(
          response => {
            this.uploadBtnText = 'Regenerate';
            this.resumeLoader = false;
            if (response.status === 1) {
              this.populateCandidateEditForm2(response.result);
            }
          },
          error => {
            this.resumeLoader = false;
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while uploading the resume.' });
          }
        );
    }
  }


  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  onCheckWorkingStatus(event :Event):void{
    const check = (event.target as HTMLSelectElement).value;
    console.log(check);
  }


  
  markAsHighestQualification(index: number): void{
    const selectedEducation = this.educationGroups.at(index) as FormGroup;
    const passedOnValue = selectedEducation.get('passedOn')?.value;
    const percentageValue = selectedEducation.get('percentage')?.value;
    const hqualification = selectedEducation.get('qualification')?.value;

    this.insertCandidate.patchValue({
      highestQualification: hqualification,
      highestQualificationPassedOn: passedOnValue,
      highestQualificationPercentage: percentageValue
    });
  }




  /*Edit partner*/
  editPartner = this.fb.group({
    updatePartnerId: [''],
    gstin: [''],
    gistinNumber: ['',Validators.required],
    gstinImage: ['',Validators.required],
    pancard: ['',[Validators.required,this.customValidator.panNumberValidator()]],
    pancardImage: ['',Validators.required],
    msme:[''],
    msmeNumber: ['',[this.customValidator.msmeCodeValidator()]],
    msmeImage: [''],
    bankName: ['',[Validators.required,this.customValidator.bankNameValidator()]],
    accountName: ['',[Validators.required,this.customValidator.bankNameValidator()]],
    branchName: ['',[Validators.required,this.customValidator.bankbranchNameValidator()]],
    accountNumber: ['',[Validators.required,this.customValidator.accountnumberValidator()]],
    ifscCode: ['',[Validators.required,this.customValidator.ifscnumberValidator()]],
    bankAddress: ['',[Validators.required,Validators.maxLength(5000),this.customValidator.addressValidator()]],
    micrCode: ['',[Validators.required,this.customValidator.micrCodeValidator()]],
    chequeImage: ['',Validators.required],
    zone: ['',[Validators.required]],
    state: ['',[Validators.required]],
    city: ['',[Validators.required]],
    pincode: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
    address: ['',[Validators.required,Validators.maxLength(5000),this.customValidator.addressValidator()]],
    registeredAddress: ['',[Validators.required,Validators.maxLength(5000),this.customValidator.addressValidator()]],
    isSubmited: [true]
  })



  populatePartnerEditForm(partnerData: any): void {
    if (partnerData) {
      this.editgstinCheck(partnerData.gstin??false);
      this.msmeCheck(partnerData.msme??false);
      this.editPartner.patchValue({
        updatePartnerId: partnerData._id,
        gstin: partnerData.gstin??false,
        gistinNumber: partnerData.gistinNumber,
        pancard: partnerData.pancard,
        msme: partnerData.msme??false,
        msmeNumber: partnerData.msmeNumber,
        bankName: partnerData.bankName,
        accountName: partnerData.accountName,
        branchName: partnerData.branchName,
        accountNumber: partnerData.accountNumber,
        ifscCode: partnerData.ifscCode,
        bankAddress: partnerData.bankAddress,
        micrCode: partnerData.micrCode,
        zone: partnerData.zone,
        state: partnerData.state,
        city: partnerData.city,
        pincode: partnerData.pincode,
        address: partnerData.address,
        registeredAddress: partnerData.registeredAddress,
      });
    }
  }

  editgstinCheck(gst: any){
    this.showgst = gst;
    const gistinNumber = this.editPartner.get('gistinNumber');
    const gstinImage = this.editPartner.get('gstinImage');
    if(this.showgst == false){
      gistinNumber?.clearValidators();
    }else{
      gistinNumber?.setValidators([Validators.required, this.customValidator.gstnumberValidator()]);
    }
    gistinNumber?.updateValueAndValidity();

    if(this.showgst == false){
      gstinImage?.clearValidators();
    }else{
      gstinImage?.setValidators([Validators.required]);
    }
    gstinImage?.updateValueAndValidity();
  }
  msmeCheck(msme: any){
    this.showmsme = msme;
    const msmeNumber = this.editPartner.get('msmeNumber');
    const msmeImage = this.editPartner.get('msmeImage');
    if(this.showmsme == false){
      msmeNumber?.clearValidators();
    }else{
      msmeNumber?.setValidators([Validators.required,this.customValidator.msmeCodeValidator()]);
    }
    msmeNumber?.updateValueAndValidity();

    if(this.showmsme == false){
      msmeImage?.clearValidators();
    }else{
      msmeImage?.setValidators([Validators.required]);
    }
    msmeImage?.updateValueAndValidity();
  }
  edittoUppercase() {
    const pancardControl = this.editPartner.get('pancard');
    if (pancardControl) {
      const value = pancardControl.value;
      if (value && typeof value === 'string') {
        pancardControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }
  toUppercase(){
    const ifscControl = this.editPartner.get('ifscCode');
    if (ifscControl) {
      const value = ifscControl.value;
      if (value && typeof value === 'string') {
        ifscControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }
  editmsmetoUppercase() {
    const pancardControl = this.editPartner.get('msmeNumber');
    if (pancardControl) {
      const value = pancardControl.value;
      if (value && typeof value === 'string') {
        pancardControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }


  resetPancardPartialForm(){
    this.editPartner.patchValue({
      pancardImage:'',
    });
    this.editPartner.get('pancardImage')?.markAsPristine();
  }
  resetGstimagePartialForm(){
    this.editPartner.patchValue({
      gstinImage:''
    });
    this.editPartner.get('gstinImage')?.markAsPristine();
  }
  resetMSMEimagePartialForm(){
    this.editPartner.patchValue({
      msmeImage:''
    });
    this.editPartner.get('msmeImage')?.markAsPristine();
  }
  resetchequeimagePartialForm(){
    this.editPartner.patchValue({
      chequeImage:''
    });
    this.editPartner.get('chequeImage')?.markAsPristine();
  }


  onPancardSelected(event: any){
    this.pancardLogoFile= File = event.target.files[0];
    if (this.pancardLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg','image/png','application/pdf'];
      if (this.pancardLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetPancardPartialForm();
        this.pancardImageUrl = '../assets/images/preview.png';
      }else if (!validFileTypes.includes(this.pancardLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetPancardPartialForm();
        this.pancardImageUrl = '../assets/images/preview.png';
      }else{
        if(this.pancardLogoFile.type == 'application/pdf'){
          this.pancardImageUrl = "../assets/images/pdfpreview.png";
        }else{
          const reader = new FileReader();
          reader.onload = () => {
            this.pancardImageUrl = reader.result as string;
          };
          reader.readAsDataURL(this.pancardLogoFile);
        }
      }
    }
  }
  onGstSelected(event: any){
    this.gstLogoFile= File = event.target.files[0];
    if (this.gstLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg','image/png','application/pdf'];
        if (this.gstLogoFile.size > maxSize) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
          this.resetGstimagePartialForm();
          this.gstImageUrl = '../assets/images/preview.png';
        }else if (!validFileTypes.includes(this.gstLogoFile.type)) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
          this.resetGstimagePartialForm();
          this.gstImageUrl = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
        }else{
          if(this.gstLogoFile.type == 'application/pdf'){
            this.gstImageUrl = "../assets/images/pdfpreview.png";
          }else{
            const reader = new FileReader();
            reader.onload = () => {
              this.gstImageUrl = reader.result as string;
            };
            reader.readAsDataURL(this.gstLogoFile);
          }
        }
      }
  }
  onMsmeSelected(event: any){
    this.msmeLogoFile= File = event.target.files[0];
    if (this.msmeLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg','image/png','application/pdf'];
        if (this.msmeLogoFile.size > maxSize) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
          this.resetMSMEimagePartialForm();
          this.msmeImageUrl = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
        }else if (!validFileTypes.includes(this.msmeLogoFile.type)) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
          this.resetMSMEimagePartialForm();
          this.msmeImageUrl = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
        }else{
          if(this.msmeLogoFile.type == 'application/pdf'){
            this.msmeImageUrl = "../assets/images/pdfpreview.png";
          }else{
            const reader = new FileReader();
            reader.onload = () => {
              this.msmeImageUrl = reader.result as string;
            };
            reader.readAsDataURL(this.msmeLogoFile);
          }
        }
      }
  }
  onChequeSelected(event: any){
    this.chequeLogoFile= File = event.target.files[0];
    if (this.chequeLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg','image/png','application/pdf'];
      if (this.chequeLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetchequeimagePartialForm();
        this.chequeImageUrl = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
      }else if (!validFileTypes.includes(this.chequeLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, PNG and PDF are allowed" });
        this.resetchequeimagePartialForm();
        this.chequeImageUrl = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
      }else{
        if(this.chequeLogoFile.type == 'application/pdf'){
          this.chequeImageUrl = "../assets/images/pdfpreview.png";
        }else{
          const reader = new FileReader();
          reader.onload = () => {
            this.chequeImageUrl = reader.result as string;
          };
          reader.readAsDataURL(this.chequeLogoFile);
        }
      }
    }
  }


  updatePartner() {
    this.isFormSubmited = true;
    this.isLoading = true;
    const data = this.editPartner.value;
    const updatedId = this.editPartner.controls.updatePartnerId.value;
    this.authToken = localStorage.getItem('access_token');

    const formData: FormData = new FormData();
    if (this.gstLogoFile) {
      formData.append('gstinImage', this.gstLogoFile);
    }
    if (this.pancardLogoFile) {
      formData.append('pancardImage', this.pancardLogoFile);
    }
    if (this.msmeLogoFile) {
      formData.append('msmeImage', this.msmeLogoFile);
    }
    if (this.chequeLogoFile) {
      formData.append('chequeImage', this.chequeLogoFile);
    }

    formData.append('partnerData', JSON.stringify(data));

    if (this.editPartner.valid) {
      this.http.put<any>(`${environment.apiURL}${constant.apiEndPoint.EDITPARTNER2}?id=${updatedId}`, formData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false;
          if (response.status === 1) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the partner data.' });
        }
      );
      this.overallFormValid2 = '';
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


 
  confirmStatusChange(): void {
    Swal.fire({
      title: `Your Profile is Updated Successfully.!!`,
      icon: 'success',
      confirmButtonText: 'Explore Jobs',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/indent'])
      }
    });
  }


  confirmStatusChange2(jobId:any): void {
    Swal.fire({
      title: `Your Profile is Updated Successfully.!!`,
      icon: 'success',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/job_details/'+jobId])
      }
    });
  }

}
