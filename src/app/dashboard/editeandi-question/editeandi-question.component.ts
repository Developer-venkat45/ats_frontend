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
import { group } from '@angular/animations';
@Component({
  selector: 'app-editeandi-question',
  standalone: true,
  imports: [ReactiveFormsModule,ToastModule, CommonModule, RouterModule, DialogModule],
  templateUrl: './editeandi-question.component.html',
  styleUrl: './editeandi-question.component.css'
})
export class EditeandiQuestionComponent implements OnInit{
  clientService = inject(DashboardService);
  fb = inject(FormBuilder);
  authToken:any="";
  isBtnLoading: boolean= false;
  isFormSubmited: boolean = false;
  eandiData: any;
  eandiId: any;
  singleEandi: any;
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
  lastClickedQuesNo: number = -1;
  oldWeightageValue: number = 0;
  inputCategory: any = '';

  
  option: any;
  constructor (private messageService: MessageService, private route: ActivatedRoute, private http: HttpClient){}
  private customValidator= new CustomValidatorComponent()
  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.eandiId = this.route.snapshot.paramMap.get('id')!;
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
    //this.getAlleandi2(this.authToken,this.eandiId,'','');
    this.getSingleEandi(this.authToken,this.eandiId);
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
  getSingleEandi(authToken: string,id:string):void{
    this.clientService.getSingleEandi(authToken,id).subscribe(
      (res: any)=>{
          this.eandiData = res.result;
          this.showEditModal(this.eandiData);
          this.oldWeightageValue = this.eandiData.weightage;
          this.questionCategory= this.eandiData.fieldType;
          this.inputCategory = this.eandiData.inputType;
      },
      error => {
        // Handle error
      }
    );
  }

  checkWeightage(event: Event): void{
    // const inputElement = event.target as HTMLInputElement;
    // const selectedValue = Number(inputElement.value);
    // const newRemainingWeightage = 100 - (this.weightageSum + selectedValue);
    // this.remaingWeightage = newRemainingWeightage;
    // if(this.remaingWeightage < 0){
    //   this.validationmessage1='*NotLessThanWeightage';
    // }else{
    //   this.validationmessage1='';
    // }
    // console.log(selectedValue);
  }


