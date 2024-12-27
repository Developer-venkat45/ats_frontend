import { Component, inject, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormArray,FormBuilder,ReactiveFormsModule, Validators ,FormControl, FormGroup} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { DashboardService } from '../../core/service/dashboard.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule} from '@angular/router';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { DialogModule } from 'primeng/dialog';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-addeandi-question',
  standalone: true,
  imports: [ReactiveFormsModule,ToastModule, CommonModule, RouterModule, DialogModule, CalendarModule],
  templateUrl: './addeandi-question.component.html',
  styleUrl: './addeandi-question.component.css'
})
export class AddeandiQuestionComponent implements OnInit{
  clientService = inject(DashboardService);
  fb = inject(FormBuilder);
  authToken:any="";
  isBtnLoading: boolean= false;
  isFormSubmited: boolean = false;
  eandiData: any;
  eandiId: any;
  loginUserName:any;
  loginUserId:any;
  weightageSum: number = 0;
  remaingWeightage: number = 0;
  weightagevalidationmessage:string='';
  tab:boolean=false;
  validationmessage1:string='';
  primaryColor = '#3498db';
  lebel1: string = 'Question';
  questionCategory: any = '';
  inputFieldType: any = '';
  inputControlType: any = '';
  dynamicInputType: any = 'text';
  visibility:boolean = true;
  questionModalView: boolean =false;
  selectedEandi:any;
  workingStatusValue2: any [] = [];
  index: number = 1;

