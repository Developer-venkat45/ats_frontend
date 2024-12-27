import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { FormArray, FormBuilder, Form, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, ClientResponse, category,formList,recruiter } from '../../core/model/model';
import { Project } from '../../core/model/project_model';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { NgxEditorModule } from 'ngx-editor';
import { Editor, Toolbar } from 'ngx-editor';

import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';


import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-addindent',
  standalone: true,
  imports: [NgxEditorModule, ReactiveFormsModule, CommonModule, NavbarComponent, MatSelectModule, MatFormFieldModule, MatCheckboxModule, NgMultiSelectDropDownModule, FormsModule, SliderModule,ToastModule],
  templateUrl: './addindent.component.html',
  styleUrl: './addindent.component.css'
})

export class AddindentComponent implements OnInit {

  fb = inject(FormBuilder);
  private customValidator= new CustomValidatorComponent();

  jobTypeData: any [] = [];
  departmentData: any [] = [];
  locationData: any [] = [];
  businessUnitData: any [] = [];
  jobLevelData: any [] = [];
  jobFunctionData: any [] = [];
  jobSectorData: any [] = [];
  jobIndustryData: any [] = [];
  skillsData: any [] = [];
  assessmentData: any [] = [];
  eandiData: any [] = [];
  overallFormValid: string = "";
  clientNameSet:string = '';
  rangeValuesDisplay: number[] = [20, 60];
  degreeData: any [] = [];
  specializationData: any [] = [];
  levelData: any [] = [];
  qualityData: any [] = [];
  scJobIndustryData: any [] = [];
  clientData: any;
  jobCode:any;
  endiData: any;
  assessmentTab: boolean = false;
  aiscoreTab: boolean = true;
  eandiTab: boolean = true;
  recruiterData: any[] = [];
  partnerData:any[]=[];
  partnerData2:any[]=[];
  recruiterData2: any[] = [];

  dropdownList:any = [];
  dropdownSettings:IDropdownSettings={};
  isLoading: boolean = false;


  rangeValues2: number[] = [20, 60];

