import { environment } from '../../environments/environment';
import { constant } from '../core/constant/constant';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-send-token',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './send-token.component.html',
  styleUrl: './send-token.component.css'
})
export class SendTokenComponent implements OnInit{
  fb = inject(FormBuilder);
  isFormSubmited: boolean = false;
  isFormSubmited2: boolean = false;
  authToken:any="";
  apiMessage:any="";
  apiMessage2:any="";
  hideForgotForm: boolean = true;
  isLoading: boolean = false;

  constructor(private messageService: MessageService){
  }

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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
      this.postData(environment.apiURL+constant.apiEndPoint.SENDTOKEN, data, this.authToken)
      .then(data => {
        if(data.status == 1){
          this.forgotPasswordForm.reset();
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
        }else{
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
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
