import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule,NavigationExtras, ActivatedRoute } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-recruite',
  standalone: true,
  imports: [FormsModule,CommonModule],
  providers: [DatePipe],
  templateUrl: './recruite.component.html',
  styleUrl: './recruite.component.css'
})
export class RecruiteComponent {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  selectedFiles: File[] = [];
  project: string = '';
  isUploading:boolean=false;

  uploadvisible:boolean=true;
  candidatesvisible:boolean=false;

  maxScore = 10;
  canid:any;
  allSelected = false;
  selectedCandidates: any[] = [];
  authToken: any = "";
  showFirstNameInput:boolean = true;
  showLastNameInput:boolean = true;
  showMobileInput:boolean = true;
  showEmailInput:boolean = true;
  showFatherNameInput:boolean = true;
  showDobInput:boolean = true;
  showGenderInput:boolean = true;
  showAddresssInput:boolean=true;
  showStatesInput:boolean=true;
  showCityInput:boolean=true;
  showTotalExperienceInput:boolean=true;
  showTotalQualificationInput:boolean=true;
  showTotalPassedInput:boolean=true;
  showTotalPercentageInput:boolean=true;
  showTotalqualification_InstituteInput:boolean=true;
  showTotalLatest_CompanyInput:boolean=true;
  showTotalDesignationInput:boolean=true;
  showTotalStartDateInput:boolean=true;
  showTotalWorkingStatusInput:boolean=true;
  showTotalIndustryInput:boolean=true;

