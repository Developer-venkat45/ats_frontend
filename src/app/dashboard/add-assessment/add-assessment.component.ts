import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { FormGroup, FormArray, FormBuilder, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, APIResponseModel, Name } from '../../core/model/model';
import { environment } from '../../../environments/environment';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { constant } from '../../core/constant/constant';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-assessment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent, MultiSelectModule, DialogModule, ButtonModule, InputTextModule,ToastModule],
  templateUrl: './add-assessment.component.html',
  styleUrl: './add-assessment.component.css'
})

export class AddAssessmentComponent implements OnInit{
  indentService = inject(DashboardService);

  // assessmentForm: FormGroup;
  isFormSubmited: boolean = false; 
  authToken:any="";
  apiMessage:any="";
  apiMessage2:any="";
  assessmentCatData: Name [] = [];
  insertMsg: any = '';
  isLoading:boolean=false;
  fb = inject(FormBuilder);
  overallFormValid: string="";

  cities!: City[];

  visible: boolean = false;
  private customValidator= new CustomValidatorComponent();
  showDialog() {
    this.visible = true;
  }

  constructor (private messageService: MessageService){
    // this.assessmentForm = new FormGroup({
    //   title: new FormControl("", Validators.required),
    //   category: new FormControl("", Validators.required),
    //   newcategory: new FormControl("")
    // })
  }



  ngOnInit() {
    this.authToken = localStorage.getItem('access_token');
    this.getAllAssessmentCategory(this.authToken);

    this.cities = [
        {name: 'Aptitude'},
        {name: 'Math'},
        {name: 'General Science'},
        {name: 'Politics'},
        {name: 'History'}
    ];
  }


  getAllAssessmentCategory(authToken: string): void {
    this.indentService.getAllAssessmentCategory(authToken).subscribe(
      (res: APIResponseModel) => {
        this.assessmentCatData = res.result[0].name;
        console.log(this.assessmentCatData);
      },
      error => {
        console.error('Error fetching assessment categories:', error);
      }
    );
  }


  assessmentForm = this.fb.group({
    title: ['',[Validators.required,this.customValidator.alphaNumaricValidator()]],
    category: ['', Validators.required]
  })
  


  async postData2(url = '', data: any, authToken: string) {
    return fetch(url, {
      method: 'PUT', 
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
    this.isLoading=true;
    this.isFormSubmited = true;
    this.authToken = localStorage.getItem('access_token');
    const data = this.assessmentForm.value;
 
    if(this.assessmentForm.valid){
      this.postData(environment.apiURL+'Assessment/insert_assessment', data, this.authToken)
      .then(data => {
        if(data.status == 1){
          this.isLoading=false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
          this.assessmentForm.reset();
          //this.apiMessage = "Data Inserted";
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
          this.isLoading = false;
          //this.apiMessage = "Data Not Inserted";
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      //this.overallFormValid ='';
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
      this.isLoading = false;
    }
  }


  assessmentCatForm = this.fb.group({
    name: ['', Validators.required]
  })
  addCategory(){
    this.isLoading=true;
    this.authToken = localStorage.getItem('access_token');
    const insertData = this.assessmentCatForm.value;
    //const insertData = {"name": data};
    if(this.assessmentCatForm.valid){
      this.postData2(environment.apiURL+'master/assessment_category', insertData, this.authToken)
      .then(data => {
        if(data.status == 1){
          this.assessmentCatForm.reset();
          this.apiMessage2 = "Data Inserted";
          this.getAllAssessmentCategory(this.authToken);
          this.isLoading=false;
          setTimeout(() => {this.apiMessage2 =""}, 3000);
        }else{
          this.apiMessage2 = "Data Not Inserted";
          this.isLoading=false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else{
      this.isLoading=false;
    }
  }
}



interface City {
  name: string,
}