  indentForm = this.fb.group({
    indentStep1: this.fb.group({
      jobTitle: ['',[Validators.required,Validators.maxLength(150),this.customValidator.designationValidator()]],
      jobCode: [''],
      jobCategory: ['', Validators.required],
      jobClient: ['', Validators.required],
      jobClientSpoc: ['', Validators.required],
      hideClient: [false],
      referrals: [false],
      jobType: ['', Validators.required],
      department: ['', Validators.required],
      businessUnit: ['', Validators.required],
      jobLevel: [''],
      jobFunction: [''],
      jobSector: [''],
      jobIndustry: [''],
      recruiterList: [''],
      partnerList: [''],
      career: [true],
    }),
    indentStep2: this.fb.group({
      advLocation: ['',Validators.required],
      minSalary: ['',[Validators.required,Validators.pattern(/^[0-9]+$/)]],
      maxSalary: ['',[Validators.required,Validators.pattern(/^[0-9]+$/)]],
      negotiable: [false],
      salaryUnit: ['Annum',Validators.required],
      vacancies: ['',[Validators.required,this.customValidator.numberValidator()]],
      skilsList: ['',Validators.required],
      minExperience: [0,[Validators.required,this.customValidator.negativeValueValidator()]],
      maxExperience: [0,[Validators.required,this.customValidator.negativeValueValidator()]],
      jobDescription: ['',[Validators.required,Validators.maxLength(5000)]],
      clientDescription: ['',Validators.required],
      mustCriteria: ['',[Validators.maxLength(5000)]],
    },{ validators: [
        this.customValidator.maxGreaterThanMinValidator('minSalary', 'maxSalary'),
        this.customValidator.maxGreaterThanMinValidator('minExperience', 'maxExperience')
      ],
    }),
    indentStep3: this.fb.group({
      skills: this.fb.group({
        mustHaveSkills: ['',Validators.required],
        goodHaveSkills: ['',Validators.required],
      }),
      education: this.fb.group({
        scDegree: ['',Validators.required],
        scSpecialization: ['',Validators.required],
        scLevel: ['',Validators.required],
        scQuality: ['',Validators.required],
      }),
      experience: this.fb.group({
        scMinExperience: [0,[Validators.required,this.customValidator.negativeValueValidator()]],
        scMaxExperience: [0,[Validators.required,this.customValidator.negativeValueValidator()]],
        scPrvJobRole: ['',[this.customValidator.alphaNumaricValidator()]],
        scJobIndustry: [''],
        scPreEmp: ['',[this.customValidator.alphaNumaricValidator()]],
        scCompanyAge: [''],
        scCompanySize: [''],
      },{validators: [
        this.customValidator.maxGreaterThanMinValidator('scMinExperience', 'scMaxExperience'),

      ],}),
      scoring: this.fb.group({
        scSkillWeightage: [20, [Validators.required,this.customValidator.negativeValueValidator()]],
        scEducationWeightage: [60, [Validators.required,this.customValidator.negativeValueValidator()]],
        scExperienceWeightage: [20,[Validators.required,this.customValidator.numberValidator()]],
      }, { validators: this.customValidator.sumNotGreaterThan100Validator()}),
    }),
    indentStep4: this.fb.group({
      eandiId: ['', Validators.required],
      criteria: this.fb.group({
        greenMinScore: [70, [Validators.required, this.customValidator.numberValidator()]],
        greenMaxScore: [100, [Validators.required, this.customValidator.negativeValueValidator()]],
        amberMinScore: [50, [Validators.required, this.customValidator.numberValidator()]],
        amberMaxScore: [70, [Validators.required, this.customValidator.negativeValueValidator()]],
        redMinScore: [0, [Validators.required, this.customValidator.numberValidator()]],
        redMaxScore: [50, [Validators.required, this.customValidator.negativeValueValidator()]],
      },{validators: [
        this.customValidator.maxGreaterThanMinValidator2('greenMinScore', 'greenMaxScore'),
        this.customValidator.maxGreaterThanMinValidator2('amberMinScore', 'amberMaxScore'),
        this.customValidator.maxGreaterThanMinValidator2('redMinScore', 'redMaxScore'),
      ],}),
    }),
    indentStep5: this.fb.group({
      screening: this.fb.group({
        scored: this.fb.group({
          displayName: ['Scored'],
          status: [true],
          isSubmitted: [true],
        }),
        eandiDone: this.fb.group({
          displayName: ['E And I Done'],
          status: [true],
          isSubmitted: [true],
        }),
        manualAssessment: this.fb.group({
          displayName: ['Manual Assessment'],
          status: [false],
          isSubmitted: [true],
        }),
        onlineAssessment: this.fb.group({
          displayName: ['Online Assessment'],
          status: [false],
          isSubmitted: [true],
        }),
        calToAction: this.fb.group({
          displayName: ['CTA - Call to Action'],
          status: [false],
          isSubmitted: [false],
        }),
        selected: this.fb.group({
          displayName: ['Selected'],
          status: [true],
          isSubmitted: [false],
        }),
        rejected: this.fb.group({
          displayName: ['Rejected'],
          status: [true],
          isSubmitted: [false],
        }),
        hold: this.fb.group({
          displayName: ['Hold'],
          status: [true],
          isSubmitted: [false],
        }),
        shortList: this.fb.group({
          displayName: ['Shortlist Sent to Client'],
          status: [false],
          isSubmitted: [false],
        }),
        approvedShortList: this.fb.group({
          displayName: ['Client Approved Shortlist'],
          status: [false],
          isSubmitted: [false],
        }),
        rejectedShortList: this.fb.group({
          displayName: ['Client Rejected'],
          status: [false],
          isSubmitted: [false],
        }),
      }),
      interview: this.fb.group({
        scheduledCreated: this.fb.group({
          displayName: ['Scheduled Created'],
          status: [true],
          isSubmitted: [true],
        }),
        candidatesScheduled: this.fb.group({
          displayName: ['Candidates Scheduled'],
          status: [true],
          isSubmitted: [false],
        }),
        interviewAttended: this.fb.group({
          displayName: ['Interview Attended'],
          status: [true],
          isSubmitted: [false],
        }),
        interviewSelected: this.fb.group({
          displayName: ['Interview Selected'],
          status: [true],
          isSubmitted: [false],
        }),
        interviewRejected: this.fb.group({
          displayName: ['Interview Rejected'],
          status: [true],
          isSubmitted: [false],
        }),
        interviewHold: this.fb.group({
          displayName: ['Interview Hold'],
          status: [true],
          isSubmitted: [false],
        }),
        candidateRescheduled: this.fb.group({
          displayName: ['Candidate Rescheduled'],
          status: [true],
          isSubmitted: [false],
        }),
        candidateDropped: this.fb.group({
          displayName: ['Candidate Dropped'],
          status: [true],
          isSubmitted: [false],
        }),
      }),
      offer: this.fb.group({
        documentsSubmitted: this.fb.group({
          displayName: ['Documents Submitted / Collected'],
          status: [true],
          isSubmitted: [false],
        }),
        partialDocumentsSubmitted: this.fb.group({
          displayName: ['Partial Documents Submitted'],
          status: [true],
          isSubmitted: [false],
        }),
        documentsNotSubmitted: this.fb.group({
          displayName: ['Documents Not Submitted - Drop'],
          status: [true],
          isSubmitted: [false],
        }),
        offerReleased: this.fb.group({
          displayName: ['Offer Released - Acceptance Pending'],
          status: [true],
          isSubmitted: [false],
        }),
        offerAcceptance: this.fb.group({
          displayName: ['Offer Acceptance - Yet to Join'],
          status: [true],
          isSubmitted: [false],
        }),
        offerRejected: this.fb.group({
          displayName: ['Offer Rejected'],
          status: [true],
          isSubmitted: [false],
        }),
        offerHold: this.fb.group({
          displayName: ['Offer - Hold'],
          status: [true],
          isSubmitted: [false],
        }),
      }),
      hire: this.fb.group({
        joinedYet: this.fb.group({
          displayName: ['Joined - Yet to Complete Retention'],
          status: [true],
          isSubmitted: [false],
        }),
        joinedLeft: this.fb.group({
          displayName: ['Joined -& Left Within Retention'],
          status: [true],
          isSubmitted: [false],
        }),
        joinedCompleted: this.fb.group({
          displayName: ['Joined & Completed Retention'],
          status: [true],
          isSubmitted: [false],
        }),
      }),
    }),
    indentStep6: this.fb.group({
      assessmentType: [0],
      assessmentId: [''],
      assessmentCutScore: ['70'],
    }),
    rangeValues: [this.rangeValues2],
  });

