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
  selector: 'app-editconfig',
  standalone: true,
  imports: [ReactiveFormsModule,ToastModule, CommonModule, RouterModule, DialogModule, CalendarModule],
  templateUrl: './editconfig.component.html',
  styleUrl: './editconfig.component.css'
})
export class EditconfigComponent {
  fb = inject(FormBuilder);
  indedentService = inject(DashboardService);
  authToken: any ='';
  stateData: any[] = [];
  isBtnLoading: boolean= false;
  isFormSubmited: boolean = false;
  stateMasterData:any;
  loginUserId: any;
  CvUploadUrl: any [] = [];

  private customValidator= new CustomValidatorComponent();
  constructor (private messageService: MessageService, private route: ActivatedRoute, private http: HttpClient){
    this.loginUserId = localStorage.getItem('id');
  }
  
  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getJobTypeData('CV Upload Url');
  }


  getJobTypeData(master: string): void {
    this.indedentService.getAllConfigMasterData( master).subscribe(
      (res: any) => {
        this.CvUploadUrl = res.data[0];
        console.log(this.CvUploadUrl)
        this.populatePartnerEditForm(this.CvUploadUrl);
      },
      error => {
        // Handle error
      }
    );
  }

  stateMasterForm = this.fb.group({
    serial_number:[''],
    name:[''],
    master_type:['']
  })

  populatePartnerEditForm(CvUploadUrl: any): void {
    if (CvUploadUrl) {
      this.stateMasterForm.patchValue({
        serial_number: '1',
        name: CvUploadUrl,
        master_type: 'CV Upload Url'
      });
    }
  }

  async UpdateStateMaster() {
    this.isBtnLoading = true;
    this.isFormSubmited = true;

    const data = this.stateMasterForm.value;
    //data.created_by = this.loginUserId;
    this.authToken = localStorage.getItem('access_token');

    if (this.stateMasterForm.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATECVUPLOADURL}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.put<any>(url, data, { headers })
        .subscribe(
          response => {
            this.isBtnLoading = false;
            if (response.status === 1) {
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