  resultData = [
    {
        "status": true,
        "data": {
            "candidates_bulk": "66587be2808c08a329a580ba",
            "project": "667118c472cb4dc0c1cd439c",
            "resume_path": "static/documents/resumes/667118c472cb4dc0c1cd439c\\Durga's Resume (3) (2) - Copy - Copy.pdf",
            "name": "Durga Prasad",
            "fatherName": null,
            "gender": null,
            "address": null,
            "state": null,
            "city": null,
            "dob": null,
            "totWorkExp": null,
            "email": "kanuri.durgaprasad1997@gmail.com",
            "mobile": "9390656818",
            "candid": "66587be2808c08a329a580ba",
            "score": 8,
            "strengths": [
                "Experienced Senior Developer with a passion for crafting clean, efficient, and scalable code.",
                "Track record of delivering high-quality web applications and solutions.",
                "Strong analytical skills and a commitment to staying updated with the latest technologies.",
                "Expertise in full-stack development, including Python, Java, and JavaScript.",
                "Proven ability to architect scalable applications, optimize code for performance, and integrate cutting-edge technologies.",
                "Experience in handling complex problems and delivering elegant solutions."
            ],
            "candidate_summary": "Durga Prasad is a seasoned Software Developer with extensive expertise in full-stack development. With a strong foundation in Python, Java, and JavaScript, he has spearheaded the end-to-end development of complex software solutions. His track record includes architecting scalable applications, optimizing code for performance, and integrating cutting-edge technologies to drive innovation.",
            "duplicate_uploads": false,
            "duplicate_db": true
        }
    },
    {
        "status": true,
        "data": {
            "candidates_bulk": "66587be2808c08a329a580ba",
            "project": "667118c472cb4dc0c1cd439c",
            "resume_path": "static/documents/resumes/667118c472cb4dc0c1cd439c\\Durga's Resume (3) (2) - Copy.pdf",
            "name": null,
            "fatherName": null,
            "gender": null,
            "address": null,
            "state": null,
            "city": null,
            "dob": null,
            "totWorkExp": null,
            "email": "kanuri.durgaprasad1997@gmail.com",
            "mobile": "9390656818",
            "candid": "66587be2808c08a329a580ba",
            "score": 7,
            "strengths": [
                "Proven experience as a Senior Software Developer with expertise in full-stack development and an ability to conceptualize and deploy complex software solutions.",
                "Strong foundation in programming languages such as Python, Java, and JavaScript  along with proficiency in handling DevOps tools and bleeding-edge technologies.",
                "Adept in designing scalable applications, optimizing code for performance, and integrating cutting-edge technologies to drive innovation.",
                "Proven ability to work independently and as part of a collaborative team, effectively tackling challenges and delivering elegant solutions that exceed expectations."
            ],
            "candidate_summary": "Durga Prasad is a highly skilled and experienced Senior Software Developer with a strong foundation in full-stack development. With a proven track record of success in delivering high-quality web applications and solutions, Durga brings expertise in various programming languages and technologies, including Python, Java, JavaScript,AWS, MongoDB, and MySQL.  He is passionate about crafting clean, efficient, and scalable code and thrives in collaborative environments where innovation and problem-solving are valued.",
            "duplicate_uploads": true,
            "duplicate_db": true
        }
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params: { [x: string]: any; }) => {
      this.project = params['jobid'];
    });
    this.authToken = localStorage.getItem('access_token');
  }

  // onFileSelected(event: any) {
  //   const files = event.target.files as File[];
  //   this.selectedFiles = Array.from(files).filter(file => file.type === 'application/pdf');
  // }


  onFileSelected(event: any) {
    const files = event.target.files as File[];
    this.selectedFiles = Array.from(files).filter(file => file.type === 'application/pdf');
  }

  async onSubmit() {
    this.isUploading=true;
    if (this.selectedFiles.length === 0 || !this.project) {
      this.isUploading=false;
      console.error("Please select atleast one resume");
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('input_files', file, file.webkitRelativePath);
    });
    formData.append('project', this.project);

    // Log FormData content to check if files and project are appended
    formData.forEach((value, key) => {
      //console.log(key, value);
    });

    try {
      const response = await fetch(environment.apiURL+'resumes', {
        method: 'POST',
        body: formData,
      });
      //console.log(response);

      if (!response.ok) {
        this.isUploading=false;
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const outresult = await response.json();
      //console.log('Success:', outresult);
      this.isUploading=false;
      // Clear the selected files and reset the input field
      this.selectedFiles = [];
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }

      if(outresult.status == 1){
        console.log(outresult);
        this.canid = outresult.result;
        console.log(this.canid);

        this.uploadvisible=false;
        this.candidatesvisible=true;
        // await this.router.navigate([`/candidates_preview/`]);
      }


    } catch (error) {
      this.isUploading=false;
      console.error('Error - 10:', error);
    }
  }


  getScorePercentage(score: number | undefined): string {

    if (score !== undefined && score !== null) {
      return ((score / this.maxScore) * 100).toFixed(2) + '%';
    } else {
      return 'N/A';
    }
  }



  toggleSelection(candidate: any) {

    const index = this.selectedCandidates.indexOf(candidate);
    if (index > -1) {
      this.selectedCandidates.splice(index, 1);
    } else {
      this.selectedCandidates.push(candidate);
    }
    this.updateAllSelected();
  }

  toggleSelectAll(event: Event) {

    const isChecked = (event.target as HTMLInputElement).checked;
    this.allSelected = isChecked;
    if (isChecked) {
      this.selectedCandidates = [...this.resultData];
    } else {
      this.selectedCandidates = [];
    }
  }

  isSelected(candidate: any): boolean {

    return this.selectedCandidates.includes(candidate);
  }

  private updateAllSelected() {

    this.allSelected = this.selectedCandidates.length === this.resultData.length;
  }

  submitSelection() {

    console.log('Selected Candidates:', this.selectedCandidates);
    const incompleteCandidates = this.selectedCandidates.filter(candidate => {
      return !candidate.data.email ;
    });


    // return !candidate.data.name || !candidate.data.email || !candidate.data.mobile || !candidate.data.fatherName || !candidate.data.dob || !candidate.data.gender ||
    //          !candidate.data.address || !candidate.data.state || !candidate.data.city || !candidate.data.totWorkExp;
    //const incompleteCandidates = [{"fsfs": "sggsgs"}];

    if (incompleteCandidates.length > 0) {
      alert('Please fill all the required fields for the selected candidates2.');
      incompleteCandidates.forEach(candidate => {
        this.toggleSelection(candidate);
      });
      return;
    }

    const payload = {
      candidatesdata: this.selectedCandidates,
    };


    fetch(environment.apiURL+'save_candidates', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      if(data.status==1){
        this.router.navigate(['/job_details/'+this.project]);
      }
    })
    .catch(error => {
      console.error('Error: 20', error);
    });

  }


  async saveDob(cand:any){

    console.log(cand);

  }

  async saveGender(cand:any){

    console.log(cand);

  }

  async submitCandidate(candidateId:any) {

    const candidate = this.canid.find((cand: any) => cand.data.candidates_bulk === candidateId);
    console.log(candidate);

    if (!candidate) {
      alert('Candidate not found.');
      return;
    }

    // if (!candidate.data.name || !candidate.data.mobile || !candidate.data.email ||
    //     !candidate.data.fatherName || !candidate.data.dob || !candidate.data.gender || !candidate.data.address ||
    //     !candidate.data.state || !candidate.data.city || !candidate.data.totWorkExp) {
    //       alert(`Please fill all the required fields for the this candidate ${candidate.data.name}`);
    //       return;
    // }


    this.showFirstNameInput = false;
    this.showLastNameInput = false;
    this.showMobileInput = false;
    this.showEmailInput = false;
    this.showFatherNameInput = false;
    this.showDobInput = false;
    this.showGenderInput = false;
    this.showAddresssInput=false;
    this.showStatesInput=false;
    this.showCityInput=false;
    this.showTotalExperienceInput=false;
    this.showTotalPassedInput=false;
    this.showTotalQualificationInput=false;
    this.showTotalPercentageInput=false;
    this.showTotalqualification_InstituteInput=false;
    this.showTotalLatest_CompanyInput=false;
    this.showTotalDesignationInput=false;
    this.showTotalStartDateInput=false;
    this.showTotalWorkingStatusInput=false;
    this.showTotalIndustryInput=false;
  }

  async updateCandidate(candidateId:any){

    this.submitCandidate(candidateId);
  }

  async opencandexits(candidateId:any){

  }


  dateconvert(isoString: string): string {

    const date = new Date(isoString);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

}
