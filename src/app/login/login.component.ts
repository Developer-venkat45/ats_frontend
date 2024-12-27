import { Component,inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { constant } from '../core/constant/constant';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule, JsonPipe, ReactiveFormsModule, ToastModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isFormSubmited: boolean = false; 
  apiMessage:any="";
  username:any="";
  password:any="";
  error_msg:any="";
  usernamerror:string="";
  passworderror:string="";
  overallFormValid: string = "";
  passwordFieldType: string = 'password';
  passwordFieldIcon: string = 'fa fa-eye';
  isLoading: boolean = false;


  constructor(private router: Router, private messageService: MessageService){

  }


  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    username: ['',Validators.required],
    password: ['', Validators.required]
  });


  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordFieldIcon = 'fa fa-eye-slash';
    } else {
      this.passwordFieldType = 'password';
      this.passwordFieldIcon = 'fa fa-eye';
    }
  }


  async postData(url = '', formData: FormData) {
    
    // Default options are marked with *
    return fetch(url, {
      method: 'POST',  // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',    // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        //'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'no-referrer', // no-referrer, *client
      body: formData // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses JSON response into native JavaScript objects
  }
  


  async login(){
    this.isFormSubmited = true;
    this.isLoading = true;
    const data = this.loginForm.value;

    const formData: FormData = new FormData();
    formData.append('username', data.username ?? '');
    formData.append('password', data.password ?? '');

    if(this.loginForm.valid){
      this.postData(environment.apiURL+constant.apiEndPoint.LOGIN, formData)
      .then(data => {
        if(data.status == 1){
          if(data.access_token){
            localStorage.setItem("access_token",data.access_token)
            localStorage.setItem("id",data.id)
            localStorage.setItem("user",data.usertype)
            localStorage.setItem("name",data.name)
            localStorage.setItem("partner_id",data.partner_id)
            localStorage.setItem("candidate_id",data.candidate_id)
            localStorage.setItem("role_id",data.role_id)
            localStorage.setItem("role_name",data.role_name)
            localStorage.setItem("userDetails", JSON.stringify(data))
            const prevoius = localStorage.getItem('prevoius');
            if(data.role_name != 'Finance Admin'){
              if(prevoius == 'job_details'){
                const jobId = localStorage.getItem('job');
                if(jobId){
                  this.router.navigate(['/job_details/'+jobId]);
                }else{
                  this.router.navigate(['/job']);
                }
              }else{
                this.router.navigate(['/job']);
              }
            }else{
              this.router.navigate(['/dashboard']);
            }
          }else{
            this.error_msg=data.detail;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.detail });
          }
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
          this.isLoading = false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else{
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
    }
  }


}