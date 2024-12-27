import { Component, OnInit, inject, ViewChild  } from '@angular/core';
import { DashboardService } from '../core/service/dashboard.service';
import { JobDetailsResponse, category, Indent_type } from '../core/model/model';
import { NavbarComponent } from '../reusable/navbar/navbar.component';
import { IndentComponent } from '../reusable/indent/indent.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [NavbarComponent, IndentComponent, FormsModule, TooltipModule, RouterModule,NgxSkeletonLoaderModule],
  templateUrl: './job.component.html',
  styleUrl: './job.component.css'
})


export class JobComponent {
  indentService = inject(DashboardService);
  authToken: any = null;
  categoryData: category [] = []; 
  limit: any = 10;
  skip: number = 0;
  searchTerm: string = '';
  searchLocationData: string = '';
  indentTypeData: Indent_type[] = [];
  jobTypeData: any [] = [];
  searchCategory: any='';
  searchClient: string = '';
  searchIndentType: any = '';
  selectedTimePeriod: string  = '';
  clientList: any [] = [];
  recruiterId: any = '';
  candidateId: any = '';
  loginUserId: any;
  myProfileData: any;
  jobTitle: any = '';
  jobLocation: any = '';
  partnerId: any = '';
  partnerList: any;
  checkPrtnerProfile: boolean = true;
  loader: boolean = true;
  allIndentDataShow: boolean = true;

  @ViewChild(IndentComponent) indentComponent!: IndentComponent;

