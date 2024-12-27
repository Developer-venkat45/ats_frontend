import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, ClientResponse } from '../../core/model/model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { RouterModule } from '@angular/router';
import { DatePipe} from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [RouterModule,DatePipe,CommonModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent implements OnInit {

  clientService = inject(DashboardService);
  clientList: any;
  baseAPIURL:any;
  indentList: any [] = [];
  authToken: any = null;
  clientId: any = null;
  jobCategory: any = '';
  jobLocation: any = '';
  recruiterId: any = '';
  candidateId: any = '';
  skip:number = 0;
  partnerId: any = '';
  limit:any =10;
  pancardImageUrl: string = '../assets/images/preview.png';
  gstImageUrl: string = '../assets/images/preview.png';
  
  constructor(private route: ActivatedRoute) {
    this.baseAPIURL= environment.apiURL;
  }


  ngOnInit(): void {
    const authToken:any = localStorage.getItem('access_token');
    const clientId: any = this.route.snapshot.paramMap.get('id')!;
    this.getSingleClient(authToken,clientId);
    this.getAllIndent(this.authToken, this.limit, this.jobCategory, '',this.jobLocation, clientId, '','', this.recruiterId, this.candidateId, this.partnerId, this.skip);
  }

  getSingleClient(authToken: string, id: string): void {
    this.clientService.getSingleClient(authToken, id).subscribe(
      (res: any) => {
        this.clientList = res.result[0];

        if(this.clientList.pancardImage != ""){ 
          const fileExtensionPancard = this.clientList.pancardImage.split('.').pop()?.toLowerCase();
          if(fileExtensionPancard != 'pdf'){
            this.pancardImageUrl = environment.apiURL+''+this.clientList.pancardImage;
          }else{
            this.pancardImageUrl = '../assets/images/pdfpreview.png';
          }
        }

        if(this.clientList.gstinImage != null){ 
          const fileExtensionGst = this.clientList.gstinImage.split('.').pop()?.toLowerCase();
          if(fileExtensionGst != 'pdf'){
            this.gstImageUrl = environment.apiURL+this.clientList.gstinImage; 
          }else{
            this.gstImageUrl = '../assets/images/pdfpreview.png';
          }
        }

      },
      error => {
        // Handle error
      }
    );
  }

  getAllIndent(authToken: string, limit: string, category: string, searchQuery: string, searchLocationData: string, clientId: string, timePeriod: string, indentType: string, recruiterId: string, candidateId: string, partnerId: string, skip: number): void {
    this.clientService.getAllIndent(authToken, limit, category, searchQuery, searchLocationData, clientId, timePeriod, indentType, recruiterId, candidateId, partnerId, skip).subscribe(
      (res: any) => {
        this.indentList = res.result;
      }
    );
  }

}
