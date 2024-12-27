import { Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder,MaxLengthValidator,ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../core/service/dashboard.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CustomValidatorComponent } from '../validations/custom-validator.component';
import { environment } from '../../environments/environment'; 
import { constant } from '../core/constant/constant';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-registerpartner',
  standalone: true,
  imports: [NgMultiSelectDropDownModule,CommonModule,DialogModule,ReactiveFormsModule,ToastModule,CalendarModule],
  templateUrl: './registerpartner.component.html',
  styleUrl: './registerpartner.component.css'
})
export class RegisterpartnerComponent {
  fb = inject(FormBuilder);
  authToken:any;
  clientService = inject(DashboardService);
  degreeData: any [] = [];
  positionLevel: any [] = [];
  roleData: any [] = [];
  sectorData:any []=[];
  locationData:any []=[];
  industryData:any []=[];
  dropdownSettings:IDropdownSettings={};
  displayModalAdd:boolean=false;
  displayModal: boolean = false;
  isFormSubmited: boolean=false;
  partnerList:any[]=[];
  totalRecord: any;
  showgst:boolean = true;
  showmsme:boolean = true;
  apiMessage:any="";
  overallFormValid: string = "";
  selectedPartner: any | null = null;
  slectedPartnerType: any;
  isLoading: boolean = false;
  uploadBtn: boolean = false;
  jobIndustryData: any [] = [];

  partnerImageUrl: string = '../assets/images/preview.png';
  partnerLogoFile:any="";
  baseAPIURL:any;
  partnerInsertData:any;
  zoneData: any[] = [];
  stateData: any[] = [];
  cityData: any[] = [];
  stateData2: any[] = [];
  label: string = "Logo";
  selectedReferredType: any;

  private customValidator= new CustomValidatorComponent();


  constructor(private router: Router, private messageService: MessageService) {}


  ngOnInit():void{
    this.authToken = localStorage.getItem("access_token");
    this.getStateData2(this.authToken, '');
    this.getJobIndustryData(this.authToken, 'job industry');
    this.getRoleData(this.authToken, 'role');

    this.dropdownSettings = {
      idField: 'item_text',
      textField: 'item_text',
      enableCheckAll:false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.degreeData = [ 'Offroll Hiring', 'BFSI', 'Non BFSI', 'IT Hiring', 'Pharma', 'Manufacturing', 'Lateral Hiring'];
    this.positionLevel = [ 'Entry Level', 'Mid Level', 'Senior Level'];
    //this.roleData = [ 'Accounting and Finance', 'Administrative and Clerical', 'Business Development and Strategy', 'Construction and Skilled Trades', 'Creative and Media', 'Education and Training', 'Engineering and IT','Healthcare','Hospitality and Customer Service','Human Resources','Legal','Logistics and Transportation','Manufacturing and Production','Real Estate and Property Management','Retail','Sales and Marketing','Science and Research'];
    this.baseAPIURL= environment.apiURL;
  }


  getJobIndustryData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.jobIndustryData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }

