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
  selector: 'app-state-master',
  standalone: true,
  imports: [ReactiveFormsModule,ToastModule, CommonModule, RouterModule, DialogModule, CalendarModule],
  templateUrl: './state-master.component.html',
  styleUrl: './state-master.component.css'
})
export class StateMasterComponent implements OnInit {
  fb = inject(FormBuilder);
  indedentService = inject(DashboardService);
  authToken: any ='';
  stateData: any[] = [];
  isBtnLoading: boolean= false;
  isFormSubmited: boolean = false;
  stateMasterData:any;
  loginUserId: any;

  private customValidator= new CustomValidatorComponent();
  constructor (private messageService: MessageService, private route: ActivatedRoute, private http: HttpClient){
    this.loginUserId = localStorage.getItem('id');
  }
  
  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getStateData(this.authToken,'')
  }
  stateMasterForm = this.fb.group({
    state_id:['',Validators.required],
    name:['',[Validators.maxLength(150),this.customValidator.alphaSpaceValidator()]],
    created_by:['']
  })


  getStateData(authToken: string, zoneId: string): void {
    this.indedentService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
        // console.log(this.stateData[0].name);
      },
      error => {
        // Handle error
      }
    );
  }

  async UpdateStateMaster() {
    this.isBtnLoading = true;
    this.isFormSubmited = true;

    const data = this.stateMasterForm.value;
    data.created_by = this.loginUserId;
    this.authToken = localStorage.getItem('access_token');

    if (this.stateMasterForm.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATECITY}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isBtnLoading = false;
            if (response.status === 1) {
              this.stateMasterForm.reset();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              
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

   
  
}
