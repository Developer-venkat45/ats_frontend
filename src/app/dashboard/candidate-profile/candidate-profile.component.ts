import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModel, APIResponseModelGrid, Candidate, CandidateAssessmentScore } from '../../core/model/model';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePipe} from '@angular/common';
import { FormBuilder, Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [NavbarComponent, PdfViewerModule, AccordionModule, CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, RouterModule, ToastModule, CalendarModule,NgxSkeletonLoaderModule],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css'
})
export class CandidateProfileComponent {
  indedentService = inject(DashboardService);
  candidateData : any | null = null;
  maxScore = 10;
  loader:boolean=true;
  assessmentList: any;
  eandiList: any [] = [];
  assessmentId: any ="";
  eandiId: any ="";
  indentId: any ="";
  candidateId: any ="";
  apiResponseMessage: string = "";
  submitButton: boolean = true;
  eandIsubmitButton: boolean = true;
  candidateAssessmentScoreData: CandidateAssessmentScore | null = null;
  indentStagesScreening: any;
  indentStagesInterview: any;
  indentStagesOffer: any;
  indentStagesHire: any;
  indentStaged: any;
  myAvail: any [] = [];
  myNotAvail: any [] = [];
  myLastIndex:any;
  currentStage: any;
  currentParentStage: any;
  selectedStage:any;
  selectedParentStage: any;
  loginUserName:any;
  loginUserId:any;
  loginUserRole:any;
  enadiAnswerData: any;
  indentStaging: any;
  apiURL:any;
  authToken:any="";
  apiMessage4:any="";
  isFormSubmited: boolean = false;
  overallFormValid4: string = "";
  isShown: boolean = true;
  candidateParentStageSelected: any;
  candidateParentStageSelected1: any;
  candidateParentStageSelected2: any;
  selectMode: boolean = false;
  selectMode2: boolean = false;
  assessmentData: any;
  eandiData: any;
  minDate:Date = new Date();
  thechildstage:any;
  
  fb = inject(FormBuilder);
  
  visible: boolean = false;

  private customValidator= new CustomValidatorComponent();

  constructor(private route: ActivatedRoute, private messageService: MessageService, private http: HttpClient) { 
    this.apiURL= environment.apiURL;
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today;
    const candidateId:any = this.route.snapshot.paramMap.get('id')!;
    const indentId:any = this.route.snapshot.paramMap.get('indentId')!;
    const authToken:any = localStorage.getItem('access_token');
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    this.loginUserRole = localStorage.getItem('role_name');
    this.getSingleCandidate(authToken, candidateId, indentId);
    const user: any = localStorage.getItem('user');
    if(user == 'Partner SPOC - Recruiter' || user == 'Partner SPOC - Manager' || user == 'Partner Manager'){
      this.isShown = false;
    }
  }



