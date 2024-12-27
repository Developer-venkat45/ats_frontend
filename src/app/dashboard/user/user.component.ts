import { Component, inject, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DashboardService } from '../../core/service/dashboard.service';
import { usersDetails } from '../../core/model/model';
import { FormBuilder, Form, FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import Swal from 'sweetalert2';
import { RouterModule} from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [OrganizationChartModule,ReactiveFormsModule,FormsModule,DialogModule,CommonModule,RouterModule,TooltipModule,NgxSkeletonLoaderModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  indedentService = inject(DashboardService);
  fb = inject(FormBuilder);
  authToken: any="";
  baseAPIURL:any;
  roleMaster: any[] = [];
  myRole: any;
  isShown: boolean = false;
  isOption: boolean = false;
  isOption2: boolean = false;
  isOption3: boolean = false;
  profileList: usersDetails[] = [];
  userDetailsData: usersDetails | null = null;
  apiMessage:any="";
  loading: boolean = true;
  displayModal: boolean = false;
  displayModalAdd: boolean = false;
  displayModalRole: boolean = false;
  displayModalUser: boolean = false;
  showClient: boolean = false;
  showPartner: boolean = false;
  apiMessage2:any="";
  zoneData: any[] = [];
  stateData: any[] = [];
  cityData: any[] = [];
  partnerList: any [] = [];
  clientList: any [] = [];
  isLoading:boolean = false
  isFormSubmited2: boolean = false;
  loginUserId:any;
  loginUserName:any;
  overallFormValid2: string = "";
  apiMessage3:any="";
  selectedUser: usersDetails | null = null;
  isFormSubmited4: boolean = false;
  overallFormValid4: string = "";
  apiMessage4:any="";
  loader: boolean = true;
  loader2: boolean = true;
  loaderCount: number = 10;

  limit:any = 10;
  skip:number = 0;
  totalRecord:number = 0;
  filterdRecord:number = 0;
  fetchedRecord:number = 0;
  currentPage:number = 1;
  itemsPerPage:number = 10;
  startIndex:number = 0;
  endIndex:number = 10;
  totalPages:number = 0;
  startIndex2:number = 1;
  endIndex2:number = 10;

  isBtnLoading: boolean= false;
  partnerTouched: boolean = false;
  isDisabled: string='';
  isDisabled2: string='';
  
  private customValidator= new CustomValidatorComponent();

  constructor(private messageService: MessageService, private http: HttpClient){
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
  }
  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');

    this.getAllUsers(this.authToken, '');
    this.getAllClient(this.authToken);
    this.getAllPartner(this.authToken);


    this.baseAPIURL= environment.apiURL;
    this.roleMaster = [
      {
        label: 'Super Admin',
        expanded: true,
        styleClass: 'custom-td',
        children: [
          {
            styleClass: 'custom-td',
            label: 'CRCM',
            expanded: true,
            children: [
              {
                label: 'Central Recruter'
              }
            ]
          },
          {
            label: 'BU Head',
            expanded: true,
            styleClass: 'custom-td',
            children: [
              {
                label: 'Project Manager',
                children: [
                  {
                    label: 'Recruiter'
                  }
                ]
              }
            ]
          },
          {
            label: 'MIS Admin',
          },
          {
            label: 'Candidate',
          }
        ]
      }
    ];


    if(this.currentPage > 1){
      this.isDisabled = "";
    }else{
      this.isDisabled = "disabled";
    }

    if(this.currentPage > this.totalPages){
      this.isDisabled2 = "";
    }else{
      this.isDisabled2 = "disabled";
    }
  }
  
  getAllUsers(authToken: string, role: string): void {
    if(this.myRole == "CRCM"){
      role = 'Central Recruter';
      this.isShown = false;
      this.isOption = false;
      this.isOption2 = false;
      this.isOption3 = false;
    }else if(this.myRole == "BU Head"){
      role = 'Project Manager';
      this.isShown = true;
      this.isOption = false;
      this.isOption2 = false;
      this.isOption3 = true;
    }else if(this.myRole == "Project Manager"){
      role = 'Recruiter';
      this.isShown = true;
      this.isOption = false;
      this.isOption2 = true;
      this.isOption3 = false;
    }else if(this.myRole == "MIS Admin"){
      role = 'Recruiter';
      this.isShown = true;
      this.isOption = false;
      this.isOption2 = true;
      this.isOption3 = false;
    }else{
      role = ''
      this.isShown = true;
      this.isOption = true;
      this.isOption2 = true;
      this.isOption3 = true;
    }
    this.indedentService.getAllUsers(authToken, role, '').subscribe(
      (res: any) => {
        if(res.status == 1){
          this.profileList = res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
          this.loading = false;
          this.loader = false;
          this.loader2 = false;
          if(this.fetchedRecord < this.limit){
            if(this.fetchedRecord <= 10){
              this.endIndex2 = this.totalRecord;
            }else{
              this.endIndex2 = this.fetchedRecord;
            }
            this.endIndex = this.fetchedRecord;
            this.startIndex = 0;
          }
          this.totalPages = Math.ceil(this.totalRecord / this.itemsPerPage);
        }else{
          this.profileList = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loading = false;
          this.endIndex = 0;
          this.loader = false;
          this.loader2 = false;
        }
        
      },
      error => {
        // Handle error
      }
    );
  }

  getStateOnZoneChnage(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;

    var selectedZoneId:any = 0;
    if( selectedStateName == 'East'){
      selectedZoneId = 1;
    }else if(selectedStateName == 'West'){
      selectedZoneId = 4;
    }else if(selectedStateName == 'North'){
      selectedZoneId = 2;
    }else if(selectedStateName == 'South'){
      selectedZoneId = 3;
    }
    this.getStateData(this.authToken, selectedZoneId);
  }

  getStateData(authToken: string, zoneId: string): void {
    this.indedentService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
        //console.log(this.stateData);
      },
      error => {
        // Handle error
      }
    );
  }

  getCityOnStateChnage(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    const selectedState = this.stateData.find(state => state.name === selectedStateName);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken, selectedStateId);
  }

  getCityData(authToken: string, stateId: string): void {
    this.indedentService.getCity(authToken, stateId).subscribe(
      (res: any) => {
        this.cityData = res.result[0].data;
      },
      error => {
        // Handle error
      }
    );
  }

  addNewUser = this.fb.group({
    role_id: [, Validators.required],
    role_text: ['', Validators.required],
    client_id: [''],
    partner_id:[''],
    client_name: [''],
    partner_name: [''],
    name: ['', [Validators.required,Validators.maxLength(150),this.customValidator.alphaSpaceValidator()]],
    username: ['',[Validators.required,Validators.maxLength(50),this.customValidator.alphaNumaricValidator()]],
    email: ['',[Validators.required,this.customValidator.emailValidator()]],
    mobile: ['',[Validators.required,this.customValidator.onlynumberValidator()]],
    company: ['', Validators.maxLength(150)],
    department: ['', Validators.maxLength(150)],
    designation: ['',[Validators.required, Validators.maxLength(150), Validators.pattern('^[a-zA-Z ,-]{1,100}$')]],
    gender: ['Male'],
    zone: ['',Validators.required],
    state: ['',Validators.required],
    city: ['',Validators.required],
    pincode: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
    address: ['',[Validators.maxLength(500)]],
    password: 'Password#123',
    created_by: '66694895cfaa5427c0be5f30'
  })

  addUserDiv(){
    this.displayModalAdd = true;
    this.addNewUser.reset();
  }


  getClientDetails(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;
    this.addNewUser.patchValue({
      client_id: selectedValue,
      client_name: selectedText
    });
  }

  getPartnerDetails(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;
    this.addNewUser.patchValue({
      partner_id: selectedValue,
      partner_name: selectedText
    });
  }

  getAllClient(authToken: string): void {
    this.indedentService.getAllClient(authToken,'','','').subscribe(
      (res: any) => {
        this.clientList = res.result;
      },
      error => {
        // Handle error
      }
    );
  }

  getAllPartner(authToken: string): void {
    this.indedentService.getAllPartner(authToken,'', '', '').subscribe(
      (res: any) => {
        this.partnerList = res.result;
        // console.log(this.partnerList);

      },
      error => {
        // Handle error
      }
    );
  }

  onRoleChnage(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;
    this.addNewUser.patchValue({
      role_text: selectedText
    });

    if(selectedValue == 8){
      this.showClient = true;
      this.showPartner = false;
    }else if(selectedValue == 11 || selectedValue == 12){
      this.showClient = false;
      this.showPartner = true;
    }else{
      this.showClient = false;
      this.showPartner = false;
    }

  }
  async insertUser() {
    this.isLoading = true;
    this.isFormSubmited2 = true;
    const data = this.addNewUser.value;
    data.password = 'Password#123';
    data.created_by = this.loginUserId;
    this.authToken = localStorage.getItem('access_token');

    if (this.addNewUser.valid) {
      this.http.post<any>(`${environment.apiURL}${constant.apiEndPoint.ADDUSER}`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false;
          if (response.status === 1) {
            this.addNewUser.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while adding the user.' });
        }
      );
      this.overallFormValid2 = '';
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

  allRoles(){
    this.displayModalRole = true;
    this.forceUpdate();
  }
  forceUpdate() {
    if (this.roleMaster) {
      this.roleMaster = this.roleMaster;
    }
  }

  showUserDetails(user: usersDetails): void {
    // this.displayModalUser = true;
    this.userDetailsData = user;
    // this.addNewUser.patchValue({
    //   role_id: null
    // })
  }

  confirmStatusChange(user: usersDetails): void {
    Swal.fire({
      title: `Are you sure you want to ${user.status ? 'deactivate' : 'activate'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleUserStatus(user);
      }
    });
  }

  toggleUserStatus(user: usersDetails): void {
    const newStatus = user.status === 1 ? 0 : 1;
    console.log(user._id, newStatus);
    this.indedentService.updateUserStatus(this.authToken, user._id, newStatus).subscribe(() => {
      user.status = newStatus;
      Swal.fire('Updated!', `User has been ${newStatus === 1 ? 'activated' : 'deactivated'}.`, 'success');
    }, error => {
      Swal.fire('Error!', 'There was an error updating the user.', 'error');
    });
  }

  editUserAccount = this.fb.group({
    updateUserId: ['',Validators.required],
    role_id: [0, Validators.required],
    role_text: ['', Validators.required],
    client_id: [''],
    partner_id: [''],
    client_name: [''],
    partner_name: [''],
    name: ['', [Validators.required, Validators.maxLength(50),this.customValidator.alphaSpaceValidator()]],
    mobile: ['',[Validators.required,this.customValidator.onlynumberValidator()]],
    company: ['', Validators.maxLength(50)],
    department: ['', Validators.maxLength(50)],
    designation: ['',[Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,-]{1,100}$')]],
    gender: ['Male'],
    zone: ['',Validators.required],
    state: ['',Validators.required],
    city: ['',Validators.required],
    pincode: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
    address: ['']
  })

  populateUserEditForm(profileData: usersDetails): void {
    if (profileData) {
      this.editUserAccount.patchValue({
        updateUserId: profileData._id,
        role_id: profileData.role_id,
        role_text: profileData.role_text,
        client_id: profileData.client_id,
        partner_id: profileData.partner_id,
        client_name: profileData.client_name,
        name: profileData.name,
        mobile: profileData.mobile,
        company: profileData.company,
        department: profileData.department,
        designation: profileData.designation,
        gender: profileData.gender || 'Male',
        zone: profileData.zone,
        state: profileData.state,
        city: profileData.city,
        pincode: profileData.pincode,
        address: profileData.address
      });
    }
  }

  onUserRoleChnage(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;
    this.editUserAccount.patchValue({
      role_text: selectedText
    });
  }

  getEditClientDetails(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;
    this.editUserAccount.patchValue({
      client_id: selectedValue,
      client_name: selectedText
    });
  }

  showEditModal(user: usersDetails): void {
    // console.log(user);
    this.selectedUser = user;
    this.populateUserEditForm(user);
    this.displayModal = true;

    if(user.role_id == 8){
      this.showClient = true;
      this.showPartner = false;
    }else if(user.role_id == 9){
      this.showClient = false;
      this.showPartner = true;
    }else{
      this.showClient = false;
      this.showPartner = false;
    }


    var selectedZoneId:any = 0;
    if( user.zone == 'East'){
      selectedZoneId = 1;
    }else if(user.zone == 'West'){
      selectedZoneId = 4;
    }else if(user.zone == 'North'){
      selectedZoneId = 2;
    }else if(user.zone == 'South'){
      selectedZoneId = 3;
    }
    this.getStateData(this.authToken, selectedZoneId);
    const selectedState = this.stateData.find(state => state.name === user.state);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken, selectedStateId);
  }
  

  async updateUser() {
    this.isLoading = true;
    this.isFormSubmited4 = true;
    const data = this.editUserAccount.value;
    const updatedId = this.editUserAccount.controls.updateUserId.value;
    this.authToken = localStorage.getItem('access_token');

    if (this.editUserAccount.valid) {
      this.http.put<any>(`${environment.apiURL}${constant.apiEndPoint.EDITMYACCOUNT}?id=${updatedId}`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false;
          if (response.status === 1) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the user account.' });
        }
      );
      this.overallFormValid4 = '';
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

  editNewRole=this.fb.group({
    role_Id:[0,Validators.required],
    role_name:['',Validators.required],

      userManagment:this.fb.group({
        read:[false],
        write:[false],
        create:[false],
      }),
      
      clientManagment:
        this.fb.group({
          read:[false,Validators.required],
          write:[false,Validators.required],
          create:[false,Validators.required]
      }),

      partnerManagment:
        this.fb.group({
            read:[false,Validators.required],
            write:[false,Validators.required],
            create:[false,Validators.required]
      }),

      AssessmentManagment:
        this.fb.group({
          read:[false,Validators.required],
          write:[false,Validators.required],
          create:[false,Validators.required]
      }),

      EandIManagment:
        this.fb.group({
          read:[false,Validators.required],
          write:[false,Validators.required],
          create:[false,Validators.required]
      }),

      candidateManagment:
        this.fb.group({
          read:[false,Validators.required],
          write:[false,Validators.required],
          create:[false,Validators.required]
      }),

      addindentManagment:
        this.fb.group({
          read:[false,Validators.required],
          write:[false,Validators.required],
          create:[false,Validators.required]
      }),

      assignRecruiter:
        this.fb.group({
          read:[false,Validators.required],
          write:[false,Validators.required],
          create:[false,Validators.required]
      }),

      editIndent:
        this.fb.group({
          read:[false,Validators.required],
          write:[false,Validators.required],
          create:[false,Validators.required]
      }),

  });


  onSubmit():void{
    if(this.editNewRole.valid){
      console.log('FormSubmited',this.editNewRole.value)
      // this.displayModalnewRole=false
    }
    
  }
  checkCheckboxes1() {
    const userManagment = this.editNewRole.get('userManagment');
    if (userManagment) {
      const read = userManagment.get('read')?.value;
      const write = userManagment.get('write')?.value;
      const create = userManagment.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage1 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
    }
  }
  checkCheckboxes2() {
    const clientManagment = this.editNewRole.get('clientManagment');
    if (clientManagment) {
      const read = clientManagment.get('read')?.value;
      const write = clientManagment.get('write')?.value;
      const create = clientManagment.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage2 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
      
    }
  }
  checkCheckboxes3() {
    const partnerManagment = this.editNewRole.get('partnerManagment');
    if (partnerManagment) {
      const read = partnerManagment.get('read')?.value;
      const write = partnerManagment.get('write')?.value;
      const create = partnerManagment.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage3 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
      
    }
  }
  checkCheckboxes4() {
    const AssessmentManagment = this.editNewRole.get('AssessmentManagment');
    if (AssessmentManagment) {
      const read = AssessmentManagment.get('read')?.value;
      const write = AssessmentManagment.get('write')?.value;
      const create = AssessmentManagment.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage4 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
      
    }
  }
  checkCheckboxes5() {
    const EandIManagment = this.editNewRole.get('EandIManagment');
    if (EandIManagment) {
      const read = EandIManagment.get('read')?.value;
      const write = EandIManagment.get('write')?.value;
      const create = EandIManagment.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage5 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
      
    }
  }
  checkCheckboxes6() {
    const candidateManagment = this.editNewRole.get('candidateManagment');
    if (candidateManagment) {
      const read = candidateManagment.get('read')?.value;
      const write = candidateManagment.get('write')?.value;
      const create = candidateManagment.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage6 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
      
    }
  }
  checkCheckboxes7() {
    const addindentManagment = this.editNewRole.get('addindentManagment');
    if (addindentManagment) {
      const read = addindentManagment.get('read')?.value;
      const write = addindentManagment.get('write')?.value;
      const create = addindentManagment.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage7 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
      
    }
  }
  checkCheckboxes8() {
    const assignRecruiter = this.editNewRole.get('assignRecruiter');
    if (assignRecruiter) {
      const read = assignRecruiter.get('read')?.value;
      const write = assignRecruiter.get('write')?.value;
      const create = assignRecruiter.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage8 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      }
      
    }
  }
  checkCheckboxes9() {
    const editIndent = this.editNewRole.get('editIndent');
    if (editIndent) {
      const read = editIndent.get('read')?.value;
      const write = editIndent.get('write')?.value;
      const create = editIndent.get('create')?.value;

      if (!read && !write && !create) {
        // this.apiValidationMessage9 = 'Please select at least one checkbox.';
        // console.log('Please select at least one checkbox.');
      } 
    }
  }
  roleClick():void{
    // const data = this.editNewRole.controls.userManagment.value;
    this.checkCheckboxes1();
    this.checkCheckboxes2();
    this.checkCheckboxes3();
    this.checkCheckboxes4();
    this.checkCheckboxes5();
    this.checkCheckboxes6();
    this.checkCheckboxes7();
    this.checkCheckboxes8();
    this.checkCheckboxes9();



    if (this.editNewRole.valid) {
      // Handle valid form submission
    } else {
      const data1 = this.editNewRole.controls.userManagment.value;
      const data2= this.editNewRole.controls.clientManagment.value;
      
      //console.log(data1);
      //console.log(data2);
    }
  
  }

  onCheckboxselect1(event: Event, cname: any) {
    const checked = (event.target as HTMLInputElement).checked;
    var errorcount = 0;
    console.log('Checkbox value changed:', cname, checked);

    if (cname=='read'&& checked !=true) {
      errorcount = 1;
      // console.log('Please select at least one checkbox.');
      // this.apiValidationMessage1='';
    }else{
      // this.apiValidationMessage1='Please select at least one checkbox.'
    }
  }

  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  onSelectChange(event: Event): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage; // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;
    this.getAllUsers(this.authToken, '');
  }


  // nextPage(): void {
  //   if (this.currentPage * this.itemsPerPage < this.totalRecord) {
  //       this.currentPage++;

  //       // Calculate startIndex2 and endIndex2 based on the current page and itemsPerPage
  //       this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //       this.startIndex2 = this.startIndex + 1;
  //       this.endIndex2 = this.currentPage * this.itemsPerPage;

  //       // Ensure endIndex2 doesn't exceed the total records
  //       if (this.endIndex2 > this.totalRecord) {
  //           this.endIndex2 = this.totalRecord;
  //       }

  //       this.endIndex = this.startIndex + this.itemsPerPage;
  //       this.endIndex = this.endIndex-10;
        
  //       // Fetch the new set of partners based on pagination
  //       this.getAllUsers(this.authToken, '');

  //       // Enable/disable pagination buttons
  //       this.isDisabled = this.currentPage > 1 ? "" : "disabled";
  //       this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
  //   }

  // }

  // prevPage(): void {
  //   if (this.currentPage > 1) {
  //       this.currentPage--;
  
  //       // Calculate startIndex and endIndex dynamically based on the current page
  //       this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //       this.startIndex2 = this.startIndex + 1;
  //       this.endIndex2 = this.currentPage * this.itemsPerPage;
  
  //       // Ensure endIndex2 doesn't exceed total records
  //       if (this.endIndex2 > this.totalRecord) {
  //           this.endIndex2 = this.totalRecord;
  //       }
  
  //       this.endIndex = this.startIndex + this.itemsPerPage;
  //       this.endIndex = this.endIndex-10;
  //       // Fetch the previous set of partners based on pagination
  //       this.getAllUsers(this.authToken, '');

  //       // Enable/disable pagination buttons
  //       this.isDisabled = this.currentPage > 1 ? "" : "disabled";
  //       this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
  //   }
  // }
}
