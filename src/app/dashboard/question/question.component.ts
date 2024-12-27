import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, APIResponseModel, Assessment } from '../../core/model/model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent, ToastModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent implements OnInit{
  fb = inject(FormBuilder);
  indentService = inject(DashboardService);

  assessmentQuestionTypes = '-1';
  authToken:any="";
  assessmentData: Assessment | null = null
  isFormSubmited: boolean = false; 
  apiMessage:any="";
  assessmentId: any ="";
  isBtnLoading: boolean= false;


  constructor(private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    this.assessmentId = this.route.snapshot.paramMap.get('id')!;
    this.authToken = localStorage.getItem('access_token');
    this.getSingleAssessment(this.authToken, this.assessmentId);
    
  }


  getSingleAssessment(authToken: string, assessmentId: string): void {
    this.indentService.getSingleAssessment(authToken, assessmentId).subscribe(
      (res: APIResponseModel) => {
        this.assessmentData = res.result;
      },
      error => {
        // Handle error
      }
    );
  }



  assessmentForm = this.fb.group({
    assessmentId: [''],
    question: ['', Validators.required],
    weightage: ['',Validators.required],
    question_type: ['', [Validators.required, Validators.min(1)]],
    correct_answer: '',
    answers: this.fb.array([
      this.fb.group({
        answer: ['', Validators.required],
        weightage: ['', Validators.required]
      }),
    ])
  });


  get answerGroups() {
    return this.assessmentForm.get('answers') as FormArray;
  }


  addAnswer(){
    this.answerGroups.push(
      this.fb.group({
        answer: ['', Validators.required],
        weightage: ['', Validators.required]
      })
    );
  }

  removeAnswer(index: number){
    this.answerGroups.removeAt(index);
  }

  questionTypeChanged(event: any){
    const clientId = (event.target as HTMLSelectElement).value;
    this.assessmentQuestionTypes = clientId;
  }

  async postData(url = '', data: any, authToken: string) {
    return fetch(url, {
      method: 'POST', 
      mode: 'cors',    // no-cors, *cors, same-origin
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json());
  }

  async onSubmit(){
    this.isBtnLoading = true;
    this.isFormSubmited = true;
    this.authToken = localStorage.getItem('access_token');
    const data = this.assessmentForm.value;
    data.assessmentId = this.assessmentId
 
    if(this.assessmentForm.valid){
      this.postData(environment.apiURL+'Question/question', data, this.authToken)
      .then(data => {
        console.log(data); 
        if(data.status == 1){
          this.assessmentForm.reset();
          this.isBtnLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
          this.isBtnLoading = false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else{
      //this.apiMessage = "Please fill the form correctly";
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
      this.isBtnLoading = false;
    }
  }

}
