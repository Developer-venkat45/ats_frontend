import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, ClientResponse, ClientResponse2 } from '../../core/model/model';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomValidatorComponent} from '../../validations/custom-validator.component';


@Component({
  selector: 'app-addcandidate',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgMultiSelectDropDownModule],
  templateUrl: './addcandidate.component.html',
  styleUrl: './addcandidate.component.css'
})
export class AddcandidateComponent implements OnInit{

  fb = inject(FormBuilder);
  clientService = inject(DashboardService);
  years: number[] = [];
  workingStatusValue: boolean = true;
  workingStatusValueIndex: number = 0;
  apiMessage:any="";
  isFormSubmited: boolean = false;
  overallFormValid: string = "";
  indentId: any = null;
  skillsData: any [] = [];
  industryData: any [] = [];
  authToken:any;
  dropdownSettings:IDropdownSettings={};
  private customValidator= new CustomValidatorComponent();

  constructor(private route: ActivatedRoute){
    this.getYears();
    console.log(this.years)
  }
  
  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getJobIndustryData(this.authToken, 'job industry');
    this.getSkillsData(this.authToken, 'skills');
    this.indentId = this.route.snapshot.queryParamMap.get('indentId');

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll:false,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };
  }


  insertCandidate = this.fb.group({
    indent_id: [''],
    name: ['',[Validators.required,this.customValidator.alphabetValidator()]],
    mobile: ['', [Validators.required,this.customValidator.onlynumberValidator()]],
    email: ['',[Validators.required,this.customValidator.emailValidator()]],
    dob: ['', [Validators.required,this.customValidator.minAgeValidator(18)]],
    totWorkExp: ['', Validators.required],
    fatherName: ['', [Validators.required,this.customValidator.alphabetValidator()]],
    skills: ['', Validators.required],
    gender: ['male', Validators.required],
    state: ['',[Validators.required, Validators.pattern('^[a-zA-Z ]{1,100}$')]],
    city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{1,100}$')]],
    address: ['',Validators.required],
    education: this.fb.array([
      this.fb.group({
        qualification: ['', Validators.required],
        institute: ['', Validators.required],
        passedOn: ['', Validators.required],
        percentage: ['', [Validators.required,this.customValidator.numbersdotsValidator()]],
      }),
    ]),
    experience: this.fb.array([
      this.fb.group({
        workingStatus: ['', Validators.required],
        compName: ['', Validators.required],
        industry: ['', Validators.required],
        designation: ['',[Validators.required,Validators.pattern('^[a-zA-Z ,-]{1,100}$')]],
        startDate: ['',Validators.required],
        endDate: ['']
      }),
    ]),
    created_by: "666fcb51665b703fa25728b7"
  })


  
  get answerGroups() {
    return this.insertCandidate.get('education') as FormArray;
  }

  get expGroups() {
    return this.insertCandidate.get('experience') as FormArray;
  }


  addAnswer(){
    this.answerGroups.push(
      this.fb.group({
        qualification: ['', Validators.required],
        institute: ['', Validators.required],
        passedOn: ['', Validators.required],
        percentage: ['',Validators.required]
      })
    );
  }


  addExperience(){
    this.expGroups.push(
      this.fb.group({
        workingStatus: ['', Validators.required],
        compName: ['', Validators.required],
        industry: ['', Validators.required],
        designation: ['',Validators.required],
        startDate: ['',Validators.required],
        endDate: ['',Validators.required]
      })
    );

    this.workingStatusValue = true;
    this.workingStatusValueIndex +=1;
  }

  
  removeAnswer(index: number){
    this.answerGroups.removeAt(index);
  }


  removeExperience(index: number){
    this.expGroups.removeAt(index);
  }



  
  getYears() {
    const startYear = 1980;
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  workingStatusSelect(event: Event, index: number): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.workingStatusValueIndex = index;
    if(selectedValue == "Currently Working"){
      this.workingStatusValue = false;
    }else{
      this.workingStatusValue = true;
    }
    
  }



  getJobIndustryData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.industryData = res.data;
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


  
  async InsertData(url = '', data= {}, authToken: string) {
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


  async insertCandidateData(){
    this.isFormSubmited = true;

    //console.log(this.insertCandidate.controls.education.controls[0].controls.qualification);

    var data = this.insertCandidate.value;
    data.indent_id = this.indentId;
    
    this.authToken = localStorage.getItem('access_token');

    if(this.insertCandidate.valid){
      this.InsertData(environment.apiURL+constant.apiEndPoint.ADDMANUALCANDIDATE, data, this.authToken)
      .then(data => {
        if(data.status == 1){
          this.apiMessage = data.message;
          this.insertCandidate.reset();
        }else{
          this.apiMessage = data.message;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      this.overallFormValid = '';
    }else{
      this.overallFormValid = "Please fill the form correctly";
    }
  }


}
