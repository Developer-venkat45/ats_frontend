import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { constant } from '../core/constant/constant';
import { DashboardService } from '../core/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray,FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-assessment-test',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,ToastModule],
  templateUrl: './assessment-test.component.html',
  styleUrl: './assessment-test.component.css'
})
export class AssessmentTestComponent implements OnInit{
  clientService = inject(DashboardService);
  apiMessage:any="";
  authToken:any="";
  selectedEandi: any;
  assessmentId: any ="";
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
  totalScore: number = 0;
  selectedScore: any [] = [];
  totalScorePercent: number = 0;
  ragTag: any;
  roleId: number = 0;
  isLoading: boolean = false;

  
  fb = inject(FormBuilder);

  constructor(private route: ActivatedRoute, private messageService: MessageService, private http: HttpClient) { }

  

  ngOnInit(): void {
    this.assessmentId = this.route.snapshot.paramMap.get('assesmentid')!;
    this.indentId = this.route.snapshot.paramMap.get('indentid')!;
    this.candidateId = this.route.snapshot.paramMap.get('candidateid')!;
    this.authToken = localStorage.getItem('access_token');
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    this.getAllAssessment(this.authToken,this.assessmentId,'','');
    this.checkAssessment(this.authToken, this.indentId, this.assessmentId, this.candidateId);
    this.getSingleIndent(this.authToken, this.indentId);

    const user: any = localStorage.getItem('user');
    if (user == 'Candidate'){
      this.roleId = 9;
    }
  }


  getSingleIndent(authToken: string, indentId: string): void {
    this.clientService.getSingleIndent(authToken, indentId).subscribe(
      (res: any) => {
        this.indentData = res.result[0];
      },
      error => {
        // Handle error
      }
    );
  }

  getAllAssessment(authToken:string,id:string,title:string,category:string): void {
    this.clientService.getAllAssessment(authToken,id,title,category).subscribe(
      (res: any) => {
        this.selectedEandi = res.result[0];
        this.selectedEandi.questions.forEach((questionData: any) => {
          this.questions.push(this.createQuestion(questionData));
        });
      },
      error => {
        // Handle error
      }
    );
  }

  checkAssessment(authToken: string, indentId: string, assessmentId: string, candidateId: string): void {
    this.clientService.checkAssessment(authToken, indentId, assessmentId, candidateId).subscribe(
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


  enaditest = this.fb.group({
    assessmentId: [''],
    candidateId: [''],
    indentId: [''],
    createdName: [''],
    created_by: [''],
    answers: this.fb.array([]),
    scorePercentage: 0,
    ragTag: [''],
    role_id: [0],
  });

  get questions(): FormArray {
    return this.enaditest.get('answers') as FormArray;
  }

  createQuestion(questionData: any): FormGroup {
    return this.fb.group({
      question: [questionData.question, Validators.required],
      answer: ['', Validators.required],
      options: this.fb.array(questionData.options.map((option: any) => this.createOption(option)))
    });
  }

  createOption(optionData: any): FormGroup {
    return this.fb.group({
      option: [optionData.option],
      score: [optionData.score]
    });
  }
  

  calculateScore(questionIndex: number, score: any): void {
    if (this.selectedScore[questionIndex] !== undefined) {
      this.totalScore -= Number(this.selectedScore[questionIndex]);
    }
    this.selectedScore[questionIndex] = score;
    this.totalScore += Number(score);
    this.totalScorePercent = Math.round((this.totalScore / 100) * 100);

    if (this.totalScore >= this.indentData?.indentStep4?.criteria?.greenMinScore && this.totalScore < this.indentData?.indentStep4?.criteria?.greenMaxScore) {
      this.ragTag = 'green';
    } else if (this.totalScore >= this.indentData?.indentStep4?.criteria?.amberMinScore && this.totalScore < this.indentData?.indentStep4?.criteria?.amberMaxScore) {
      this.ragTag = 'amber';
    } else if (this.totalScore >= this.indentData?.indentStep4?.criteria?.redMinScore && this.totalScore < this.indentData?.indentStep4?.criteria?.redMaxScore) {
      this.ragTag = 'red';
    } else {
      this.ragTag = 'unknown';
    }
  }


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


  // async submitAssessment(){
  //   this.isLoading = true;
  //   this.isFormSubmited3 = true;
  //   const data = this.enaditest.value;
  //   data.scorePercentage = this.totalScorePercent;
  //   data.ragTag = this.ragTag;
  //   data.assessmentId =  this.assessmentId;
  //   data.candidateId = this.candidateId;
  //   data.indentId = this.indentId;
  //   data.createdName= this.loginUserName;
  //   data.created_by= this.loginUserId;
  //   data.role_id = this.roleId;
  //   this.authToken = localStorage.getItem('access_token');

  //   if(this.enaditest.valid){
  //     this.InsertData(environment.apiURL+constant.apiEndPoint.ASSESSMENTTEST, data, this.authToken)
  //     .then(data => {
  //       if(data.status == 1){
  //         this.apiMessage3 = data.message;
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
  //         this.submitButton = false;
  //         this.isLoading = false;
  //       }else{
  //         this.apiMessage3 = data.message;
  //         this.isLoading = false;
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  //     this.overallFormValid3 = '';
  //   }else{
  //     this.overallFormValid3 = "Please fill the form correctly";
  //     this.isLoading = false;
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
  //   }
  // }


  async submitAssessment() {
    this.isLoading = true;
    this.isFormSubmited3 = true;

    const data = this.enaditest.value;
    data.scorePercentage = this.totalScorePercent;
    data.ragTag = this.ragTag;
    data.assessmentId = this.assessmentId;
    data.candidateId = this.candidateId;
    data.indentId = this.indentId;
    data.createdName = this.loginUserName;
    data.created_by = this.loginUserId;
    data.role_id = this.roleId;

    this.authToken = localStorage.getItem('access_token');

    if (this.enaditest.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.ASSESSMENTTEST}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isLoading = false; // Stop loading
            if (response.status === 1) {
              this.apiMessage3 = response.message;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.submitButton = false;
            } else {
              this.apiMessage3 = response.message;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isLoading = false; // Stop loading
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while submitting the assessment.' });
          }
        );
    } else {
      this.isLoading = false; // Stop loading
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }
}
