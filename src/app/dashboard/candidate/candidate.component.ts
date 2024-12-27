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
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [NavbarComponent, FormsModule, TooltipModule, TreeSelectModule, NgxSkeletonLoaderModule, CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, RouterModule, ToastModule, CalendarModule, OverlayPanelModule],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css'
})
export class CandidateComponent {
  indentService = inject(DashboardService);
  recommData: any;
  maxScore = 10;
  indentId: any = null;
  limit: any = 10;
  skip: number = 0;
  totalRecord: any;
  authToken: any = null;
  searchName: string = '';
  searchMobile: string = '';
  searchEducation: string = '';
  searchRagTag:string ='';
  searchUploadedLocation:string ='';
  searchUploadedStage:string ='';
  searchUploadedSubStage:string ='';
  searchSource:string ='';
  canStage:any = '';
  canSubStage:any = '';
  selectedNodes: any;
  loader: boolean = true;
  loaderCount: number = 10;
  showChangeBtn: boolean = false;
  selectedCanId: any[] = [];
  indentStaging: any;
  indentStaging2: any;
  apiMessage4:any="";

  filterdRecord:number = 0;
  fetchedRecord:number = 0;
  startIndex2:number = 1;
  endIndex2:number = 10;
  currentPage:number = 1;
  itemsPerPage:number = 10;
  totalPages:number = 0;
  startIndex:number = 0;
  endIndex:number = 10;
  isDisabled: string='';
  isDisabled2: string='';

  isFormSubmited: boolean = false;
  overallFormValid4: string = "";
  selectedStage:any;
  visible: boolean = false;
  visible2: boolean = false;
  isLoading: boolean = false;
  indentStaged: any;
  currentStage: any[] = [];
  currentParentStage: any[] = [];
  selectedCurrentStage: any;
  selectedCurrentParentStage: any;
  selectedCandidateId: any;
  loginUserName:any;
  loginUserId:any;
  upcomingCurrentStage: any[] = [];
  upcomingCurrentParentStage: any[] = [];
  isShown: boolean = true;
  ragTagColor: any;
  partnerId: any = '';
  thecurrentStage:any;
  thechildstage:any;

  fb = inject(FormBuilder);
  candidateParentStageSelected: any;
  candidateParentStageSelected1: any;
  candidateParentStageSelected2: any;
  selectMode: boolean = false;
  selectMode2: boolean = false;
  minDate:Date = new Date();
  countData:any; 
  locationCount: any = [];
  indentData: any | null = null;
  stageKey:number = -1;

  
  private customValidator= new CustomValidatorComponent();

  constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today;
    this.authToken = localStorage.getItem('access_token');
    this.indentId = this.route.snapshot.queryParamMap.get('indentId');
    this.limit = this.route.snapshot.queryParamMap.get('limit');
    this.canStage = this.route.snapshot.queryParamMap.get('stage');
    this.canSubStage = this.route.snapshot.queryParamMap.get('substage');
    if(this.canSubStage == null){
      this.canSubStage = '';
    }
    if(this.canStage == null){
      this.canStage = '';
    }
    if(this.canSubStage !='' && this.canSubStage != null){
      this.searchUploadedSubStage = this.canSubStage;
    }
    
    if(this.canStage !='' && this.canStage != null){
    this.searchUploadedStage = this.canStage;

    if(this.canStage == "screening"){
      this.stageKey = 0;
    }
    if(this.canStage == "interview"){
      this.stageKey = 1;
    }
    if(this.canStage == "offer"){
      this.stageKey = 2;
    }
    if(this.canStage == "hire"){
      this.stageKey = 3;
    }
  }

    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    const user: any = localStorage.getItem('user');
    if(user == 'Partner SPOC - Recruiter' || user == 'Partner SPOC - Manager' || user == 'Partner Manager'){
      this.isShown = false;
      this.partnerId = localStorage.getItem('partner_id');
      this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    }else{
      if(this.indentId){
        this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
      }else{
        this.getAllCandidates(this.authToken,'',''); 
      }
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
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

    this.getSingleIndent(this.authToken, this.indentId);
  }

  onNodeSelect(event: any){
    console.log('Selected Node:', event.node);
    // alert('Selected Node: ' + event.node.label);
  }