  getRoleData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.roleData = res.data;
      },
      error => {
        // Handle error
      }
    );
  }

  getStateData2(authToken: string, zoneId: string): void {
    this.clientService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData2 = res.result[0].data.map((re: any) => re.name);
      },
      error => {
        // Handle error
      }
    );
  }



  insertNewRegisterPartner = this.fb.group({
    vendorName: ['', [Validators.required,this.customValidator.alphabetValidator()]],
    // referredBy: ['',[Validators.required,this.customValidator.alphabetValidator()]],
    firmName: ['', [Validators.required,this.customValidator.alphaNumaricValidator()]],
    partnerLogo: ['',Validators.required],
    mdName: ['',[Validators.required,this.customValidator.alphabetValidator()]],
    designation: ['',[Validators.required,Validators.maxLength(150),this.customValidator.designationValidator()]],
    primaryContactNumber: ['',[Validators.required,this.customValidator.onlynumberValidator()]],
    secondaryContactNumber: ['',[this.customValidator.onlynumberValidator()]],
    primaryEmailId: ['',[Validators.required,this.customValidator.emailValidator()]],
    secondaryEmailId: ['',[this.customValidator.emailValidator()]],
    partnerType: [''],
    partnerCategory: ['',Validators.required,],
    recruitmentPresence: ['',Validators.required],
    currentlyHiringIndustries: ['',Validators.required],
    positionLevel: ['',Validators.required],
    currentlyWorkingRoles: ['',Validators.required],
    employeeCount: ['',[Validators.required,Validators.maxLength(5),this.customValidator.negativeValueValidator(),this.customValidator.digitsOnly()]],
    dateOfIncorporation:[''],
    dateOfBirth: ['',[Validators.required,this.customValidator.minAgeValidator(18)]],
    source: this.fb.group({
      options:[''],
      others: [''],
    }),
    created_by: '666fcb51665b703fa25728b7'
  })

  restPartnerPartialForm(){
    this.insertNewRegisterPartner.patchValue({
      partnerLogo:'',
    });
    this.insertNewRegisterPartner.get('partnerLogo')?.markAsPristine();
  }
  

  onPartnerSelected(event: any) {
    this.partnerLogoFile= File = event.target.files[0];
    if (this.partnerLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg','image/png'];
        if (this.partnerLogoFile.size > maxSize) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
          this.restPartnerPartialForm();
          this.partnerImageUrl = '../assets/images/preview.png';
        }else if (!validFileTypes.includes(this.partnerLogoFile.type)) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
          this.restPartnerPartialForm();
          this.partnerImageUrl = '../assets/images/preview.png';
        }else{
          const reader = new FileReader();
          reader.onload = () => {
            this.partnerImageUrl = reader.result as string;
          };
          reader.readAsDataURL(this.partnerLogoFile);
        }
      }
  }
  

  async InsertData(url = '', formData: FormData, authToken: string) {
    return fetch(url, {
      method: 'POST', 
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        // 'Content-Type': 'application/json'
      },
      body: formData
    })
    .then(response => response.json());
  }


  async insertRegisterPartner(){
    this.isFormSubmited = true;
    this.isLoading = true;
    this.authToken = localStorage.getItem('access_token');
    this.partnerInsertData = this.insertNewRegisterPartner.value;
    console.log(this.partnerInsertData)
    const formData: FormData = new FormData();
    formData.append('partnerLogo', this.partnerLogoFile);
    formData.append('partnerData', JSON.stringify(this.partnerInsertData));


    if(this.insertNewRegisterPartner.valid){
      this.InsertData(environment.apiURL+constant.apiEndPoint.INSERTPARTNER, formData, this.authToken)
      .then(data => {
        if(data.status == 1){
          this.insertNewRegisterPartner.reset();
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });

          setTimeout(() => {this.router.navigate(['/login']);}, 3000);

        }else{
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else{
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  getPartnerFields(event: Event): void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.slectedPartnerType = selectedValue;

    const firmName = this.insertNewRegisterPartner.get('firmName');
    const mdName = this.insertNewRegisterPartner.get('mdName');
    const designation = this.insertNewRegisterPartner.get('designation');
    const dateOfIncorporation = this.insertNewRegisterPartner.get('dateOfIncorporation');

    if(this.slectedPartnerType != 'Freelancer'){
      firmName?.setValidators([Validators.required]);
      mdName?.setValidators([Validators.required]);
      designation?.setValidators([Validators.required]);
      this.label = "Logo";
      dateOfIncorporation?.setValidators([Validators.required]);
    }else{
      firmName?.clearValidators();
      mdName?.clearValidators();
      designation?.clearValidators();
      this.label = "Profile Image";
      dateOfIncorporation?.clearValidators();
    }
    firmName?.updateValueAndValidity();
    mdName?.updateValueAndValidity();
    designation?.updateValueAndValidity();
    dateOfIncorporation?.updateValueAndValidity();

  }


  


  getStateData(authToken: string, zoneId: string): void {
    this.clientService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
        //console.log(this.stateData);
      },
      error => {
        // Handle error
      }
    );
  }

  getReferredFields(event: Event):void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedReferredType = selectedValue;
    // console.log(this.selectedReferredType)

    const referredType = this.insertNewRegisterPartner.controls.source.get('others');
    if(this.selectedReferredType == "Others"){
      referredType?.setValidators([Validators.required]);
    }else{
      referredType?.clearValidators();
    }
    referredType?.updateValueAndValidity();
  }
  
}