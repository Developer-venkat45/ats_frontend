import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModel, JobDetailsResponse, JobDetailsResponse3, Recoom_candidate } from '../../core/model/model';
import { TooltipModule } from 'primeng/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DatePipe} from '@angular/common';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-applied-details',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, TooltipModule, NgxSkeletonLoaderModule, DatePipe, CommonModule, FormsModule, DialogModule, ToastModule, RouterModule],
  templateUrl: './applied-details.component.html',
  styleUrl: './applied-details.component.css'
})
export class AppliedDetailsComponent {


  indentService = inject(DashboardService);
  indentData: any | null = null;
  isLoggedIn:boolean = false;
  loader: boolean = true;
  loginUserId: any;
  eandIsubmitButton: boolean = true;
  enadiAnswerData: any;
  candidateAssessmentScoreData: any | null = null;
  submitButton: boolean = true;
  authToken: any = null;
  baseAPIURL:any;
  currentStatus: any;
  userType:any;
  candidateData : any | null = null;
  indentStaged: any;
  maxScore = 10;
  myProfileData: any;
  eandiId: any ="";
  candidateId: any ="";
  assessmentList: any;
  assessmentData: any;
  assessmentId: any ="";
  sanitizedContent: SafeHtml = '';
  sanitizedContent2: SafeHtml = '';
  sanitizedContent3: SafeHtml = '';
  indentId: any;

  constructor(private route: ActivatedRoute, private messageService: MessageService, private sanitizer: DomSanitizer) { 
    this.loginUserId = localStorage.getItem('id');
    this.baseAPIURL= environment.apiURL;
  }

  ngOnInit(): void {
    this.indentId = this.route.snapshot.paramMap.get('id')!;
    const authToken:any = localStorage.getItem('access_token');
    this.authToken = localStorage.getItem('access_token');
    this.getUserCandidateData(this.authToken,this.loginUserId);
    

    const localData: any = localStorage.getItem('access_token');
    if (localData !== null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    this.userType = localStorage.getItem('user');
    const user: any = localStorage.getItem('user');

    
  }
  getUserCandidateData(authToken: string, id: string): void {
    this.indentService.getUserCandidateData(authToken, id).subscribe(
      (res: any) => {
        this.myProfileData = res.result;
        this.candidateId = this.myProfileData?._id;
        this.getSingleCandidate(this.candidateData, this.myProfileData?._id, this.indentId);
      },
      error => {
        // Handle error
      }
    );
  }

  
  getSingleCandidate(authToken: string, candidateId: string, indentId: string): void {
    this.indentService.getSingleCandidate(authToken, candidateId, indentId).subscribe(
      (res: any) => {
        this.candidateData = res.result[0];
        this.eandiId = this.candidateData?.indent?.indentStep4?.eandiId;
        this.assessmentId = this.candidateData?.indent?.indentStep6?.assessmentId;

        this.indentStaged = this.convertObjectToArray(this.candidateData?.stagelog);
        this.getCandidateEandi(authToken, this.indentId, this.eandiId, this.candidateId);

        if(this.assessmentId != ''){
        this.getCandidateAssessment(authToken, this.indentId, this.assessmentId, this.candidateId);
        this.getAllAssessment(this.authToken,this.assessmentId,'','');
        }
        this.loader = false;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.candidateData?.indent?.indentStep2?.clientDescription);
        this.sanitizedContent2 = this.sanitizer.bypassSecurityTrustHtml(this.candidateData?.indent?.indentStep2?.jobDescription);
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


  getAllAssessment(authToken:string,id:string,title:string,category:string): void {
    this.indentService.getAllAssessment(authToken,id,title,category).subscribe(
      (res: any) => {
        this.assessmentData = res.result[0];
      },
      error => {
        // Handle error
      }
    );
  }


  getCandidateAssessment(authToken: string, indentId: string, eandiId: string, candidateId: string): void {
    this.indentService.getCandidateAssessment(authToken, indentId, eandiId, candidateId).subscribe(
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



  getScorePercentage(score: number | undefined): string {
    if (score !== undefined && score !== null) {
      return ((score / this.maxScore) * 100).toFixed(2) + '%';
    } else {
      return 'N/A';
    }
  }






}