  clientService = inject(DashboardService);
  clientList: ClientResponse [] = [];
  partnerList: any [] = [];
  projectService = inject(DashboardService);
  projectList: Project [] = [];
  indentService = inject(DashboardService);
  categoryData: category [] = [];
  assessmentList: any [] = [];
  selectedAssessment: any = null;


  isFormSubmited: boolean = false;
  apiMessage:any="";
  authToken:any="";
  file:any="";

  editor:any = Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  html = '';

  editor2:any = Editor;

  assessmentValue:any = 0;
  location: any = [];
  skils: any = [];
  recruter: any = [];

  constructor (private messageService: MessageService, private http: HttpClient){
    var usertype = localStorage.getItem("user");
  }



  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getRecruiter();
    //this.getAllClient(this.authToken);
    this.getAllClient();
    this.getAllCategory(this.authToken);
    this.getJobTypeData(this.authToken, 'job type');
    this.getDepartmentData(this.authToken, 'department');
    this.getLocationData(this.authToken);
    this.getBusinessUnitData(this.authToken, 'business unit');
    this.getJobLevelData(this.authToken, 'job level');
    this.getJobFunctionData(this.authToken, 'job function');
    this.getJobSectorData(this.authToken, 'sector');
    this.getJobIndustryData(this.authToken, 'job industry');
    this.getSkillsData(this.authToken, 'skills');
    this.getAllAssessmentName(this.authToken);
    this.getAlleandi(this.authToken,'','','');
    this.getAllPartner();