  constructor (private messageService: MessageService, private route: ActivatedRoute, private http: HttpClient){}
  private customValidator= new CustomValidatorComponent()
  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.eandiId = this.route.snapshot.paramMap.get('id')!;
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    this.getAlleandi2(this.authToken,this.eandiId,'','');
    this.optionGroups.push(
      this.fb.group({
        option: [null],
        score: [null]
      })
    );
  }

  getAlleandi2(authToken:string,id:string,title:string,category:string): void {
    this.clientService.getAlleandi(authToken,id,title,category).subscribe(
      (res: any) => {
        this.eandiData = res.result[0];
        this.remaingWeightage=0;
        this.weightageSum=0;
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
      this.validationmessage1='*NotLessThanWeightage';
    }else{
      this.validationmessage1='';
    }
  }


  insertEandiQuestion = this.fb.group({
    eandiId:[null],
    fieldType: [null, Validators.required],
    inputType: [null, Validators.required],
    question: [''],
    weightage: [null,[Validators.required,this.customValidator.numberValidator()]],
    unit: [null],
    minimum: [null],
    visibility: [true],
    options: this.fb.array([
      this.fb.group({
        option: [null],
        score: [null]
      })
    ]),
    conditions: this.fb.array([
      this.fb.group({
        operator: [null],
        value: [null],
        control: [null],
        operator2: [null],
        value2: [null],
        score: [null]
      })
    ]),
    createdById: [null],
    createdByName: [null]
  }, { validators: [this.customValidator.MinValidator('weightage', 'score'), this.customValidator.MinValidator2('weightage', 'score')] });



  get optionGroups() {
    return this.insertEandiQuestion.get('options') as FormArray;
  }

  addMoreQuestion(){
    this.optionGroups.push(
      this.fb.group({
        option: [null,[this.customValidator.nullValidator()]],
        score: [null,[this.customValidator.nullValidator(),this.customValidator.numberValidator()]]
      })
    );
    this.MCQValidation(this.index);
    this.index++;
  }

  removeQuestion(index: number){
    this.optionGroups.removeAt(index);
  }



  get conditionGroups() {
    return this.insertEandiQuestion.get('conditions') as FormArray;
  }

  addMoreCondition(){
    this.conditionGroups.push(
      this.fb.group({
        operator: [null, [this.customValidator.nullValidator()]],
        value: [null, [this.customValidator.numbersAndFloatnumValidator()]],
        control: [null],
        operator2: [null],
        value2: [null, [this.customValidator.numbersAndFloatnumValidator()]],
        score: [null, [this.customValidator.numberValidator()]]
      })
    );
    this.workingStatusValue2[this.index] = false;
    this.nqFalidation(this.index);
    this.index++;
  }

  removeCondition(index: number){
    this.conditionGroups.removeAt(index);
  }


  async insertEandiQuestions() {
    this.isBtnLoading = true;
    this.isFormSubmited = true;

    this.insertEandiQuestion.patchValue({
      eandiId: this.eandiId,
      createdById: this.loginUserId,
      createdByName: this.loginUserName
    });

    const data = this.insertEandiQuestion.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.insertEandiQuestion.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.INSERTEANDIQUESTION}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isBtnLoading = false;
            if (response.status === 1) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              this.insertEandiQuestion.reset();
              this.getAlleandi2(this.authToken, this.eandiId, '', '');
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the Eandi question.' });
          }
        );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }



  fieldType(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    this.questionCategory = selectedStateName;
    if(selectedStateName == "Generic Question"){
      this.lebel1 = "Question";
    }else{
      this.lebel1 = "Label";
    }
    this.resetForm2(this.questionCategory);
  }

  inputType(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    const question = this.insertEandiQuestion.get('question');
    this.inputFieldType = selectedStateName;

    const conditionsFormArray = this.insertEandiQuestion.get('conditions') as FormArray;
    for (let i = conditionsFormArray.length - 1; i >= 0; i--) {
      this.nqFalidation(i);
    }
    const experienceFormArray = this.insertEandiQuestion.controls.options as FormArray;
    for (let i = experienceFormArray.length - 1; i >= 0; i--) {
      this.MCQValidation(i);
    }
    this.resetForm3(this.inputFieldType);

    if(this.inputFieldType == "DIQ" || this.inputFieldType == "DOB"){
      this.dynamicInputType = 'date';
    }else{
      this.dynamicInputType = 'text';
    }
    if(this.questionCategory == "Candidate Field"){
      if(this.inputFieldType != "Skill" && this.inputFieldType != "HQS"){
        this.visibility = false;
        this.insertEandiQuestion.patchValue({
          visibility: false,
        });
        question?.clearValidators();
      }else{
        this.visibility = true;
        this.insertEandiQuestion.patchValue({
          visibility: true,
        });
        question?.setValidators([Validators.required, this.customValidator.nullValidator()]);
      }
      console.log(this.inputFieldType);
    }else{
      question?.setValidators([Validators.required,this.customValidator.nullValidator()]);
    }
    question?.updateValueAndValidity();




    if(this.inputFieldType == "DOB"){
      this.insertEandiQuestion.patchValue({
        question: 'Date of Birth',
      });
    }
    if(this.inputFieldType == "Gender"){
      this.insertEandiQuestion.patchValue({
        question: 'Gender',
      });
    }
    if(this.inputFieldType == "City"){
      this.insertEandiQuestion.patchValue({
        question: 'City',
      });
    }
    if(this.inputFieldType == "TWE"){
      this.insertEandiQuestion.patchValue({
        question: 'Total Work Experience',
      });
    }
    if(this.inputFieldType == "HQ"){
      this.insertEandiQuestion.patchValue({
        question: 'Highest Qualification',
      });
    }
    if(this.inputFieldType == "HQS"){
      this.insertEandiQuestion.patchValue({
        question: 'Highest Qualification Specialization',
      });
    }
    if(this.inputFieldType == "HQPY"){
      this.insertEandiQuestion.patchValue({
        question: 'Highest Qualification Passing Year',
      });
    }
    if(this.inputFieldType == "HQP"){
      this.insertEandiQuestion.patchValue({
        question: 'Highest Qualification Percentage',
      });
    }
  }

  logicControl(event: Event, index: number):void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    this.inputControlType = selectedStateName;

    const experienceFormArray = this.insertEandiQuestion.controls.conditions as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const operator2 = experienceFromGroup.get('operator2');
    const value2 = experienceFromGroup.get('value2');

    if(this.inputControlType !="null"){
      this.workingStatusValue2[index] = true;
      operator2?.setValidators([this.customValidator.nullValidator()]);
      value2?.setValidators([this.customValidator.nullValidator()]);
    }
    if(this.inputFieldType == "NQ" || this.inputFieldType == "TWE" || this.inputFieldType == "HQPY" || this.inputFieldType == "HQP"){
      value2?.setValidators([this.customValidator.nullValidator(),this.customValidator.numbersAndFloatnumValidator()]);
    }else if(this.inputFieldType == "DIQ" || this.inputFieldType == "DOB"){
      value2?.setValidators([this.customValidator.nullValidator()]);
    }
    else{
      this.workingStatusValue2[index] = false;
      operator2?.clearValidators();
      value2?.clearValidators();
    }
    operator2?.updateValueAndValidity();
    value2?.updateValueAndValidity();

    console.log("Logic controller");
  }


  allQuestions(){
    this.questionModalView = true;
    this.selectedEandi = this.insertEandiQuestion.value;
  }


  resetForm(){
    this.insertEandiQuestion.reset();
    this.insertEandiQuestion.patchValue({
      eandiId: null,
      fieldType: null,
      inputType: null,
      question: null,
      weightage: null,
      unit: null,
      minimum: null,
      visibility: true,
    });
    this.inputFieldType = '';
    this.visibility = true;
  }

  resetForm2(category:any){
    this.insertEandiQuestion.reset();
    this.insertEandiQuestion.patchValue({
      fieldType: category,
      inputType: null,
      question: null,
      weightage: null,
      unit: null,
      minimum: null,
      visibility: true,
    });
    this.inputFieldType = '';
    this.visibility = true;
  }

  resetForm3(category:any){
    this.insertEandiQuestion.reset();
    this.insertEandiQuestion.patchValue({
      fieldType: this.questionCategory,
      inputType: category,
      question: null,
      weightage: null,
      unit: null,
      minimum: null,
      visibility: true,
    });
    if(this.questionCategory == "Candidate Field"){
      if(category != "Skill" && category != "HQS"){
        this.visibility = false;
      }else{
        this.visibility = true;
      }
    }
  }

  nqFalidation(index: number){
    const experienceFormArray = this.insertEandiQuestion.controls.conditions as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const operator = experienceFromGroup.get('operator');
    const value = experienceFromGroup.get('value');
    const score = experienceFromGroup.get('score');
    if(this.inputFieldType == "NQ" || this.inputFieldType == "DIQ" || this.inputFieldType == "DOB" || this.inputFieldType == "TWE" || this.inputFieldType == "HQPY" || this.inputFieldType == "HQP"){
      operator?.setValidators([this.customValidator.nullValidator()]);
      if(this.inputFieldType == "NQ" || this.inputFieldType == "TWE" || this.inputFieldType == "HQPY" || this.inputFieldType == "HQP"){
        value?.setValidators([this.customValidator.nullValidator(),this.customValidator.numbersAndFloatnumValidator()]);
      }else if(this.inputFieldType == "DIQ" || this.inputFieldType == "DOB"){
        value?.setValidators([this.customValidator.nullValidator()]);
      }else{
        value?.setValidators([this.customValidator.nullValidator()]);
      }
      score?.setValidators([this.customValidator.nullValidator(),this.customValidator.numberValidator()]);
    }else{
      operator?.clearValidators();
      value?.clearValidators();
      score?.clearValidators();
    }
    operator?.updateValueAndValidity();
    value?.updateValueAndValidity();
    score?.updateValueAndValidity();
  }

  MCQValidation(index: number){
    const experienceFormArray = this.insertEandiQuestion.controls.options as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const score = experienceFromGroup.get('score');
    const option = experienceFromGroup.get('option');
    if(this.inputFieldType == "MCQ" || this.inputFieldType == "MSQ" || this.inputFieldType == "HQS" || this.inputFieldType == "DDQ" || this.inputFieldType == "Gender" || this.inputFieldType == "Skill" || this.inputFieldType == "City" || this.inputFieldType == "HQ"){
      score?.setValidators([this.customValidator.nullValidator(),this.customValidator.numberValidator()]);
      option?.setValidators([this.customValidator.nullValidator()]);
    }else{
      score?.clearValidators();
      option?.clearValidators();
    }
    score?.updateValueAndValidity();
    option?.updateValueAndValidity();
  }
}
