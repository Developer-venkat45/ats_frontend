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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { NgxEditorModule } from 'ngx-editor';
import { Editor, Toolbar } from 'ngx-editor';

import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';


import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editindent',
  standalone: true,
  imports: [NgxEditorModule, ReactiveFormsModule, CommonModule, NavbarComponent, MatSelectModule, MatFormFieldModule, MatCheckboxModule, NgMultiSelectDropDownModule, FormsModule, SliderModule,ToastModule,AutoCompleteModule],
  templateUrl: './editindent.component.html',
  styleUrl: './editindent.component.css'
})
export class EditindentComponent implements OnInit{

  fb = inject(FormBuilder);
  private customValidator= new CustomValidatorComponent();

  jobTypeData: any [] = [];
  indentData: any | null = null;
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

  filteredLocations: any[] = [];
  filteredSkills: any[] = [];
  
  clientData: any;
  endiData: any;
  assessmentTab: boolean = false;
  aiscoreTab: boolean = true;
  eandiTab: boolean = true;
  loader: boolean = true;
  sanitizedContent: SafeHtml = '';
  sanitizedContent2: SafeHtml = '';
  sanitizedContent3: SafeHtml = '';
  recruiterData: any[] = [];
  partnerData:any[]=[];
  partnerData2:any[]=[];
  recruiterData2: any[] = [];
  
  dropdownList:any = [];
  dropdownSettings:IDropdownSettings={};
  isLoading: boolean = false;
  eandiList: any [] = [];
  enadiWeightage: any [] = [];
  total_record: any;
  
  rangeValues2: number[] = [20, 60];