    this.dropdownList = [
      { item_id: "6651780e7aedb49b9fefd882", item_text: 'Recruiter' },
      { item_id: "6659ac42daa103fabb77fdae", item_text: 'Jhon Duke' },
    ];

    // console.log(this.dropdownList);

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll:false,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };

    this.editor = new Editor();
    this.editor2 = new Editor();


    this.indentForm.get('rangeValues')?.valueChanges.subscribe(values => {
      if (values !== null) {
        this.rangeValuesDisplay = values;
      }
    });

    this.degreeData = [
      {item_id: 'ssc', item_text: 'SSC/10th Class'},
      {item_id: 'undergraduate', item_text: 'Under Graduation'},
      {item_id: 'graduation', item_text: 'Graduation'},
      {item_id: 'postgraduation', item_text: 'Post Graduation'},
      {item_id: 'ba', item_text: 'B.A'},
      {item_id: 'bsc', item_text: 'Bachelor of Science (B.Sc)'},
      {item_id: 'bcom', item_text: 'B.Com'},
      {item_id: 'btech', item_text: 'Bachelor of Technology (B.Tech)'},
      {item_id: 'ba', item_text: 'B.A'},
      {item_id: 'bbm', item_text: 'BBM'},
      {item_id: 'bba', item_text: 'BBA'},
      {item_id: 'msc', item_text: 'Master of Science (M.Sc)'},
      {item_id: 'mcom', item_text: 'M.Com'},
      {item_id: 'mtech', item_text: 'Master of Technology (M.Tech)'},
      {item_id: 'mphil', item_text: 'M.Phil'},
      {item_id: 'mba', item_text: 'MBA'}
    ];

    this.specializationData = [
      {item_id: 'any-graduate', item_text: 'Any Graduation'},
      {item_id: 'any-post-graduate', item_text: 'Any Post Graduation'},
      {item_id: 'accounting and finance', item_text: 'Accounting and Finance'},
      {item_id: 'aeronautical engineering', item_text: 'Aeronautical Engineering'},
      {item_id: 'anthropology', item_text: 'Anthropology'},
      {item_id: 'applied arts', item_text: 'Applied Arts'},
      {item_id: 'art history', item_text: 'Art History'},
      {item_id: 'artificial intelligence', item_text: 'Artificial Intelligence'},
      {item_id: 'auditing', item_text: 'Auditing'},
      {item_id: 'automobile engineering', item_text: 'Automobile Engineering'},
      {item_id: 'banking and insurance', item_text: 'Banking and Insurance'},
      {item_id: 'biology', item_text: 'Biology'},
      {item_id: 'biomedical engineering', item_text: 'Biomedical Engineering'},
      {item_id: 'biotechnology', item_text: 'Biotechnology'},
      {item_id: 'botany', item_text: 'Botany'},
      {item_id: 'business analytics', item_text: 'Business Analytics'},
      {item_id: 'business analytics', item_text: 'Business Analytics'},
      {item_id: 'business law', item_text: 'Business Law'},
      {item_id: 'chemical engineering', item_text: 'Chemical Engineering'},
      {item_id: 'chemistry', item_text: 'Chemistry'},
      {item_id: 'civil engineering', item_text: 'Civil Engineering'},
      {item_id: 'cloud computing', item_text: 'Cloud Computing'},
      {item_id: 'computer science', item_text: 'Computer Science'},
      {item_id: 'computer science engineering', item_text: 'Computer Science Engineering'},
      {item_id: 'constitutional law', item_text: 'Constitutional Law'},
      {item_id: 'corporate law', item_text: 'Corporate Law'},
      {item_id: 'cost accounting', item_text: 'Cost Accounting'},
      {item_id: 'criminal law', item_text: 'Criminal Law'},
      {item_id: 'cybersecurity', item_text: 'Cybersecurity'},
      {item_id: 'data science', item_text: 'Data Science'},
      {item_id: 'database management', item_text: 'Database Management'},
      {item_id: 'economics', item_text: 'Economics'},
      {item_id: 'electrical engineering', item_text: 'Electrical Engineering'},
      {item_id: 'electronics & communication engineering', item_text: 'Electronics & Communication Engineering'},
      {item_id: 'english literature', item_text: 'English Literature'},
      {item_id: 'entrepreneurship', item_text: 'Entrepreneurship'},
      {item_id: 'environmental law', item_text: 'Environmental Law'},
      {item_id: 'environmental science', item_text: 'Environmental Science'},
      {item_id: 'family law', item_text: 'Family Law'},
      {item_id: 'finance', item_text: 'Finance'},
      {item_id: 'financial markets', item_text: 'Financial Markets'},
      {item_id: 'geography', item_text: 'Geography'},
      {item_id: 'graphic design', item_text: 'Graphic Design'},
      {item_id: 'history', item_text: 'History'},
      {item_id: 'human resource management', item_text: 'Human Resource Management'},
      {item_id: 'information technology', item_text: 'Information Technology'},
      {item_id: 'intellectual property law', item_text: 'Intellectual Property Law'},
      {item_id: 'international business', item_text: 'International Business'},
      {item_id: 'international law', item_text: 'International Law'},
      {item_id: 'journalism & mass communication', item_text: 'Journalism & Mass Communication'},
      {item_id: 'labor law', item_text: 'Labor Law'},
      {item_id: 'logistics and supply chain management', item_text: 'Logistics and Supply Chain Management'},
      {item_id: 'marketing', item_text: 'Marketing'},
      {item_id: 'mathematics', item_text: 'Mathematics'},
      {item_id: 'mechanical engineering', item_text: 'Mechanical Engineering'},
      {item_id: 'microbiology', item_text: 'Microbiology'},
      {item_id: 'mobile application development', item_text: 'Mobile Application Development'},
      {item_id: 'network administration', item_text: 'Network Administration'},
      {item_id: 'operations management', item_text: 'Operations Management'},
      {item_id: 'painting', item_text: 'Painting'},
      {item_id: 'philosophy', item_text: 'Philosophy'},
      {item_id: 'photography', item_text: 'Photography'},
      {item_id: 'physics', item_text: 'Physics'},
      {item_id: 'political science', item_text: 'Political Science'},
      {item_id: 'printmaking', item_text: 'Printmaking'},
      {item_id: 'psychology', item_text: 'Psychology'},
      {item_id: 'sculpture', item_text: 'Sculpture'},
      {item_id: 'sociology', item_text: 'Sociology'},
      {item_id: 'software development', item_text: 'Software Development'},
      {item_id: 'taxation', item_text: 'Taxation'},
      {item_id: 'textile design', item_text: 'Textile Design'},
      {item_id: 'tourism and hospitality management', item_text: 'Tourism and Hospitality Management'},
      {item_id: 'web development', item_text: 'Web Development'},
      {item_id: 'zoology', item_text: 'Zoology'}
    ];

    this.levelData = [
      {item_id: 'ssc', item_text: 'SSC/10th Class'},
      {item_id: 'undergraduate', item_text: 'Under Graduation'},
      {item_id: 'graduation', item_text: 'Graduation'},
      {item_id: 'postgraduation', item_text: 'Post Graduation'}
    ];

    this.qualityData = [
      { item_id: "tier1", item_text: 'Tier 1 Institutions' },
      { item_id: "tier2", item_text: 'Tier 2 Institutions' },
      { item_id: "tier3", item_text: 'Tier 3 Institutions' },
    ];

  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor2.destroy(); 
  }


  onCheckboxChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const assessmentreqired = this.indentForm.controls.indentStep6.get('assessmentId');
    const assessmentCutScorerequired = this.indentForm.controls.indentStep6.get('assessmentCutScore');
    console.log('Checkbox value changed:', checked);
    if(checked){
      this.assessmentTab = true;
      assessmentreqired?.setValidators([Validators.required]);
      assessmentCutScorerequired?.setValidators([Validators.required]);
    }else{
      this.assessmentTab = false;
      assessmentreqired?.clearValidators();
      assessmentCutScorerequired?.clearValidators();
    }
    assessmentreqired?.updateValueAndValidity();
    assessmentCutScorerequired?.updateValueAndValidity();
  }

  onScoredChanged(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const template = this.indentForm.controls.indentStep4.get('eandiId');
    if(checked){
      this.aiscoreTab = true;
      template?.setValidators([Validators.required]);
      
    }else{
      this.aiscoreTab = false;
      template?.clearValidators();
    }
    template?.updateValueAndValidity();
  }

  onEandiChanged(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if(checked){
      this.eandiTab = true;
    }else{
      this.eandiTab = false;
    }
  }




  async onSubmit() {
    this.isFormSubmited = true;
    const data = this.indentForm.value;
    console.log(data)
    this.authToken = localStorage.getItem('access_token');
    this.isLoading = true;

    if (this.indentForm.valid) {
      const url = `${environment.apiURL}indent/indent_creation`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.indentForm.reset();
              this.isLoading = false;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data inserted' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
              this.isLoading = false;
            }
          },
          error => {
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while submitting the form.' });
            this.isLoading = false;
          }
        );
      this.overallFormValid = '';
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
      this.isLoading = false;
    }
  }


  greenCriteriaChange(){
    var green = this.indentForm.controls.indentStep4.controls.criteria.get('greenMinScore')?.value;
    var amber = this.indentForm.controls.indentStep4.controls.criteria.get('amberMinScore')?.value;
    var red = this.indentForm.controls.indentStep4.controls.criteria.get('redMinScore')?.value;
    this.indentForm.controls.indentStep4.controls.criteria.patchValue({amberMaxScore: green})
  }

  amberCriteriaChange(){
    var green = this.indentForm.controls.indentStep4.controls.criteria.get('greenMinScore')?.value;
    var amber = this.indentForm.controls.indentStep4.controls.criteria.get('amberMinScore')?.value;
    var red = this.indentForm.controls.indentStep4.controls.criteria.get('redMinScore')?.value;
    this.indentForm.controls.indentStep4.controls.criteria.patchValue({redMaxScore: amber})
  }

  redCriteriaChange(){
    var green = this.indentForm.controls.indentStep4.controls.criteria.get('greenMinScore')?.value;
    var amber = this.indentForm.controls.indentStep4.controls.criteria.get('amberMinScore')?.value;
    var red = this.indentForm.controls.indentStep4.controls.criteria.get('redMinScore')?.value;
    // this.indentForm.controls.indentStep4.controls.criteria.patchValue({amberMaxScore: green})
  }



  // onSliderChange(event: any): void{
  //   const skilsValue = this.indentForm.controls.rangeValues.value;
  //   if(skilsValue){
  //     this.indentForm.controls.indentStep3.controls.scoring.patchValue({
  //       scSkillWeightage: skilsValue[0],
  //       scEducationWeightage: skilsValue[1],
  //       scExperienceWeightage: (100 - (skilsValue[0] + skilsValue[1]))
  //     });
  //     if(skilsValue[0]<10){
        
  //     }
      
  //   }
  // }






  getAllAssessment(authToken: string, id:string, title: string, category: string): void {
    this.clientService.getAllAssessment(authToken, id, title, category).subscribe(
      (res: APIResponseModelGrid) => {
        this.assessmentList = res.result;
      },
      error => {
        // Handle error
      }
    );
  }



  onSelectAssessment(event: any): void {
    const selectedTitle = event.target.value;
    this.getAllAssessmentSingle(this.authToken,selectedTitle);
  }

  getEandI(event: any): void{
    const selectedTitle = event.target.value;
    this.getAlleandi2(this.authToken,selectedTitle,'','');
  }


  getAlleandi2(authToken: string,id:string,title:string,category:string): void {
    this.clientService.getAlleandi(authToken,id,title,category).subscribe(
      (res: any) => {
        this.endiData = res.result[0];
        console.log(this.endiData);
      },
      error => {
        // Handle error
      }
    );
  }




  getClientSpoc(event: any): void{
    const selectedClient = event.target.value;
    this.getSingleClient(this.authToken,selectedClient);
  }

  getSingleClient(authToken: string, id: string): void {
    this.clientService.getSingleClient(authToken, id).subscribe(
      (res: any) => {
        this.clientData = res.result;
        //console.log(this.clientData);
        this.indentForm.controls.indentStep2.patchValue({
          clientDescription: res.result[0].description
        });
        this.getJobCode(this.clientData[0].shortName);
      },
      error => {
        // Handle error
      }
    );
  }

  getJobCode(jobCode: string): void {
    this.clientService.getJobCode(jobCode).subscribe(
      (res: any) => {
        this.jobCode = res.data;
        console.log(this.jobCode);
        this.indentForm.controls.indentStep1.patchValue({
          jobCode: res.data.job_code
        });
      },
      error => {
        // Handle error
      }
    );
  }


  // getAllClient(authToken: string): void {
  //   this.clientService.getAllClient(authToken,'', '', '', '1','500').subscribe(
  //     (res: APIResponseModelGrid) => {
  //       this.clientList = res.result;
  //     },
  //     error => {
  //       // Handle error
  //     }
  //   );
  // }

  getAllClient(): void {
    this.indentService.getAllClientList().subscribe(
      (res: any) => {
        this.clientList = res.result;
      },
      error => {
        // Handle error
      }
    );
  }



  getJobTypeData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.jobTypeData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }


  getDepartmentData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.departmentData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }


  getLocationData(authToken: string): void {
    this.clientService.getAllLocation(authToken).subscribe(
      (res: any) => {
        this.locationData = res.data[0].cityArr;
      },
      error => {
        // Handle error
      }
    ); 
  }


  getBusinessUnitData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.businessUnitData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }


  getJobLevelData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.jobLevelData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }


  getJobFunctionData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.jobFunctionData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }

  getJobSectorData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.jobSectorData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }


  getJobIndustryData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.jobIndustryData = res.data;
        this.scJobIndustryData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }

  getSkillsData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.skillsData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }


  getAllAssessmentName(authToken: string): void {
    this.clientService.getAllAssessmentName(authToken).subscribe(
      (res: any) => {
        this.assessmentData = res.result;
      },
      error => {
        // Handle error
      }
    );
  }

  getAlleandi(authToken: string,id:string,title:string,category:string): void {
    this.clientService.getAlleandi(authToken,id,title,category).subscribe(
      (res: any) => {
        this.eandiData = res.result;
      },
      error => {
        // Handle error
      }
    );
  }


  assessment(assessment: any){
    this.assessmentValue = assessment;
  }



  getAllAssessmentSingle(authToken: string, assessmentId: string): void {
    this.clientService.getAllAssessmentSingle(authToken,assessmentId).subscribe(
      (res: APIResponseModelGrid) => {
        this.assessmentList = res.result;
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
      },
      error => {

      }
    );
  }

  getRecruiter(): void{
    this.indentService.getAllRecruiterList().subscribe(
      (res:any)=>{
        this.recruiterData = res.result.map((re: any) => ({
          item_id: re._id,
          item_text: re.name
        }));
        console.log(this.recruiterData);
      },
      error => {

      }
    );
  }


  getAllPartner(): void{
    this.indentService.getAllPartnerList().subscribe(
      (res:any)=>{
        this.partnerData = res.result.map((re: any) => ({
          item_id: re._id,
          item_text: re.vendorName+'('+re.firmName+')'
        }));
      },
      error => {

      }
    );
  }

  // graterthan(){
  //   const value1 = this.indentForm.controls.indentStep3.controls.scoring.get('scSkillWeightage')?.value||0;
  //   const value2 = this.indentForm.controls.indentStep3.controls.scoring.get('scEducationWeightage')?.value||0;
  //   const value3 =  this.indentForm.controls.indentStep3.controls.scoring.get('scExperienceWeightage')?.value||0;
  //   const addsum = (Number(value1)||0)+(Number(value2)||0)+Number((value3)||0);
  //   if(addsum>100){
  //     this.validationmessage1 = 'Total weightage should be not more than 100.';
  //   }else{
  //     this.validationmessage1 = '';
  //   }
  // }
}