  getSingleCandidate(authToken: string, candidateId: string, indentId: string): void {
    this.indedentService.getSingleCandidate(authToken, candidateId, indentId).subscribe(
      (res: any) => {
        this.candidateData = res.result[0];
        this.assessmentId = this.candidateData?.indent?.indentStep6?.assessmentId;
        this.eandiId = this.candidateData?.filledEandi;
        this.indentId = this.candidateData?.indent?._id;
        this.candidateId = this.candidateData?._id
        this.loader = false;
        this.indentStagesScreening = this.convertStageingToArray(this.candidateData?.stageing?.screening);
        this.indentStaged = this.convertObjectToArray(this.candidateData?.stagelog);
        this.indentStaged.sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime());


        this.indentStaging = this.convertStageingToArray2(this.candidateData?.indent?.indentStep5);
        this.getAlleandi2(this.authToken,this.eandiId,'','');
        this.getCandidateEandi(authToken, this.indentId, this.eandiId, this.candidateId);
        if(this.assessmentId !=''){
          this.getAllAssessment(this.authToken,this.assessmentId,'','');
          this.getCandidateAssessment(authToken, this.indentId, this.assessmentId, this.candidateId);
        }
        console.log(this.indentStaged);
      },
      error => {
        // Handle error
      }
    );
  }



  
  getAlleandi2(authToken:string,id:string,title:string,category:string): void {
    this.indedentService.getAlleandi(authToken,id,title,category).subscribe(
      (res: any) => {
        this.eandiData = res.result[0];
        //console.log(this.eandiData)
      },
      error => {
        // Handle error
      }
    );
  }

  getAllAssessment(authToken:string,id:string,title:string,category:string): void {
    this.indedentService.getAllAssessment(authToken,id,title,category).subscribe(
      (res: any) => {
        this.assessmentData = res.result[0];
      },
      error => {
        // Handle error
      }
    );
  }


  getCandidateEandi(authToken: string, indentId: string, eandiId: string, candidateId: string): void {
    this.indedentService.getCandidateEandi(authToken, indentId, eandiId, candidateId).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.enadiAnswerData = res.result[0];
          this.eandiList = res.result[0];
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


  getCandidateAssessment(authToken: string, indentId: string, assessmentId: string, candidateId: string): void {
    this.indedentService.getCandidateAssessment(authToken, indentId, assessmentId, candidateId).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.assessmentList = res.result[0];
          this.submitButton = false;
        }else{
          this.submitButton = true;
        }
        console.log(this.assessmentList?.answers);
      },
      error => {
        // Handle error
      }
    );
  }

  convertObjectToArray(data: any): any[] {
    let resultArray: any[] = [];
  
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (Array.isArray(data[key])) {
          resultArray = resultArray.concat(data[key]);
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          resultArray = resultArray.concat(this.convertObjectToArray(data[key]));
        }
      }
    }
  
    return resultArray;
  }

  convertStageingToArray(stageing: any): { stage: string, details: any }[] {
    if (!stageing) {
      return [];
    }
    return Object.keys(stageing).map(key => ({
      stage: key,
      details: stageing[key]
    }));
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

  getScorePercentage(score: number | undefined): string {
    if (score !== undefined && score !== null) {
      return ((score / this.maxScore) * 100).toFixed(2) + '%';
    } else {
      return 'N/A';
    }
  }

  modeChanged(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;

    const videoInterview = this.updateCandidateStage.get('videoInterview');
    const interviewAddress = this.updateCandidateStage.get('interviewAddress');


    if(selectedText == "In-Person"){
      this.selectMode = true;
      this.selectMode2 = false;
      interviewAddress?.setValidators([Validators.required]);
    }else{
      interviewAddress?.clearValidators();
    }
    interviewAddress?.updateValueAndValidity();

    if(selectedText == "Telephonic"){
      this.selectMode = false;
      this.selectMode2 = false;
    }

    if(selectedText == "Virtual"){
      this.selectMode2 = true;
      videoInterview?.setValidators([Validators.required]);
    }else{
      videoInterview?.clearValidators();
    }
    videoInterview?.updateValueAndValidity();
  }


  stageDisplayName: any;
  stageChanged(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;
    this.stageDisplayName = selectedText;
    this.candidateParentStageSelected = selectedValue;
    this.candidateParentStageSelected1 = selectedValue.split('.')[0];
    this.candidateParentStageSelected2 = selectedValue.split('.')[1];


    const screeningRejectReason = this.updateCandidateStage.get('screeningRejectReason');
    const screeningHoldReason = this.updateCandidateStage.get('screeningHoldReason');
    const interviewDate = this.updateCandidateStage.get('interviewDate');
    const startTime = this.updateCandidateStage.get('startTime');
    const endTime = this.updateCandidateStage.get('endTime');
    const interviewMode = this.updateCandidateStage.get('interviewMode');
    const videoInterview = this.updateCandidateStage.get('videoInterview');
    const interviewAddress = this.updateCandidateStage.get('interviewAddress');
    const interviewerName = this.updateCandidateStage.get('interviewerName');
    const interviewerEmail = this.updateCandidateStage.get('interviewerEmail');
    const selectedActualInterviewDate = this.updateCandidateStage.get('selectedActualInterviewDate');

    const actualInterviewDate = this.updateCandidateStage.get('actualInterviewDate');
    const rejectReason = this.updateCandidateStage.get('rejectReason');

    const actualInterviewHoldDate = this.updateCandidateStage.get('actualInterviewHoldDate');
    const rejectHoldReason = this.updateCandidateStage.get('rejectHoldReason');

    const offerDate = this.updateCandidateStage.get('offerDate');
    const tentativeJoiningDate = this.updateCandidateStage.get('tentativeJoiningDate');
    const workLocation = this.updateCandidateStage.get('workLocation');
    const offeredCTC = this.updateCandidateStage.get('offeredCTC');
    const offeredPerks = this.updateCandidateStage.get('offeredPerks');

    const documentsNotSubmitted = this.updateCandidateStage.get('documentsNotSubmitted');
    const offerRejected = this.updateCandidateStage.get('offerRejected');
    const offerHold = this.updateCandidateStage.get('offerHold');


    const dateofJoining = this.updateCandidateStage.get('dateofJoining');
    const workHirelocation =	this.updateCandidateStage.get('workHirelocation');								
		const employeeCode =	this.updateCandidateStage.get('employeeCode');				
		const designation = this.updateCandidateStage.get('designation');

    const dateofleaving = this.updateCandidateStage.get('dateofleaving');
    const rasonforLeaving = this.updateCandidateStage.get('rasonforLeaving');


    if(this.candidateParentStageSelected == "screening.rejected"){
      screeningRejectReason?.setValidators([Validators.required]);
    }else{
      screeningRejectReason?.clearValidators();
    }
    screeningRejectReason?.updateValueAndValidity();

    if(this.candidateParentStageSelected == "screening.hold"){
      screeningHoldReason?.setValidators([Validators.required]);
    }else{
      screeningHoldReason?.clearValidators();
    }
    screeningHoldReason?.updateValueAndValidity();

    if(this.candidateParentStageSelected == "interview.candidatesScheduled"){
      interviewDate?.setValidators([Validators.required]);
      // startTime?.setValidators([Validators.required]);
      // endTime?.setValidators([Validators.required]);
      interviewMode?.setValidators([Validators.required]);
      interviewerName?.setValidators([this.customValidator.alphabetValidator()]);
      interviewerEmail?.setValidators([this.customValidator.emailValidator()]);
    }else{
      interviewDate?.clearValidators();
      // startTime?.clearValidators();
      // endTime?.clearValidators();
      interviewMode?.clearValidators();
      interviewerName?.clearValidators();
      interviewerEmail?.clearValidators();
    }

    interviewDate?.updateValueAndValidity();
    // startTime?.updateValueAndValidity();
    // endTime?.updateValueAndValidity();
    interviewMode?.updateValueAndValidity();
    interviewerName?.updateValueAndValidity();
    interviewerEmail?.updateValueAndValidity();


    if(this.candidateParentStageSelected == "interview.interviewSelected"){
      selectedActualInterviewDate?.setValidators([Validators.required]);
    }else{
      selectedActualInterviewDate?.clearValidators();
    }
    selectedActualInterviewDate?.updateValueAndValidity();


    
    if(this.candidateParentStageSelected == "interview.interviewRejected"){
      actualInterviewDate?.setValidators([Validators.required]);
      rejectReason?.setValidators([Validators.required]);
    }else{
      actualInterviewDate?.clearValidators();
      rejectReason?.clearValidators();
    }
    actualInterviewDate?.updateValueAndValidity();
    rejectReason?.updateValueAndValidity();


    if(this.candidateParentStageSelected == "interview.interviewHold"){
      actualInterviewHoldDate?.setValidators([Validators.required]);
      rejectHoldReason?.setValidators([Validators.required]);
    }else{
      actualInterviewHoldDate?.clearValidators();
      rejectHoldReason?.clearValidators();
    }
    actualInterviewHoldDate?.updateValueAndValidity();
    rejectHoldReason?.updateValueAndValidity();


    if(this.candidateParentStageSelected == "offer.offerReleased"){
      offerDate?.setValidators([Validators.required]);
      tentativeJoiningDate?.setValidators([Validators.required]);
      workLocation?.setValidators([Validators.required,this.customValidator.alphaNumaricValidator()]);
      offeredCTC?.setValidators([Validators.required,this.customValidator.alphaNumaricValidator()]);
      offeredPerks?.setValidators([Validators.required,this.customValidator.alphaNumaricValidator()]);
    }else{
      offerDate?.clearValidators();
      tentativeJoiningDate?.clearValidators();
      workLocation?.clearValidators();
      offeredCTC?.clearValidators();
      offeredPerks?.clearValidators();
    }
    offerDate?.updateValueAndValidity();
    tentativeJoiningDate?.updateValueAndValidity();
    workLocation?.updateValueAndValidity();
    offeredCTC?.updateValueAndValidity();
    offeredPerks?.updateValueAndValidity();


    if(this.candidateParentStageSelected == "offer.documentsNotSubmitted"){
      documentsNotSubmitted?.setValidators([Validators.required]);
    }else{
      documentsNotSubmitted?.clearValidators();
    }
    documentsNotSubmitted?.updateValueAndValidity();

    if(this.candidateParentStageSelected == "offer.offerRejected"){
      offerRejected?.setValidators([Validators.required]);
    }else{
      offerRejected?.clearValidators();
    }
    offerRejected?.updateValueAndValidity();

    if(this.candidateParentStageSelected == "offer.offerHold"){
      offerHold?.setValidators([Validators.required]);
    }else{
      offerHold?.clearValidators();
    }
    offerHold?.updateValueAndValidity();

    if(this.candidateParentStageSelected == "hire.joinedYet"){
      dateofJoining?.setValidators([Validators.required]);
      workHirelocation?.setValidators([Validators.required,this.customValidator.alphaSpaceValidator()]);
      employeeCode?.setValidators([Validators.required,this.customValidator.alphaNumaricValidator()]);
      designation?.setValidators([Validators.required,Validators.maxLength(150),this.customValidator.alphaSpaceValidator()]);

    }else{
      dateofJoining?.clearValidators();
      workHirelocation?.clearValidators();
      employeeCode?.clearValidators();
      designation?.clearValidators();
    }
      dateofJoining?.updateValueAndValidity();
      workHirelocation?.updateValueAndValidity();
      employeeCode?.updateValueAndValidity();
      designation?.updateValueAndValidity();

    if(this.candidateParentStageSelected== "hire.joinedLeft"){
      dateofleaving?.setValidators([Validators.required]);
      rasonforLeaving?.setValidators([Validators.required]);
    }else{
      dateofleaving?.clearValidators();
      rasonforLeaving?.clearValidators();
    }
      dateofleaving?.updateValueAndValidity();
      rasonforLeaving?.updateValueAndValidity();
  }


  showDialog(parentStage: string, stage: string,childStage: any) {
    this.visible = true;
    this.selectedStage = stage;
    this.thechildstage = childStage;
    this.selectedParentStage = parentStage;
    this.updateCandidateStage.patchValue({
      stage: '',
      comment: '',
      screeningRejectReason: '',
      screeningHoldReason: '',
      interviewDate: '',
      startTime: '',
      endTime: '',
      interviewMode: '',
      videoInterview: '',
      interviewAddress: '',
      interviewerName: '',
      interviewerEmail: '',
      actualInterviewDate: '',
      rejectReason: '',
      actualInterviewHoldDate: '',
      rejectHoldReason: '',
      selectedActualInterviewDate: '',
      offerDate: '',
      tentativeJoiningDate: '',
      workLocation: '',
      offeredCTC: '',
      offeredPerks: '',
      documentsNotSubmitted: '',
      offerRejected: '',
      offerHold: '',
      dateofJoining: '',	
      workHirelocation: '',													
      employeeCode: '',												
      designation: '',
      dateofleaving: '',
      rasonforLeaving: ''
    })
  }

  updateCandidateStage = this.fb.group({
    stage: ['', Validators.required],
    comment: ['',[Validators.required,Validators.maxLength(500)]],
    screeningRejectReason: [''],
    screeningHoldReason:[''],
    interviewDate: [''],
    startTime: [''],
    endTime: [''],
    interviewMode: [''],
    videoInterview: [''],
    interviewAddress: [''],
    interviewerName: [''],
    interviewerEmail: [''],
    actualInterviewDate: [''],
    rejectReason: [''],
    actualInterviewHoldDate: [''],
    rejectHoldReason: [''],
    selectedActualInterviewDate: [''],
    offerDate: [''],
    tentativeJoiningDate: [''],
    workLocation: [''],
    offeredCTC: [''],
    offeredPerks: [''],
    documentsNotSubmitted: [''],
    offerRejected: [''],
    offerHold: [''],
    dateofJoining: [''],	
    workHirelocation: [''],													
		employeeCode: [''],												
		designation: [''],
    dateofleaving: [''],
    rasonforLeaving: ['']
  })



  async updateStage() {
    this.isFormSubmited = true;
    const stagedata = {
      "candidate_id_list": [
        {
          "candidate_id": this.candidateData?._id,
          "indent_id": this.indentId,
          "stage": [
            {
              "field": this.updateCandidateStage.controls.stage.value,
              "displayName": this.stageDisplayName,
              "status": true,
              "created_by": this.loginUserName,
              "created_id": this.loginUserId,
              "comment": this.updateCandidateStage.controls.comment.value,
              "screeningRejectReason": this.updateCandidateStage.controls.screeningRejectReason.value,
              "screeningHoldReason": this.updateCandidateStage.controls.screeningHoldReason.value,
              "interviewDate": this.updateCandidateStage.controls.interviewDate.value,
              "startTime": this.updateCandidateStage.controls.startTime.value,
              "endTime": this.updateCandidateStage.controls.endTime.value,
              "interviewMode": this.updateCandidateStage.controls.interviewMode.value,
              "videoInterview": this.updateCandidateStage.controls.videoInterview.value,
              "interviewAddress": this.updateCandidateStage.controls.interviewAddress.value,
              "interviewerName": this.updateCandidateStage.controls.interviewerName.value,
              "interviewerEmail": this.updateCandidateStage.controls.interviewerEmail.value,
              "actualInterviewDate": this.updateCandidateStage.controls.actualInterviewDate.value,
              "rejectReason": this.updateCandidateStage.controls.rejectReason.value,
              "actualInterviewHoldDate": this.updateCandidateStage.controls.actualInterviewHoldDate.value,
              "rejectHoldReason": this.updateCandidateStage.controls.rejectHoldReason.value,
              "selectedActualInterviewDate": this.updateCandidateStage.controls.selectedActualInterviewDate.value,
              "offerDate": this.updateCandidateStage.controls.offerDate.value,
              "tentativeJoiningDate": this.updateCandidateStage.controls.tentativeJoiningDate.value,
              "workLocation": this.updateCandidateStage.controls.workLocation.value,
              "offeredCTC": this.updateCandidateStage.controls.offeredCTC.value,
              "offeredPerks": this.updateCandidateStage.controls.offeredPerks.value,
              "documentsNotSubmitted": this.updateCandidateStage.controls.documentsNotSubmitted.value,
              "offerRejected": this.updateCandidateStage.controls.offerRejected.value,
              "offerHold": this.updateCandidateStage.controls.offerHold.value,
              "dateofJoining": this.updateCandidateStage.controls.dateofJoining.value,
              "workHirelocation": this.updateCandidateStage.controls.workHirelocation.value,										
              "employeeCode": this.updateCandidateStage.controls.employeeCode.value,					
              "designation": this.updateCandidateStage.controls.designation.value,
              "dateofleaving": this.updateCandidateStage.controls.dateofleaving.value,
              "rasonforLeaving": this.updateCandidateStage.controls.rasonforLeaving.value,
            }
          ]
        }
      ]
    };

    this.authToken = localStorage.getItem('access_token');

    if (this.updateCandidateStage.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATECANDIDATESTAGE}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      //this.isLoading = true;
      this.http.put<any>(url, stagedata, { headers })
        .subscribe(
          response => {
            //this.isLoading = false;
            if (response.status === 1) {
              this.loader = false;
              this.getSingleCandidate(this.authToken, this.candidateId, this.indentId);
              this.updateCandidateStage.reset();
              this.visible = false;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.loader = false;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.loader = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the candidate stage.' });
          }
        );
    } else {
      //this.isLoading = false;
      this.loader = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  downloadPDF(pdfUrl:any, name: any) {
    const pdfName = name+'.pdf'; // Desired name for the downloaded PDF

    // Get the PDF as a Blob
    this.http.get(this.apiURL+pdfUrl, { responseType: 'blob' }).subscribe(blob => {
      // Create a link element
      const link = document.createElement('a');
      
      // Create a URL for the blob object
      const url = window.URL.createObjectURL(blob);
      
      // Set the href attribute to the blob URL and download attribute to the PDF name
      link.href = url;
      link.download = pdfName;

      // Programmatically trigger the click event
      link.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    });
  }


}