  indentForm = this.fb.group({
    indentStep1: this.fb.group({
      jobTitle: ['',[Validators.required,this.customValidator.designationValidator()]],
      jobCode: ['', [Validators.required,this.customValidator.jobcodeValidator()]],
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
      mustCriteria: ['',[Validators.maxLength(5000)]]
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
  indentId:any;
  constructor (private messageService: MessageService,private route:ActivatedRoute,private sanitizer: DomSanitizer){
    var usertype = localStorage.getItem("user");
  }



  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.indentId = this.route.snapshot.paramMap.get('id')!;
    this.getSingleIndent(this.authToken, this.indentId, '');
    this.getAlleandi2(this.authToken,'','','');
    this.getRecruiter();
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
    this.getAllAssessmentSingle(this.authToken,'')
    //console.log(this.recruiterData)

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

  indentStaging:any[] = [];
  getSingleIndent(authToken: string, indentId: string, candidateId: string): void {
    this.indentService.getSingleIndent(authToken, indentId, candidateId).subscribe(
      (res: any) => {
        this.indentData = res.result[0];
        this.indentStaging = this.convertStageingToArray2(this.indentData?.indentStep5);
        //console.log(this.indentStaging);
        this.loader = false;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.indentData?.indentStep2?.clientDescription);
        this.sanitizedContent2 = this.sanitizer.bypassSecurityTrustHtml(this.indentData?.indentStep2?.jobDescription);
        this.sanitizedContent3 = this.sanitizer.bypassSecurityTrustHtml(this.indentData?.indentStep2?.mustCriteria);
        this.populateIndentForm(this.indentData);
        this.getClientSpoc1(this.indentData?.indentStep1?.jobClient);
        this.getEandI2(this.indentData?.indentStep4?.eandiId)
        this.onSelectAssessment2(this.indentData?.indentStep6?.assessmentId)
        if(this.indentData?.indentStep6?.assessmentId != ''){
          this.assessmentTab = true;
        }else{
          this.assessmentTab = false;
        }
      },
      error => {
        // Handle error
      }
    );
  }

  populateIndentForm(indentData:any): void{
    // this.indentForm.patchValue({
      
    // })
    const step1Array1 = this.indentForm.get('indentStep1') as FormGroup;
    step1Array1.controls['jobTitle'].setValue(indentData?.indentStep1?.jobTitle)
    step1Array1.controls['jobCode'].setValue(indentData?.indentStep1?.jobCode)
    step1Array1.controls['jobCategory'].setValue(indentData?.indentStep1?.jobCategory)
    step1Array1.controls['jobClient'].setValue(indentData?.indentStep1?.jobClient)
    step1Array1.controls['jobClientSpoc'].setValue(indentData?.indentStep1?.jobClientSpoc)
    step1Array1.controls['hideClient'].setValue(indentData?.indentStep1?.hideClient)
    step1Array1.controls['referrals'].setValue(indentData?.indentStep1?.referrals)
    step1Array1.controls['jobType'].setValue(indentData?.indentStep1?.jobType)
    step1Array1.controls['department'].setValue(indentData?.indentStep1?.department)
    step1Array1.controls['businessUnit'].setValue(indentData?.indentStep1?.businessUnit)
    step1Array1.controls['jobLevel'].setValue(indentData?.indentStep1?.jobLevel)
    step1Array1.controls['jobFunction'].setValue(indentData?.indentStep1?.jobFunction)
    step1Array1.controls['jobSector'].setValue(indentData?.indentStep1?.jobSector)
    step1Array1.controls['jobIndustry'].setValue(indentData?.indentStep1?.jobIndustry)
    step1Array1.controls['recruiterList'].setValue(indentData?.indentStep1?.recruiterList)
    step1Array1.controls['partnerList'].setValue(indentData?.indentStep1?.partnerList)
    step1Array1.controls['career'].setValue(indentData?.indentStep1?.career)

    const step2Array2 = this.indentForm.get('indentStep2') as FormGroup;
    step2Array2.controls['advLocation'].setValue(indentData?.indentStep2?.advLocation)
    step2Array2.controls['minSalary'].setValue(indentData?.indentStep2?.minSalary)
    step2Array2.controls['maxSalary'].setValue(indentData?.indentStep2?.maxSalary)
    step2Array2.controls['negotiable'].setValue(indentData?.indentStep2?.negotiable)
    step2Array2.controls['salaryUnit'].setValue(indentData?.indentStep2?.salaryUnit)
    step2Array2.controls['vacancies'].setValue(indentData?.indentStep2?.vacancies)
    step2Array2.controls['skilsList'].setValue(indentData?.indentStep2?.skilsList)
    step2Array2.controls['minExperience'].setValue(indentData?.indentStep2?.minExperience)
    step2Array2.controls['maxExperience'].setValue(indentData?.indentStep2?.maxExperience)
    step2Array2.controls['jobDescription'].setValue(indentData?.indentStep2?.jobDescription)
    step2Array2.controls['clientDescription'].setValue(indentData?.indentStep2?.clientDescription)
    step2Array2.controls['mustCriteria'].setValue(indentData?.indentStep2?.mustCriteria)

    const step3Array3 = this.indentForm.get('indentStep3') as FormGroup;
    const step3Array3Skill = step3Array3.get('skills') as FormGroup;
    step3Array3Skill.controls['mustHaveSkills'].setValue(indentData?.indentStep3?.skills?.mustHaveSkills)
    step3Array3Skill.controls['goodHaveSkills'].setValue(indentData?.indentStep3?.skills?.goodHaveSkills)

    const step3Array3education = step3Array3.get('education') as FormGroup;
    step3Array3education.controls['scDegree'].setValue(indentData?.indentStep3?.education?.scDegree)
    step3Array3education.controls['scSpecialization'].setValue(indentData?.indentStep3?.education?.scSpecialization)
    step3Array3education.controls['scLevel'].setValue(indentData?.indentStep3?.education?.scLevel)
    step3Array3education.controls['scQuality'].setValue(indentData?.indentStep3?.education?.scQuality)

    const step3Array3experience = step3Array3.get('experience') as FormGroup;
    step3Array3experience.controls['scMinExperience'].setValue(indentData?.indentStep3?.experience?.scMinExperience)
    step3Array3experience.controls['scMaxExperience'].setValue(indentData?.indentStep3?.experience?.scMaxExperience)
    step3Array3experience.controls['scPrvJobRole'].setValue(indentData?.indentStep3?.experience?.scLevel)
    step3Array3experience.controls['scJobIndustry'].setValue(indentData?.indentStep3?.experience?.scQuality)
    step3Array3experience.controls['scPreEmp'].setValue(indentData?.indentStep3?.experience?.scPreEmp)
    step3Array3experience.controls['scCompanyAge'].setValue(indentData?.indentStep3?.experience?.scCompanyAge)
    step3Array3experience.controls['scCompanySize'].setValue(indentData?.indentStep3?.experience?.scCompanySize)

    const step3Array3scoring = step3Array3.get('scoring') as FormGroup;
    step3Array3scoring.controls['scSkillWeightage'].setValue(indentData?.indentStep3?.scoring?.scSkillWeightage)
    step3Array3scoring.controls['scEducationWeightage'].setValue(indentData?.indentStep3?.scoring?.scEducationWeightage)
    step3Array3scoring.controls['scExperienceWeightage'].setValue(indentData?.indentStep3?.scoring?.scExperienceWeightage)


    const step4Array4 = this.indentForm.get('indentStep4') as FormGroup;
    step4Array4.controls['eandiId'].setValue(indentData?.indentStep4?.eandiId)
    const step4Array4criteria = step4Array4.get('criteria') as FormGroup;
    step4Array4criteria.controls['greenMinScore'].setValue(indentData?.indentStep4?.criteria?.greenMinScore)
    step4Array4criteria.controls['greenMaxScore'].setValue(indentData?.indentStep4?.criteria?.greenMaxScore)
    step4Array4criteria.controls['amberMinScore'].setValue(indentData?.indentStep4?.criteria?.amberMinScore)
    step4Array4criteria.controls['amberMaxScore'].setValue(indentData?.indentStep4?.criteria?.amberMaxScore)
    step4Array4criteria.controls['redMinScore'].setValue(indentData?.indentStep4?.criteria?.redMinScore)
    step4Array4criteria.controls['redMaxScore'].setValue(indentData?.indentStep4?.criteria?.redMaxScore)


    const step5Array5 = this.indentForm.get('indentStep5') as FormGroup;
    const step5Array5screening = step5Array5.get('screening') as FormGroup;
    const step5Array5screeningscored = step5Array5screening.get('scored') as FormGroup;
    step5Array5screeningscored.controls['status'].setValue(indentData?.indentStep5?.screening?.scored?.status)
    
    const step5Array5eandiDone = step5Array5screening.get('eandiDone') as FormGroup;
    step5Array5eandiDone.controls['status'].setValue(indentData?.indentStep5?.screening?.eandiDone?.status)

    const step5Array5manualAssessment = step5Array5screening.get('manualAssessment') as FormGroup;
    step5Array5manualAssessment.controls['status'].setValue(indentData?.indentStep5?.screening?.manualAssessment?.status)
    
    const step5Array5onlineAssessment = step5Array5screening.get('onlineAssessment') as FormGroup;
    step5Array5onlineAssessment.controls['status'].setValue(indentData?.indentStep5?.screening?.onlineAssessment?.status)

    const step5Array5calToAction = step5Array5screening.get('calToAction') as FormGroup;
    step5Array5calToAction.controls['status'].setValue(indentData?.indentStep5?.screening?.calToAction?.status)

    const step5Array5selected = step5Array5screening.get('selected') as FormGroup;
    step5Array5selected.controls['status'].setValue(indentData?.indentStep5?.screening?.selected?.status)

    const step5Array5rejected = step5Array5screening.get('rejected') as FormGroup;
    step5Array5rejected.controls['status'].setValue(indentData?.indentStep5?.screening?.rejected?.status)

    const step5Array5hold = step5Array5screening.get('hold') as FormGroup;
    step5Array5hold.controls['status'].setValue(indentData?.indentStep5?.screening?.hold?.status)

    const step5Array5shortList = step5Array5screening.get('shortList') as FormGroup;
    step5Array5shortList.controls['status'].setValue(indentData?.indentStep5?.screening?.shortList?.status)
    
    const step5Array5approvedShortList = step5Array5screening.get('approvedShortList') as FormGroup;
    step5Array5approvedShortList.controls['status'].setValue(indentData?.indentStep5?.screening?.approvedShortList?.status)
    
    const step5Array5rejectedShortList = step5Array5screening.get('rejectedShortList') as FormGroup;
    step5Array5rejectedShortList.controls['status'].setValue(indentData?.indentStep5?.screening?.rejectedShortList?.status)
    

    const step5Array5interview = step5Array5.get('interview') as FormGroup;
    const step5Array5interviewscheduledCreated = step5Array5interview.get('scheduledCreated') as FormGroup;
    step5Array5interviewscheduledCreated.controls['status'].setValue(indentData?.indentStep5?.interview?.scheduledCreated?.status)
    
    const step5Array5interviewcandidatesScheduled = step5Array5interview.get('candidatesScheduled') as FormGroup;
    step5Array5interviewcandidatesScheduled.controls['status'].setValue(indentData?.indentStep5?.interview?.candidatesScheduled?.status)
    
    const step5Array5interviewinterviewAttended = step5Array5interview.get('interviewAttended') as FormGroup;
    step5Array5interviewinterviewAttended.controls['status'].setValue(indentData?.indentStep5?.interview?.interviewAttended?.status)
    
    const step5Array5interviewinterviewSelected = step5Array5interview.get('interviewSelected') as FormGroup;
    step5Array5interviewinterviewSelected.controls['status'].setValue(indentData?.indentStep5?.interview?.interviewSelected?.status)
    
    const step5Array5interviewinterviewRejected = step5Array5interview.get('interviewRejected') as FormGroup;
    step5Array5interviewinterviewRejected.controls['status'].setValue(indentData?.indentStep5?.interview?.interviewRejected?.status)
    
    const step5Array5interviewinterviewHold = step5Array5interview.get('interviewHold') as FormGroup;
    step5Array5interviewinterviewHold.controls['status'].setValue(indentData?.indentStep5?.interview?.interviewHold?.status)
    
    const step5Array5interviewcandidateRescheduled = step5Array5interview.get('candidateRescheduled') as FormGroup;
    step5Array5interviewcandidateRescheduled.controls['status'].setValue(indentData?.indentStep5?.interview?.candidateRescheduled?.status)
    
    const step5Array5interviewcandidateDropped = step5Array5interview.get('candidateDropped') as FormGroup;
    step5Array5interviewcandidateDropped.controls['status'].setValue(indentData?.indentStep5?.interview?.candidateDropped?.status)



    const step5Array5offer = step5Array5.get('offer') as FormGroup;
    const step5Array5offerdocumentsSubmitted = step5Array5offer.get('documentsSubmitted') as FormGroup;
    step5Array5offerdocumentsSubmitted.controls['status'].setValue(indentData?.indentStep5?.offer?.documentsSubmitted?.status)

    const step5Array5offerpartialDocumentsSubmitted = step5Array5offer.get('partialDocumentsSubmitted') as FormGroup;
    step5Array5offerpartialDocumentsSubmitted.controls['status'].setValue(indentData?.indentStep5?.offer?.partialDocumentsSubmitted?.status)

    const step5Array5offerdocumentsNotSubmitted = step5Array5offer.get('documentsNotSubmitted') as FormGroup;
    step5Array5offerdocumentsNotSubmitted.controls['status'].setValue(indentData?.indentStep5?.offer?.documentsNotSubmitted?.status)

    const step5Array5offerofferReleased = step5Array5offer.get('offerReleased') as FormGroup;
    step5Array5offerofferReleased.controls['status'].setValue(indentData?.indentStep5?.offer?.offerReleased?.status)

    const step5Array5offerofferAcceptance = step5Array5offer.get('offerAcceptance') as FormGroup;
    step5Array5offerofferAcceptance.controls['status'].setValue(indentData?.indentStep5?.offer?.offerAcceptance?.status)

    const step5Array5offerofferRejected = step5Array5offer.get('offerRejected') as FormGroup;
    step5Array5offerofferRejected.controls['status'].setValue(indentData?.indentStep5?.offer?.offerRejected?.status)

    const step5Array5offerofferHold = step5Array5offer.get('offerHold') as FormGroup;
    step5Array5offerofferHold.controls['status'].setValue(indentData?.indentStep5?.offer?.offerHold?.status)


    const step5Array5hire = step5Array5.get('hire') as FormGroup;
    const step5Array5hirejoinedYet = step5Array5hire.get('joinedYet') as FormGroup;
    step5Array5hirejoinedYet.controls['status'].setValue(indentData?.indentStep5?.hire?.joinedYet?.status)
    
    const step5Array5hirejoinedLeft = step5Array5hire.get('joinedLeft') as FormGroup;
    step5Array5hirejoinedLeft.controls['status'].setValue(indentData?.indentStep5?.hire?.joinedLeft?.status)
    
    const step5Array5hirejoinedCompleted = step5Array5hire.get('joinedCompleted') as FormGroup;
    step5Array5hirejoinedCompleted.controls['status'].setValue(indentData?.indentStep5?.hire?.joinedCompleted?.status)
    


    const step6Array6 = this.indentForm.get('indentStep6') as FormGroup;
    step6Array6.controls['assessmentType'].setValue(indentData?.indentStep6?.assessmentType)
    step6Array6.controls['assessmentId'].setValue(indentData?.indentStep6?.assessmentId)
    step6Array6.controls['assessmentCutScore'].setValue(indentData?.indentStep6?.assessmentCutScore)

    const steprangeValues = this.indentForm as FormGroup;
    steprangeValues.controls['rangeValues'].setValue(indentData?.rangeValues)
    //console.log(steprangeValues)

  }




  convertStageingToArray2(stageing: any): { stageName: string, details: { key: string, status: string, date: string, created_by?: string, isSubmitted: string }[] }[] {
    return Object.keys(stageing).map(stageName => ({
      stageName,
      details: Object.keys(stageing[stageName]).map(key => ({
        key,
        ...stageing[stageName][key]
      }))
    }));
  }
  

  onCheckboxChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const assessmentreqired = this.indentForm.controls.indentStep6.get('assessmentId');
    const assessmentCutScorerequired = this.indentForm.controls.indentStep6.get('assessmentCutScore');
    //console.log('Checkbox value changed:', checked);
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



  async postData(url = '', data = {}, authToken: string) {
    return fetch(url, {
      method: 'PUT',
      mode: 'cors',    // no-cors, *cors, same-origin
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json());
  }


  async onSubmit(){
    this.isFormSubmited = true;
    const data = this.indentForm.value;
    this.authToken = localStorage.getItem('access_token');

    // console.log(this.indentForm.controls.indentStep1.controls.jobtitle.valid);

    if(this.indentForm.valid){
      this.postData(environment.apiURL+constant.apiEndPoint.UPDATEINDENT+'?indent_id='+this.indentId, data, this.authToken)
      .then(data => {
        // console.log("fsfsf"+data);
        if(data.status = 1){
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail:'Data inserted' });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
          this.isLoading = false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      this.overallFormValid = '';
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory field!' });
      // this.overallFormValid = "Please fill the form correctly";
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
  onSelectAssessment2(id: any): void {
    this.getAllAssessmentSingle(this.authToken,id);
  }


  getEandI(event: any): void{
    const selectedTitle = event.target.value;
      this.getAlleandi2(this.authToken,selectedTitle,'','');
  }

  getEandI2(id:any): void{
      this.getAlleandi2(this.authToken,id,'','');
  }


  getAlleandi2(authToken: string,id:string,title:string,category:string): void {
    this.clientService.getAlleandi(authToken,id,title,category).subscribe(
      (res: any) => {
        this.endiData = res.result[0];
        //console.log(this.endiData);
      },
      error => {
        // Handle error
      }
    );
  }

  getClientSpoc1(jobClient:any){
    this.getSingleClient(this.authToken,jobClient);
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

  searchLocations(event: any) {
    const query = event.query.toLowerCase();
    this.filteredLocations = this.locationData
      .filter(item => item.toLowerCase().includes(query))
      .sort((a, b) => a.localeCompare(b));
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

  searchSkills(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSkills = this.skillsData
      .filter(item => item.toLowerCase().includes(query))
      .sort((a, b) => a.localeCompare(b));
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
        if(res.status == 1){
          this.eandiList = res.result;

          // var i = 0;
          // for (const eandi of this.eandiList) {
          //   for (const eandi2 of eandi?.questions) {
          //     this.weightageSum += eandi2.weightage
          //   }
          //   this.enadiWeightage[i] = this.weightageSum;
          //   i++;
          // }

          var i = 0;
          for (const eandi of this.eandiList) {
            let weightageSum = 0; // Reset weightageSum for each eandi
            for (const eandi2 of eandi?.questions) {
              weightageSum += eandi2.weightage;
            }
            this.enadiWeightage[i] = weightageSum;
            i++;
          }
          
          this.total_record = res.total_record;
          this.loader = false;
        }else{
          this.eandiList = [];
          this.total_record = 0;
          this.loader = false;
        }
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

}
