import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { constant } from '../core/constant/constant';
import { ActivatedRoute, RouterModule} from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export class EmailVerificationComponent implements OnInit{

  authToken:any="";
  apiMessage:any="";
  token:any="";
  isSuccess: boolean = false;
  isError: boolean = false;
  isExpired: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { 
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.verifyEmail();
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


  async verifyEmail(){
    const data = {
      "auth_key": this.token,
    }
    this.postData(environment.apiURL+constant.apiEndPoint.VERIFYEMAIL+'?token='+this.token, data, this.authToken)
    .then(data => {
      if(data.status == 1){
        if(data.message == 'User Verified Successfully'){
          this.isSuccess = true;
        }
        if(data.message == 'Token expired'){
          this.isExpired = true;
        }
      }else{
        this.isError = true;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}
