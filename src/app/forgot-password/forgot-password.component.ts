import { environment } from '../../environments/environment';
import { constant } from '../core/constant/constant';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CustomValidatorComponent } from '../validations/custom-validator.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  fb = inject(FormBuilder);
  isFormSubmited: boolean = false;
  isFormSubmited2: boolean = false;
  authToken:any="";
  apiMessage:any="";
  apiMessage2:any="";
  hideForgotForm: boolean = true;
  isLoading: boolean = false;

  private customValidator= new CustomValidatorComponent();
  constructor(private messageService: MessageService){

  }

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });


  resetPasswordForm = this.fb.group({
    email: [''],
    otp: ['', [Validators.required,this.customValidator.numberValidator()]],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
  }

  
  async postData(url = '', data: any, authToken: string) {
    return fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json());
  }

  async forgotPassword(){
    this.isFormSubmited = true;
    this.isLoading = true;
    this.authToken = localStorage.getItem('access_token');
    const data = this.forgotPasswordForm.value;

    if(this.forgotPasswordForm.valid){
      this.postData(environment.apiURL+constant.apiEndPoint.FORGOTPASSWORD, data, this.authToken)
      .then(data => {
        if(data.status == 1){
          //this.apiMessage = data.message;
          this.hideForgotForm = false;
          this.isLoading = false;
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
    }else{
      this.isLoading = false;
      //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
    }
  }


  async resetPassword(){
    this.isFormSubmited2 = true;
    this.isLoading = true;
    this.authToken = localStorage.getItem('access_token');
    const data = this.resetPasswordForm.value;
    data.email = this.forgotPasswordForm.controls.email.value;
    const newpassword = this.resetPasswordForm.controls.newPassword.value;
    const confirmpassword = this.resetPasswordForm.controls.confirmPassword.value;


    if(this.resetPasswordForm.valid){
      if(newpassword === confirmpassword){
        this.postData(environment.apiURL+constant.apiEndPoint.RESTPASSWORD, data, this.authToken)
        .then(data => {
          if(data.status == 1){
            this.resetPasswordForm.reset();
            //this.apiMessage2 = data.message;
            this.isLoading = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
          }else{
            //this.apiMessage2 = data.message;
            this.isLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }else{
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'New and Confirm password does not match' });
      }
    }else{
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
    }
    
  }

}
