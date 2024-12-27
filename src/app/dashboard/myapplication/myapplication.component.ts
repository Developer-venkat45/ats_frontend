import { Component, OnInit, inject  } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { JobDetailsResponse, category, Indent_type, total_record } from '../../core/model/model';
import { indentDetails } from '../../core/model/indent_model';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { IndentComponent } from '../../reusable/indent/indent.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DatePipe} from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-myapplication',
  standalone: true,
  imports: [NavbarComponent, IndentComponent, FormsModule, TooltipModule, NgxSkeletonLoaderModule, DatePipe, RouterModule,CommonModule],
  templateUrl: './myapplication.component.html',
  styleUrl: './myapplication.component.css'
})
export class MyapplicationComponent {
  indentService = inject(DashboardService);
  authToken: any = null;
  categoryData: category [] = []; 
  limit: any = 10;
  searchTerm: string = '';
  searchLocationData: string = '';
  indentTypeData: Indent_type[] = [];
  jobTypeData: any [] = [];
  searchCategory: any;
  searchIndentType: any;

  indentList: any [] = [];
  totalRecord: number =0;
  loaderCount: number = 10;
  loader: boolean = true;
  baseAPIURL:any;
  myProfileData: any;
  loginUserId: any;
  detailsLink: boolean = true;
  total_record:any;

  constructor(private route: ActivatedRoute) { 
    this.loginUserId = localStorage.getItem('id');
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getAllCategory(this.authToken);
    this.getIndentType(this.authToken);
    this.getJobTypeData(this.authToken, 'job type');
    this.baseAPIURL= environment.apiURL;
    if(localStorage.getItem('role_name') != 'Candidate'){
      this.getAllIndent(this.authToken, this.limit, '', '', '', '', '', '', this.route.snapshot.paramMap.get('id')!);
      this.detailsLink = false;
    }else{
    this.getUserCandidateData(this.authToken,this.loginUserId);
    }
  }


  onSelectChange(event: Event): void {
    const limit = (event.target as HTMLSelectElement).value;
    this.getAllIndent(this.authToken, limit, '', '', '', '', '', '', '');
  }

  // Helper method to create an array of numbers
  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  getUserCandidateData(authToken: string, id: string): void {
    this.indentService.getUserCandidateData(authToken, id).subscribe(
      (res: any) => {
        this.myProfileData = res.result;
        this.getAllIndent(this.authToken, this.limit, '', '', '', '', '', '', this.myProfileData?._id);
      },
      error => {
        // Handle error
      }
    );
  }

  getAllIndent(authToken: string, limit: string, category: string, searchQuery: string, searchLocationData: string, clientId: string, timePeriod: string, indentType: string, candidateId: string): void {
    this.indentService.getAppliedIndent(authToken, limit, category, searchQuery, searchLocationData, clientId, timePeriod, indentType, candidateId).subscribe(
      (res: any) => {
        if(res.status ==1){
          this.indentList = res.result.applied_indents;
          this.totalRecord = res.result.total_record;
          this.loader = false;
        }else{
          this.indentList =[];
          this.totalRecord = 0
          this.loader = false;
        }
        
       
      }
    );
  }


  getAllCategory(authToken: string): void{
    this.indentService.getAllCategory(this.authToken).subscribe(
      (res:any)=>{
        this.categoryData = res;
      }
    );
  }


  
  getIndentType(authToken: string): void{
    this.indentService.getIndentType(this.authToken).subscribe(
      (res: any)=>{
        this.indentTypeData = res.indent_types[0];
        //console.log(this.indentTypeData);
      }
    );
  }

  getJobTypeData(authToken: string, master: string): void {
    this.indentService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.jobTypeData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }
  


  getCategory(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    //this.indentComponent.getAllIndent(this.authToken, this.limit, selectedValue, '', '', '', '');
  }

  getIndentTypeJob(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    //this.indentComponent.getAllIndent(this.authToken, this.limit, selectedValue, '', '', '', '');
  }

  searchQuery(): void {
    this.searchTerm = this.searchTerm;
    //this.indentComponent.getAllIndent(this.authToken, this.limit, '', this.searchTerm, '', '', '');
  }

  searchLocation(): void{
    if (this.searchLocationData !== null && this.searchLocationData.trim() !== '') {
      this.searchLocationData = this.searchLocationData;
    }
    //this.indentComponent.getAllIndent(this.authToken, this.limit, '', this.searchTerm, this.searchLocationData, '', '');
  }

  onCheckboxChange(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(selectedValue);
  }


  onRadioChange(value: string) {
    const selectedTimePeriod = value;
    //this.indentComponent.getAllIndent(this.authToken, this.limit, '', this.searchTerm, this.searchLocationData, '', selectedTimePeriod);
  }


  resetFilter(){
    this.searchCategory = '';
    this.searchTerm = '';
    this.searchLocationData = '';
    this.searchIndentType = '';
    //this.indentComponent.getAllIndent(this.authToken, this.limit, '', '', '', '', '');
  }

}
