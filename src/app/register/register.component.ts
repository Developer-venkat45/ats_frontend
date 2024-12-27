import { Component,inject, OnInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { constant } from '../core/constant/constant';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CustomValidatorComponent } from '../validations/custom-validator.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastModule, RouterModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
  passwordFieldType: string = 'password';
  passwordFieldIcon: string = 'fa fa-eye';
  apiMessage:any="";
  isFormSubmited: boolean = false;
  overallFormValid: string = "";
  isLoading: boolean = false;
  source: any = null;
  passwordPolicyShow:boolean = false;
  isSuccess: boolean = false;
  private customValidator= new CustomValidatorComponent();

  constructor(private messageService: MessageService, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.source = localStorage.getItem('user_source');
  }


  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordFieldIcon = 'fa fa-eye-slash';
    } else {
      this.passwordFieldType = 'password';
      this.passwordFieldIcon = 'fa fa-eye';
    }
  }


  registerForm = this.fb.group({
    name: ['',[Validators.required,Validators.maxLength(150),this.customValidator.alphabetValidator()]],
    email: ['', [Validators.required,this.customValidator.emailValidator()]],
    mobile: ['', [Validators.required,this.customValidator.onlynumberValidator()]],
    password: ['', [Validators.required,this.customValidator.passwordValidValidator()]],
    source: ['']
  });



  
  async insertData(url = '', data={}) {
    return fetch(url, {
      method: 'POST', 
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        //'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json());
  }


  async register(){
    this.isFormSubmited = true;
    this.isLoading = true;
    this.passwordPolicyShow = true;
    const data = this.registerForm.value;
    data.source = this.source;

    if(this.registerForm.valid){
      this.insertData(environment.apiURL+constant.apiEndPoint.REGISTER, data)
      .then(data => {
        if(data.status == 1){
          //this.apiMessage = data.message;
          this.isSuccess = true;
          this.isLoading = false;
          this.registerForm.reset();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
        }else{
          //this.apiMessage = data.message;
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      //this.overallFormValid = '';
    }else{
      this.isLoading = false;
      //this.overallFormValid = "Please fill the form correctly";
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
    }
  }




}
