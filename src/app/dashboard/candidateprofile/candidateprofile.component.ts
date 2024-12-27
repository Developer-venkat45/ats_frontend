import { Component, inject, OnInit} from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { RouterModule } from '@angular/router';
import { JobDetailsResponse, category, Indent_type, total_record } from '../../core/model/model';
import { DatePipe} from '@angular/common';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-candidateprofile',
  standalone: true,
  imports: [PdfViewerModule,RouterModule,DatePipe,NgxSkeletonLoaderModule, CommonModule],
  templateUrl: './candidateprofile.component.html',
  styleUrl: './candidateprofile.component.css'
})
export class CandidateprofileComponent implements OnInit {
  indedentService = inject(DashboardService);
  apiURL:any;
  authToken:any="";
  candidateData : any | null = null;
  indentList: any [] = [];
  totalRecord: total_record[] = [];
  limit: any = 10;
  loader: boolean = true;
  // indentStaged:any;
  loginUserRole:any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.apiURL= environment.apiURL;
  }

  ngOnInit(): void {
    const candidateId:any = this.route.snapshot.paramMap.get('candidateId')!;
    this.authToken = localStorage.getItem('access_token');
    this.loginUserRole = localStorage.getItem('role_name');
    this.getSingleCandidate(this.authToken, candidateId);
    this.getAllIndent(this.authToken, '10', '', '', '', '', '', '', candidateId);
  }


  getSingleCandidate(authToken: string, candidateId: string): void {
    this.indedentService.getSingleCandidateDetails(authToken, candidateId).subscribe(
      (res: any) => {
        this.candidateData = res.result;
        // this.indentStaged = this.convertObjectToArray(this.candidateData?.stage);
        console.log("stage log"+this.candidateData);
      },
      error => {
        // Handle error
      }
    );
  }
  getAllIndent(authToken: string, limit: string, category: string, searchQuery: string, searchLocationData: string, clientId: string, timePeriod: string, indentType: string, candidateId: string): void {
    this.indedentService.getAppliedIndent(authToken, limit, category, searchQuery, searchLocationData, clientId, timePeriod, indentType, candidateId).subscribe(
      (res: any) => {
        this.indentList = res.result.applied_indents;
        this.totalRecord = res.result.no_of_applied_indents;
        this.loader = false;
        console.log(this.indentList)
      }
    );
  }

  convertObjectToArray(data: any): any[] {
    let resultArray: any[] = [];
  
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (Array.isArray(data[key])) {
          resultArray = resultArray.concat(data[key]);
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          resultArray = resultArray.concat(this.convertObjectToArray(data[key]));
        }
      }
    }
  
    return resultArray;
  }

  downloadPDF(pdfUrl:any, name: any) {
    const pdfName = name+'.pdf'; // Desired name for the downloaded PDF

    // Get the PDF as a Blob
    this.http.get(this.apiURL+pdfUrl, { responseType: 'blob' }).subscribe(blob => {
      // Create a link element
      const link = document.createElement('a');
      
      // Create a URL for the blob object
      const url = window.URL.createObjectURL(blob);
      
      // Set the href attribute to the blob URL and download attribute to the PDF name
      link.href = url;
      link.download = pdfName;

      // Programmatically trigger the click event
      link.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    });
  }
}