  getAllCandidate(authToken: string, indentId: string, limit: string, name: string, mobile: string, education: string, canStage: string, ragTag: string, partnerId: string, location: string,skip: number, canSubstage: string, canSource: string): void {
    this.indentService.getAllCandidate(authToken, indentId, limit, name, mobile, education, canStage, ragTag, partnerId, location,skip, canSubstage, canSource).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.recommData = res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
          this.loader = false;
          
          this.indentStaging = this.convertStageingToArray2(this.recommData?.indentStep5);

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
          this.loader = false;
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


  getAllCandidateCount(authToken: string, indentId: string, partnerId: string, location: string, stage: string, child_stage_filter: string, source: string): void {
    this.indentService.getAllCandidateCount(authToken, indentId, partnerId, location, stage, child_stage_filter, source).subscribe(
      (res: any) => {
        this.countData = res.data;

        this.locationCount = Object.entries(this.countData.location_count).map(([location, count]) => {
          return { location, count };
        }).sort((a, b) => a.location.localeCompare(b.location));
        //console.log(this.locationCount);
      },
      error => {
        // Handle error
      }
    );
  }


  getSingleIndent(authToken: string, indentId: string): void {
    this.indentService.getSingleIndent(authToken, indentId).subscribe(
      (res: any) => {
        this.indentData = res.result[0];
        this.indentStaging2 = this.convertStageingToArray2(this.indentData?.indentStep5);
        //console.log(this.indentStaging2);
      },
      error => {
        // Handle error
      }
    );
  }

  getAllCandidates(authToken: string, name: string, mobile: string): void {
    this.indentService.getAllCandidates(authToken, name, mobile).subscribe(
      (res: any) => {
        if(res.status == 1){
          this.recommData = res.result;
          this.totalRecord = res.total_record;
          this.loader = false;
        }else{
          this.recommData = [];
          this.totalRecord = 0;
          this.loader = false;
        }
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


  onStageChange(event: Event): void {
    const limit = (event.target as HTMLSelectElement).value;
    this.askConfirmation();
  }



  askConfirmation(){
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


  getScorePercentage(score: number | undefined): string {
    if (score !== undefined && score !== null) {
      return ((score / this.maxScore) * 100).toFixed(2) + '%';
    } else {
      return 'N/A';
    }
  }

  searchCanName(): void {
    this.searchName = this.searchName;
    // if(this.indentId){
    //   this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    // }else{
    //   this.getAllCandidates(this.authToken, this.searchName, this.searchMobile); 
    // }
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation, this.skip, this.searchUploadedSubStage, this.searchSource);

    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  searchCanMobile(): void {
    this.searchMobile = this.searchMobile;
    // if(this.indentId){
    //   this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    // }else{
    //   this.getAllCandidates(this.authToken, this.searchName, this.searchMobile); 
    // }
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation, this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  searchCanEducation(): void {
    this.searchEducation = this.searchEducation;
    // if(this.indentId){
    //   this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    // }else{
    //   this.getAllCandidates(this.authToken, this.searchName, this.searchMobile); 
    // }
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation, this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  searchCanRagTag(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchRagTag = selectedValue;
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  searchCanLocation(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchUploadedLocation = selectedValue;
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  searchCanLocation2(location:any): void{
    this.searchUploadedLocation = location;
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);
  }


  searchCanStage(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.canStage = selectedValue;
    this.searchUploadedStage = selectedValue;
    if(this.canStage == "screening"){
      this.stageKey = 0;
    }
    if(this.canStage == "interview"){
      this.stageKey = 1;
    }
    if(this.canStage == "offer"){
      this.stageKey = 2;
    }
    if(this.canStage == "hire"){
      this.stageKey = 3;
    }


    // if (this.searchName){
    //   if (!this.indentId) {
    //     this.getAllCandidates(this.authToken, this.searchName, this.searchMobile);
    //   }
    // }

    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  searchCanSubStage(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchUploadedSubStage = selectedValue;
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  searchCanSubStage2(stage:any, substage: any): void{

    if(stage == "screening"){
      this.stageKey = 0;
    }
    if(stage == "interview"){
      this.stageKey = 1;
    }
    if(stage == "offer"){
      this.stageKey = 2;
    }
    if(stage == "hire"){
      this.stageKey = 3;
    }

    this.canStage = stage;
    this.searchUploadedStage = stage;
    this.searchUploadedSubStage = substage;
    
    console.log(this.canStage);

    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);

  }

  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }




  updateCanStage(candidateId: string, currentStage:any, childStage:any){
    this.visible = true;
    // this.selectedCurrentStage = stage;
    // this.selectedCurrentParentStage = parentStage;
    this.selectedCandidateId = candidateId;
    this.thecurrentStage = currentStage;
    this.thechildstage = childStage;
  }


  searchCanSource(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchSource = selectedValue;
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage,this.searchSource);
  }

  onSearchSubmit():void{
    if (this.searchName || this.searchMobile || this.searchEducation || this.searchRagTag || this.searchUploadedLocation || this.canStage || this.searchUploadedStage || this.searchUploadedSubStage || this.searchSource){
      if (this.canStage){
        if (this.canStage == "screening") {
          this.stageKey = 0;
        }
        if (this.canStage == "interview") {
          this.stageKey = 1;
        }
        if (this.canStage == "offer") {
          this.stageKey = 2;
        }
        if (this.canStage == "hire") {
          this.stageKey = 3;
        }
      }
      this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation, this.skip, this.searchUploadedSubStage, this.searchSource);
      this.getAllCandidateCount(this.authToken, this.indentId, this.partnerId, this.searchUploadedLocation, this.canStage, this.searchUploadedSubStage, this.searchSource);
    }else{
      this.searchName = '';
      this.searchMobile  = '';
      this.searchEducation = '';
      this.searchRagTag = '';
      this.searchUploadedLocation = '';
      this.canStage = '';
      this.searchUploadedStage = '';
      this.searchUploadedSubStage = '';
      this.searchSource = '';

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

  updateCandidateStage = this.fb.group({
    stage: ['',Validators.required],
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
    const stagedata = {
      candidate_id_list: [
        {
          candidate_id: this.selectedCandidateId,
          indent_id: this.indentId,
          stage: [
            {
              field: this.updateCandidateStage.controls.stage.value,
              displayName: this.stageDisplayName,
              status: true,
              created_by: this.loginUserName,
              created_id: this.loginUserId,
              comment: this.updateCandidateStage.controls.comment.value,
              screeningRejectReason: this.updateCandidateStage.controls.screeningRejectReason.value,
              screeningHoldReason: this.updateCandidateStage.controls.screeningHoldReason.value,
              interviewDate: this.updateCandidateStage.controls.interviewDate.value,
              startTime: this.updateCandidateStage.controls.startTime.value,
              endTime: this.updateCandidateStage.controls.endTime.value,
              interviewMode: this.updateCandidateStage.controls.interviewMode.value,
              videoInterview: this.updateCandidateStage.controls.videoInterview.value,
              interviewAddress: this.updateCandidateStage.controls.interviewAddress.value,
              interviewerName: this.updateCandidateStage.controls.interviewerName.value,
              interviewerEmail: this.updateCandidateStage.controls.interviewerEmail.value,
              actualInterviewDate: this.updateCandidateStage.controls.actualInterviewDate.value,
              rejectReason: this.updateCandidateStage.controls.rejectReason.value,
              actualInterviewHoldDate: this.updateCandidateStage.controls.actualInterviewHoldDate.value,
              rejectHoldReason: this.updateCandidateStage.controls.rejectHoldReason.value,
              selectedActualInterviewDate: this.updateCandidateStage.controls.selectedActualInterviewDate.value,
              offerDate: this.updateCandidateStage.controls.offerDate.value,
              tentativeJoiningDate: this.updateCandidateStage.controls.tentativeJoiningDate.value,
              workLocation: this.updateCandidateStage.controls.workLocation.value,
              offeredCTC: this.updateCandidateStage.controls.offeredCTC.value,
              offeredPerks: this.updateCandidateStage.controls.offeredPerks.value,
              documentsNotSubmitted: this.updateCandidateStage.controls.documentsNotSubmitted.value,
              offerRejected: this.updateCandidateStage.controls.offerRejected.value,
              offerHold: this.updateCandidateStage.controls.offerHold.value,
              dateofJoining: this.updateCandidateStage.controls.dateofJoining.value,
              workHirelocation: this.updateCandidateStage.controls.workHirelocation.value,										
              employeeCode: this.updateCandidateStage.controls.employeeCode.value,					
              designation: this.updateCandidateStage.controls.designation.value,
              dateofleaving: this.updateCandidateStage.controls.dateofleaving.value,
              rasonforLeaving: this.updateCandidateStage.controls.rasonforLeaving.value,
            }
          ]
        }
      ]
    };

    this.isFormSubmited = true;
    this.isLoading = true;
    this.authToken = localStorage.getItem('access_token');

    if (this.updateCandidateStage.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATECANDIDATESTAGE}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, stagedata, { headers })
        .subscribe(
          response => {
            this.isLoading = false;
            if (response.status === 1) {
              this.updateCandidateStage.reset();
              this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the candidate stage.' });
          }
        );
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }



  updateCanStage2(){
    this.visible2 = true;
  }
  

  checkedCount = 0;
  onCanChecked(canId: string, event: Event): void{
    const checked = (event.target as HTMLInputElement).checked;
    if(checked){
      this.checkedCount++;
      this.selectedCanId.push(canId);
    }else{
      this.checkedCount--;
      this.selectedCanId = this.selectedCanId.filter(id => id !== canId);
    }
    this.showChangeBtn = this.checkedCount > 0;

  }


  filteredCandidates: any;
  multipleCurrentCandidateId: any[] = [];
  candidate_id_list: any[] = [];
  candidateId: any[] = [];



  updateMultiCanStage() {
    this.candidate_id_list = this.selectedCanId.map(canId => ({
      candidate_id: canId,
      indent_id: this.indentId,
      stage: [{
        field: this.updateCandidateStage.controls.stage.value,
        displayName: this.stageDisplayName,
        status: true,
        created_by: this.loginUserName,
        created_id: this.loginUserId,
        comment: this.updateCandidateStage.controls.comment.value
      }]
    }));

    this.isFormSubmited = true;
    this.isLoading = true;
    const stagedata = { candidate_id_list: this.candidate_id_list };
    this.authToken = localStorage.getItem('access_token');

    if (this.updateCandidateStage.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATECANDIDATESTAGE}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, stagedata, { headers })
        .subscribe(
          response => {
            this.isLoading = false;
            if (response.status === 1) {
              this.updateCandidateStage.reset();
              this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating candidate stages.' });
          }
        );
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  resetFilter(){
    this.searchName = '';
    this.searchMobile = '';
    if(this.indentId){
      this.getAllCandidate(this.authToken, this.indentId, this.limit, '', '', '', this.canStage, '', this.partnerId, this.searchUploadedLocation,this.skip, this.searchUploadedSubStage, this.searchSource);
    }else{
      this.getAllCandidates(this.authToken, '', ''); 
    }
  }
  onSelectChange(event :Event):void{
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage; // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;
    this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,0, this.searchUploadedSubStage, this.searchSource);
    
  }
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecord) {
        this.currentPage++;

        // Calculate startIndex2 and endIndex2 based on the current page and itemsPerPage
        this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.currentPage * this.itemsPerPage;

        // Ensure endIndex2 doesn't exceed the total records
        
        if(this.filterdRecord>0) {
          this.totalRecord=this.filterdRecord
        }
        if (this.endIndex2 > this.totalRecord) {
            this.endIndex2 = this.totalRecord;
        }
        
    
        this.endIndex = this.startIndex + this.itemsPerPage;
        this.endIndex = this.endIndex-10;
        
        // Fetch the new set of partners based on pagination
        this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.endIndex, this.searchUploadedSubStage, this.searchSource);

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
        this.endIndex = this.endIndex-10;
        // Fetch the previous set of partners based on pagination
        this.getAllCandidate(this.authToken, this.indentId, this.limit, this.searchName, this.searchMobile, this.searchEducation, this.canStage, this.searchRagTag, this.partnerId, this.searchUploadedLocation,this.endIndex, this.searchUploadedSubStage, this.searchSource);

        // Enable/disable pagination buttons
        this.isDisabled = this.currentPage > 1 ? "" : "disabled";
        this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }
  
  
}