  constructor(private route: ActivatedRoute) { 
    this.loginUserId = localStorage.getItem('id');
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.searchTerm = this.route.snapshot.paramMap.get('jobTitle')!;
    this.searchLocationData = this.route.snapshot.paramMap.get('jobLocation')!;
    localStorage.setItem('prevoius', 'jobs');

    this.getAllCategory(this.authToken);
    this.getJobTypeData(this.authToken, 'job type');
    this.getAllClient();

    const user: any = localStorage.getItem('user');
    if(user == 'Candidate'){
      this.getUserCandidateData(this.authToken,this.loginUserId);
    }
    if(user == 'Partner SPOC - Manager'){
      this.partnerId = localStorage.getItem('partner_id');
      this.getPartner(this.authToken,this.partnerId);
    }
    

    if(this.jobTitle != null){
      this.searchTerm = this.jobTitle;
    }else{
      this.searchTerm = '';
    }
    if(this.jobLocation != null){
      this.searchLocationData = this.jobLocation;
    }else{
      this.searchLocationData = '';
    }

    this.route.queryParams.subscribe(params => {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          if (key.startsWith('utm_')) {
            localStorage.setItem('user_source', params[key]);
          }
        }
      }
      const source = params['platform'] || params['job_platform'];
      if(source){
        localStorage.setItem('user_source', source);
      }
    });
    
  }

  getPartner(authToken: string, id: string): void {
    this.indentService.getSinglePartner(authToken, id).subscribe(
      (res: any) => {
        this.partnerList = res.result[0];
        this.checkPrtnerProfile = this.partnerList.isSubmited;
        this.loader = false;
      },
      error => {
        // Handle error
      }
    );
  }

  getUserCandidateData(authToken: string, id: string): void {
    this.indentService.getUserCandidateData(authToken, id).subscribe(
      (res: any) => {
        this.myProfileData = res.result;
        this.candidateId = this.myProfileData?._id;

        if(this.myProfileData?.resume_path == '' || this.myProfileData?.resume_path == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.dob == '' || this.myProfileData?.dob == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.highestQualification == '' || this.myProfileData?.highestQualification == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.highestQualificationPassedOn == '' || this.myProfileData?.highestQualificationPassedOn == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.highestQualificationPercentage === '' || this.myProfileData?.highestQualificationPercentage === null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.totWorkExp == '' || this.myProfileData?.totWorkExp == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.gender == '' || this.myProfileData?.gender == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.city == '' || this.myProfileData?.city == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.skills == '' || this.myProfileData?.skills == null){
          this.allIndentDataShow = false;
        }

        if(this.myProfileData?.education == '' || this.myProfileData?.education == null){
          this.allIndentDataShow = false;
        }
      },
      error => {
        // Handle error
      }
    );
  }


  getAllClient(): void {
    this.indentService.getAllClientList().subscribe(
      (res: any) => {
        this.clientList = res.result;
        this.loader = false;
      },
      error => {
        // Handle error
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
  


  getClient(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchClient = selectedValue;
    this.indentComponent.getAllIndent(this.authToken, this.limit, this.searchCategory, this.searchTerm, this.searchLocationData, this.searchClient, this.selectedTimePeriod, this.searchIndentType, this.recruiterId, this.candidateId, this.partnerId, this.skip);
    this.indentComponent.loader = true;
  }

  getCategory(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchCategory = selectedValue;
    this.indentComponent.getAllIndent(this.authToken, this.limit, this.searchCategory, this.searchTerm, this.searchLocationData, this.searchClient, this.selectedTimePeriod, this.searchIndentType, this.recruiterId, this.candidateId, this.partnerId, this.skip);
    this.indentComponent.loader = true;
  }

  getIndentTypeJob(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchIndentType = selectedValue;
    this.indentComponent.getAllIndent(this.authToken, this.limit, this.searchCategory, this.searchTerm, this.searchLocationData, this.searchClient, this.selectedTimePeriod, this.searchIndentType, this.recruiterId, this.candidateId, this.partnerId, this.skip);
    this.indentComponent.loader = true;
  }

  searchQuery(): void {
    this.searchTerm = this.searchTerm;
    this.indentComponent.getAllIndent(this.authToken, this.limit, this.searchCategory, this.searchTerm, this.searchLocationData, this.searchClient, this.selectedTimePeriod, this.searchIndentType, this.recruiterId, this.candidateId, this.partnerId, this.skip);
    this.indentComponent.loader = true;
  }

  searchLocation(): void{
    if (this.searchLocationData !== null && this.searchLocationData.trim() !== '') {
      this.searchLocationData = this.searchLocationData;
    }
    this.indentComponent.getAllIndent(this.authToken, this.limit, this.searchCategory, this.searchTerm, this.searchLocationData, this.searchClient, this.selectedTimePeriod, this.searchIndentType, this.recruiterId, this.candidateId, this.partnerId, this.skip);
    this.indentComponent.loader = true;
  }

  onCheckboxChange(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
  }


  onRadioChange(value: string) {
    const selectedTimePeriod = value;
    this.selectedTimePeriod = selectedTimePeriod;
    this.indentComponent.getAllIndent(this.authToken, this.limit, this.searchCategory, this.searchTerm, this.searchLocationData, this.searchClient, this.selectedTimePeriod, this.searchIndentType, this.recruiterId, this.candidateId, this.partnerId, this.skip);
    this.indentComponent.loader = true;
  }

  onSearchSubmit(){
    if (this.searchClient || this.searchCategory || this.searchIndentType || this.searchTerm || this.selectedTimePeriod || this.searchLocationData){
      this.indentComponent.getAllIndent(this.authToken, this.limit, this.searchCategory, this.searchTerm, this.searchLocationData, this.searchClient, this.selectedTimePeriod, this.searchIndentType, this.recruiterId, this.candidateId, this.partnerId, this.skip);
      this.indentComponent.loader = true;
    }else{
      this.indentComponent.loader = false;
      this.searchClient = '';
      this.searchCategory = '';
      this.searchIndentType = '';
      this.searchTerm = '';
      this.searchLocationData = '';
      this.selectedTimePeriod = '';
    }
  }

  resetFilter(){
    this.searchClient = '';
    this.searchCategory = '';
    this.searchTerm = '';
    this.searchLocationData = '';
    this.searchIndentType = '';
    this.selectedTimePeriod = '';
    this.indentComponent.getAllIndent(this.authToken, this.limit, '', '', '', '', '','', this.recruiterId, this.candidateId, this.partnerId, this.skip);
  }

}