  editEandiQuestion = this.fb.group({
    eandiQuestionId:[null],
    eandiId:[''],
    fieldType: [null, Validators.required],
    inputType: [null, Validators.required],
    question: [''],
    weightage: [0,[Validators.required,this.customValidator.numberValidator()]],
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
    return this.editEandiQuestion.get('options') as FormArray;
  }


  showEditModal(question: any):void{
    // window.location.reload();
    
    //console.log(question.inputType);
    this.questionCategory= question.fieldType;
    //console.log(this.questionCategory);
      this.fieldType2(question.fieldType);
      this.inputType2(question.inputType);
      // this.logicControl2(0);
      this.editEandiQuestion.patchValue({
        eandiQuestionId:question._id,
        fieldType: question.fieldType,
        inputType: question.inputType,
        question: question.question,
        weightage: question.weightage,
        unit : question.unit,
        minimum: question.minimum,
        visibility: question.visibility,
      });
      const optionsArray = this.editEandiQuestion.get('options') as FormArray;
      const conditionsArray = this.editEandiQuestion.get('conditions')as FormArray;
      optionsArray.clear();
      conditionsArray.clear();
      let inputType:string[]=["nq","twe","diq","dob","hqpy","hqp"]
      let conditionExec:boolean=false
      inputType.forEach((input)=>{
         if(question.inputType===input) conditionExec=true
      })
      
      var i =0;
      if(conditionExec){
          for(const optionObj of question.options){
            let conditionArr=optionObj.option.split(" ")
            if(conditionArr.length>1){
              //console.log(conditionArr)
              let operator1 = "", value1 = "", operator2 = "", value2 = "", control = null;
               control=conditionArr[1]
               if(conditionArr[0][1]==="="){
                 operator1=conditionArr[0].substring(0,2)
                 value1=conditionArr[0].substring(2)
               }
               else{
                 operator1=conditionArr[0].substring(0,1)
                 value1=conditionArr[0].substring(1)
               }
               if(conditionArr[2][1]==="="){
                 operator2=conditionArr[2].substring(0,2)
                 value2=conditionArr[2].substring(2)
               }
               else{
                 operator2=conditionArr[2].substring(0,1)
                 value2=conditionArr[2].substring(1)
               }
               
               conditionsArray.push(this.fb.group({
                 operator: [operator1],
                 value : [value1],
                 control: [control],
                 operator2:[operator2],
                 value2: [value2],
                 score: [optionObj.score]
               }));
               this.logicControl2(i);
               
            }
            else{
             let operator1:string=""
             let value1:string=""
             if(conditionArr[0][1]==="="){
               operator1=conditionArr[0].substring(0,2)
               value1=conditionArr[0].substring(2)
             }
             else{
               operator1=conditionArr[0].substring(0,1)
               value1=conditionArr[0].substring(1)
             }
             
             conditionsArray.push(this.fb.group({
               operator: [operator1],
               value : [value1],
               score: [optionObj.score],
               control: [null],
               operator2:[""],
               value2: [""],
             }));
            
            }      
            i++;

          }
          question.options.forEach((optiong:any) => {
            optionsArray.push(this.fb.group({
              option: [optiong.option],
              score: [optiong.score]
          }));
          });       
      }
      else{
        question.options.forEach((optiong:any) => {
          optionsArray.push(this.fb.group({
            option: [optiong.option],
            score: [optiong.score]
        }));
        });
        conditionsArray.push(this.fb.group({
          operator: [''],
          value : [''],
          score: [''],
          control: [null],
          operator2:[""],
          value2: [""],
        }));
      }
    
     
    // }
    
    // this.lastClickedQuesNo=currentQuesNo
  
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
    return this.editEandiQuestion.get('conditions') as FormArray;
  }

  addMoreCondition(){
    this.conditionGroups.push(
      this.fb.group({
        operator: [null, [this.customValidator.nullValidator()]],
        value: [null, [this.customValidator.numberValidator()]],
        control: [null],
        operator2: [null],
        value2: [null],
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


  async UpdateEandiQuestions(){
    this.isFormSubmited = true;
    this.isBtnLoading = true;
    const data = this.editEandiQuestion.value;
    data.eandiQuestionId = this.eandiId;
    const updatedId = this.eandiId;
    this.authToken = localStorage.getItem('access_token');

    if(this.editEandiQuestion.valid){
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATEEANDIQUESTIONS}?editEandI_id=${updatedId}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {

            if (response.status === 1) {
              this.isBtnLoading = false;
              // this.editEandiQuestion.reset();
              //this.getAlleandi2(this.authToken, this.eandiId, '', '');
              //this.getSingleEandi(this.authToken,this.eandiId);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });

            } else {
              this.isBtnLoading = false;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.isBtnLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while reassigning the partner.' });
          }
        );
    } else {
      this.isBtnLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
        
  }

  fieldType2(fieldType:any){
    this.questionCategory = fieldType;
    // console.log(this.questionCategory)
    if(this.questionCategory == "generic question"){
      this.lebel1 = "Question";
    }else{
      this.lebel1 = "Label";
    }


    this.resetForm2(this.questionCategory);
  }

  fieldType(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    this.questionCategory = selectedStateName;
    if(selectedStateName == "generic question"){
      this.lebel1 = "Question";
    }else{
      this.lebel1 = "Label";
    }
    this.resetForm2(this.questionCategory);
    
  }
  


  inputType2(inputType: any){
    this.inputFieldType = inputType;
    // console.log(this.inputFieldType)
    
    const question = this.editEandiQuestion.get('question');
    const conditionsFormArray = this.editEandiQuestion.get('conditions') as FormArray;
    for (let i = conditionsFormArray.length - 1; i >= 0; i--) {
      this.nqFalidation(i);
    }
    const experienceFormArray = this.editEandiQuestion.controls.options as FormArray;
    for (let i = experienceFormArray.length - 1; i >= 0; i--) {
      this.MCQValidation(i);
    }
    this.resetForm3(this.inputFieldType);

    if(this.inputFieldType == "diq" || this.inputFieldType == "dob"){
      this.dynamicInputType = 'date';
    }else{
      this.dynamicInputType = 'text';
    }
    if(this.questionCategory == "candidate field"){
      if(this.inputFieldType != "skill" && this.inputFieldType != "hqs"){
        this.visibility = false;
        this.editEandiQuestion.patchValue({
          visibility: false,
        });
        question?.clearValidators();
      }else{
        this.visibility = true;
        this.editEandiQuestion.patchValue({
          visibility: true,
        });
        question?.setValidators([Validators.required, this.customValidator.nullValidator()]);
      }
      //console.log(this.inputFieldType);
    }else{
      question?.setValidators([Validators.required,this.customValidator.nullValidator()]);
    }
    question?.updateValueAndValidity();




    if(this.inputFieldType == "dob"){
      this.editEandiQuestion.patchValue({
        question: 'dob',
      });
    }
    if(this.inputFieldType == "gender"){
      this.editEandiQuestion.patchValue({
        question: 'gender',
      });
    }
    if(this.inputFieldType == "city"){
      this.editEandiQuestion.patchValue({
        question: 'city',
      });
    }
    if(this.inputFieldType == "twe"){
      this.editEandiQuestion.patchValue({
        question: 'twe',
      });
    }
    if(this.inputFieldType == "hq"){
      this.editEandiQuestion.patchValue({
        question: 'hq',
      });
    }
    if(this.inputFieldType == "hqpy"){
      this.editEandiQuestion.patchValue({
        question: 'hqpy',
      });
    }
    if(this.inputFieldType == "hqp"){
      this.editEandiQuestion.patchValue({
        question: 'hqp',
      });
    }
    
    
  }



  inputType(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    const question = this.editEandiQuestion.get('question');
    this.inputFieldType = selectedStateName;

    const conditionsFormArray = this.editEandiQuestion.get('conditions') as FormArray;
    for (let i = conditionsFormArray.length - 1; i >= 0; i--) {
      this.nqFalidation(i);
      console.log(i,conditionsFormArray.value[i].control)
      this.logicControl3(null,i)

    }
    const experienceFormArray = this.editEandiQuestion.controls.options as FormArray;
    for (let i = experienceFormArray.length - 1; i >= 0; i--) {
      this.MCQValidation(i);
    }
    this.resetForm3(this.inputFieldType);

    if(this.inputFieldType == "diq" || this.inputFieldType == "dob"){
      this.dynamicInputType = 'date';
    }else{
      this.dynamicInputType = 'text';
    }
    if(this.questionCategory == "candidate field"){
      if(this.inputFieldType != "skill" && this.inputFieldType != "hqs"){
        this.visibility = false;
        this.editEandiQuestion.patchValue({
          visibility: false,
        });
        question?.clearValidators();
      }else{
        this.visibility = true;
        this.editEandiQuestion.patchValue({
          visibility: true,
        });
        question?.setValidators([Validators.required, this.customValidator.nullValidator()]);
      }
      //console.log(this.inputFieldType);
    }else{
      question?.setValidators([Validators.required,this.customValidator.nullValidator()]);
    }
    question?.updateValueAndValidity();




    if(this.inputFieldType == "dob"){
      this.editEandiQuestion.patchValue({
        question: 'dob',
      });
    }
    if(this.inputFieldType == "gender"){
      this.editEandiQuestion.patchValue({
        question: 'gender',
      });
    }
    if(this.inputFieldType == "city"){
      this.editEandiQuestion.patchValue({
        question: 'city',
      });
    }
    if(this.inputFieldType == "twe"){
      this.editEandiQuestion.patchValue({
        question: 'twe',
      });
    }
    if(this.inputFieldType == "hq"){
      this.editEandiQuestion.patchValue({
        question: 'hq',
      });
    }
    if(this.inputFieldType == "hqpy"){
      this.editEandiQuestion.patchValue({
        question: 'hqpy',
      });
    }
    if(this.inputFieldType == "hqp"){
      this.editEandiQuestion.patchValue({
        question: 'hqp',
      });
    }
  }

  logicControl2(index:any){
   this.inputControlType = index;
   //console.log(this.inputControlType)
    //console.log(this.inputControlType)
    const experienceFormArray = this.editEandiQuestion.controls.conditions as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const operator2 = experienceFromGroup.get('operator2');
    const value2 = experienceFromGroup.get('value2');

    if(this.inputControlType !="null"){
      this.workingStatusValue2[index] = true;
      operator2?.setValidators([this.customValidator.nullValidator()]);
      value2?.setValidators([this.customValidator.nullValidator()]);
    }else{
      this.workingStatusValue2[index] = false;
      operator2?.clearValidators();
      value2?.clearValidators();
    }
    operator2?.updateValueAndValidity();
    value2?.updateValueAndValidity();

    //console.log("Logic controller2");
    
  }
  

  logicControl(event: Event, index: number):void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    this.inputControlType = selectedStateName;
    //console.log(this.inputControlType)
    const experienceFormArray = this.editEandiQuestion.controls.conditions as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const operator2 = experienceFromGroup.get('operator2');
    const value2 = experienceFromGroup.get('value2');

    if(this.inputControlType !="null"){
      this.workingStatusValue2[index] = true;
      operator2?.setValidators([this.customValidator.nullValidator()]);
      value2?.setValidators([this.customValidator.nullValidator()]);
    }else{
      this.workingStatusValue2[index] = false;
      operator2?.clearValidators();
      value2?.clearValidators();
    }
    operator2?.updateValueAndValidity();
    value2?.updateValueAndValidity();

    //console.log("Logic controller");
  }

  
  logicControl3(logintype: any, index: number):void{
    this.inputControlType = logintype;
    console.log(this.inputControlType)
    const experienceFormArray = this.editEandiQuestion.controls.conditions as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const operator2 = experienceFromGroup.get('operator2');
    const value2 = experienceFromGroup.get('value2');

    if(this.inputControlType !=null){
      this.workingStatusValue2[index] = true;
      operator2?.setValidators([this.customValidator.nullValidator()]);
      value2?.setValidators([this.customValidator.nullValidator()]);
    }else{
      this.workingStatusValue2[index] = false;
      operator2?.clearValidators();
      value2?.clearValidators();
    }
    operator2?.updateValueAndValidity();
    value2?.updateValueAndValidity();

    //console.log("Logic controller");
  }

  allQuestions(){
    this.questionModalView = true;
    this.selectedEandi = this.editEandiQuestion.value;
  }



  resetForm2(category:any){
    this.editEandiQuestion.reset();
    this.editEandiQuestion.patchValue({
      fieldType: category,
      inputType: null,
      question: null,
      weightage: this.oldWeightageValue,
      unit: null,
      minimum: null,
      visibility: true,
    });
    this.inputFieldType = '';
    this.visibility = true;
  }

  resetForm3(category:any){
    this.editEandiQuestion.reset();
    this.editEandiQuestion.patchValue({
      fieldType: this.questionCategory,
      inputType: category,
      question: null,
      weightage: this.oldWeightageValue,
      unit: null,
      minimum: null,
      visibility: true,
    });
    if(this.questionCategory == "candidate field"){
      if(category != "skill" && category != "hqs"){
        this.visibility = false;
      }else{
        this.visibility = true;
      }
    }
  }


  nqFalidation2(index: any){
    const experienceFormArray = this.editEandiQuestion.controls.conditions as FormArray;
    const experienceFromGroup = experienceFormArray.at(0) as FormGroup;
    const operator = experienceFromGroup.get('operator');
    const value = experienceFromGroup.get('value');
    const score = experienceFromGroup.get('score');
    if(this.inputFieldType == "nq" || this.inputFieldType == "diq" || this.inputFieldType == "dob" || this.inputFieldType == "twe" || this.inputFieldType == "hqpy" || this.inputFieldType == "hqp"){
      operator?.setValidators([this.customValidator.nullValidator()]);
      value?.setValidators([this.customValidator.nullValidator()]);
      score?.setValidators([this.customValidator.nullValidator()]);
    }else{
      operator?.clearValidators();
      value?.clearValidators();
      score?.clearValidators();
    }
    operator?.updateValueAndValidity();
    value?.updateValueAndValidity();
    score?.updateValueAndValidity();
  }

  nqFalidation(index: number){
    const experienceFormArray = this.editEandiQuestion.controls.conditions as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const operator = experienceFromGroup.get('operator');
    const value = experienceFromGroup.get('value');
    const score = experienceFromGroup.get('score');
    if(this.inputFieldType == "nq" || this.inputFieldType == "diq" || this.inputFieldType == "dob" || this.inputFieldType == "twe" || this.inputFieldType == "hqpy" || this.inputFieldType == "hqp"){
      operator?.setValidators([this.customValidator.nullValidator()]);
      value?.setValidators([this.customValidator.nullValidator()]);
      score?.setValidators([this.customValidator.nullValidator()]);
    }else{
      operator?.clearValidators();
      value?.clearValidators();
      score?.clearValidators();
    }
    operator?.updateValueAndValidity();
    value?.updateValueAndValidity();
    score?.updateValueAndValidity();
    //console.log("nqva");
  }

  MCQValidation(index: number){
    const experienceFormArray = this.editEandiQuestion.controls.options as FormArray;
    const experienceFromGroup = experienceFormArray.at(index) as FormGroup;
    const score = experienceFromGroup.get('score');
    const option = experienceFromGroup.get('option');
    if(this.inputFieldType == "mcq" || this.inputFieldType == "msq" || this.inputFieldType == "hqs" || this.inputFieldType == "ddq" || this.inputFieldType == "gender" || this.inputFieldType == "skill" || this.inputFieldType == "city" || this.inputFieldType == "hq"){
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


