import { Component, inject, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormArray,FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { DashboardService } from '../../core/service/dashboard.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule} from '@angular/router';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-addassessment-question',
  standalone: true,
  imports: [ReactiveFormsModule,ToastModule, CommonModule, RouterModule],
  templateUrl: './addassessment-question.component.html',
  styleUrl: './addassessment-question.component.css'
})
export class AddassessmentQuestionComponent implements OnInit{
  clientService = inject(DashboardService);
  fb = inject(FormBuilder);
  authToken:any="";
  isBtnLoading: boolean= false;
  isFormSubmited: boolean = false;
  eandiData: any;
  assessmentId: any;
  loginUserName:any;
  loginUserId:any;
  weightageSum: number = 0;
  validationmessage2:string='';
  remaingWeightage: number = 0;

  private customValidator= new CustomValidatorComponent()
  constructor (private messageService: MessageService, private route: ActivatedRoute, private http: HttpClient){}

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.assessmentId = this.route.snapshot.paramMap.get('id')!;
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    this.getallassessment(this.authToken,this.assessmentId,'','');
    this.optionGroups.push(
      this.fb.group({
        option: ['', Validators.required],
        score: ['', Validators.required]
      })
    );
  }



  getallassessment(authToken:string,id:string,title:string,category:string): void {
    this.clientService.getAllAssessment(authToken,id,title,category).subscribe(
      (res: any) => {
        this.eandiData = res.result[0];
        for (const eandi of this.eandiData?.questions) {
          this.weightageSum += eandi.weightage
        }
        this.remaingWeightage = 100 - this.weightageSum;
      },
      error => {
        // Handle error
      }
    );
  }


  checkWeightage(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = Number(inputElement.value);
    const newRemainingWeightage = 100 - (this.weightageSum + selectedValue);
    this.remaingWeightage = newRemainingWeightage;
    if(this.remaingWeightage < 0){
      this.validationmessage2='*NotLessThanWeightage';
    }else{
      this.validationmessage2='';
    }
  }


  insertEandiQuestion = this.fb.group({
    assessmentId:[''],
    question: ['', Validators.required],
    weightage: ['', [Validators.required,this.customValidator.numberValidator()]],
    options: this.fb.array([
      this.fb.group({
        option: ['', Validators.required],
        score: ['', [Validators.required,this.customValidator.numberValidator()]]
      })
    ]),
    createdById: [''],
    createdByName: ['']
  }, { validators: [this.customValidator.MinValidator('weightage', 'score')] });



  get optionGroups() {
    return this.insertEandiQuestion.get('options') as FormArray;
  }

  addMoreQuestion(){
    this.optionGroups.push(
      this.fb.group({
        option: ['', Validators.required],
        score: ['', Validators.required]
      })
    );
  }

  removeQuestion(index: number){
    this.optionGroups.removeAt(index);
  }



  async insertEandiQuestions() {
    this.isBtnLoading = true;
    this.isFormSubmited = true;

    this.insertEandiQuestion.patchValue({
      assessmentId: this.assessmentId,
      createdById: this.loginUserId,
      createdByName: this.loginUserName
    });

    const data = this.insertEandiQuestion.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.insertEandiQuestion.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.INSERTASSESSMENTQUESTION}`;

      this.http.post<any>(url, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isBtnLoading = false;
          if (response.status === 1) {
            this.insertEandiQuestion.reset();
            this.getallassessment(this.authToken, this.assessmentId, '', '');
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isBtnLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the eandi question.' });
        }
      );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }
}
