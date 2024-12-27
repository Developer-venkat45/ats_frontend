import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, ClientResponse, ClientResponse2 } from '../../core/model/model';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import Swal from 'sweetalert2';
import { CommonModule, DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TreeSelectModule } from 'primeng/treeselect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [TooltipModule, FormsModule, NavbarComponent, CommonModule, DialogModule, NgMultiSelectDropDownModule, ReactiveFormsModule, TreeSelectModule, NgxSkeletonLoaderModule, RouterModule, ToastModule, CalendarModule, DatePipe, AccordionModule],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.css',
  providers: [DatePipe],
})
export class PartnerComponent {
  clientService = inject(DashboardService);
  authToken: any;
  clientList: ClientResponse2[] = [];
  selectedClient: ClientResponse2 | null = null;
  displayModalAdd: boolean = false;
  displayModal: boolean = false;
  imageUrl: string = '../assets/images/preview.png';
  defaultImage: string = '../assets/images/preview.png';
  file: any = "";
  degreeData: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  fb = inject(FormBuilder);
  apiMessage: any = "";
  isFormSubmited: boolean = false;
  overallFormValid: string = "";
  isLoading: boolean = false;
  loader: boolean = true;
  loader2: boolean = true;
  loaderCount: number = 10;
  loginUserName: any;
  loginUserId: any;
  industryData: any[] = [];
  sectorData: any[] = [];
  locationData: any[] = [];
  apiMessage2: any = "";
  isFormSubmited2: boolean = false;
  overallFormValid2: string = "";
  showmsme: boolean = true;
  showgst: boolean = true;
  showgst2: boolean = true;
  stateData: any[] = [];
  cityData: any[] = []
  partnerName: any;
  partnerFirmName: any;
  selectedPartnerId: any;
  positionLevel: any[] = [];
  roleData: any[] = [];
  stateData2: any[] = [];


  limit: any = 10;
  skip: number = 0;
  totalRecord: number = 0;
  filterdRecord: number = 0;
  fetchedRecord: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  startIndex: number = 0;
  endIndex: number = 10;
  totalPages: number = 0;
  startIndex2: number = 1;
  endIndex2: number = 10;

  isDisabled: string = '';
  isDisabled2: string = '';

  selectedPartner: any | null = null;
  partnerList: any[] = [];
  partnerInsertData: any;
  partnerImageUrl: string = '../assets/images/preview.png';
  partnerLogoFile: any = "";
  gstLogoFile: any = "";
  gstImageUrl: string = '../assets/images/preview.png';
  pancardLogoFile: any = "";
  pancardImageUrl: string = '../assets/images/preview.png';
  msmeLogoFile: any = "";
  msmeImageUrl: string = '../assets/images/preview.png';
  chequeLogoFile: any = "";
  chequeImageUrl: string = '../assets/images/preview.png';
  baseAPIURL: any;
  searchName: string = '';
  searchFirmName: string = '';
  searchstatus: string = '';
  approve: string = '';
  searchIndustry: any = '';
  searchLocation: any = '';
  searchPartnetType: any = '';

  loginUserRole: string = '';
  expireDate: boolean = false
  reason: boolean = false

  visible: boolean = false;
  isFormSubmited3: boolean = false;
  apiMessage3: any = "";
  overallFormValid3: string = '';
  partnerStatus: string = ""
  isVerified: boolean = false
  isSubmited: boolean = false
  selectedStatus: string = '';
  selectedReferredType: any;
  label: string = "Logo";
  slectedPartnerType: any;

  showNotification: boolean = false;
  checkedPartner: any[] = [];

  showNotificationModel: boolean = false;
  showWhatsAppData: boolean = false;
  showMailData: boolean = false;
  showMessage: boolean = true;

  searchMail: string = "";
  notificationList: any[] = [];
  seletedType: any;
  hideMTData: boolean = true;
  sanitizedContent: SafeHtml = "";
  loader3: boolean = true;

  showEachTemplateDetails: boolean = false;
  sourceName: any;
  sourceId: any
  roleId: any
  roleName: any



  private customValidator = new CustomValidatorComponent();
  private parseDate(date: string): Date {
    return new Date(date); // Converts ISO string to Date object
  }


  constructor(private route: ActivatedRoute, private messageService: MessageService, private http: HttpClient, private datePipe: DatePipe, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');

    this.sourceName = localStorage.getItem('name');
    this.sourceId = localStorage.getItem('id');
    this.roleId = localStorage.getItem('role_id');
    this.roleName = localStorage.getItem('role_name');

    this.getJobIndustryData(this.authToken, 'job industry');
    this.getJobSectorData(this.authToken, 'sector');
    this.getLocationData(this.authToken);
    this.getRoleData(this.authToken, 'role');
    this.getStateData2(this.authToken, '');
    // this.fetchImage();

    this.dropdownSettings = {
      idField: 'item_text',
      textField: 'item_text',
      enableCheckAll: false,
      itemsShowLimit: 5,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };
    this.positionLevel = ['Entry Level', 'Mid Level', 'Senior Level'];

    this.degreeData = ['Offroll Hiring', 'BFSI', 'Non BFSI', 'IT Hiring', 'Pharma', 'Manufacturing', 'Lateral Hiring'];
    this.baseAPIURL = environment.apiURL;
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');

    const user: any = localStorage.getItem('user');
    this.loginUserRole = user;

    if (this.loginUserRole == "Recruiter") {
      this.searchstatus = "approved";
    } else {
      this.searchstatus = '';
    }
    this.getAllPartner(this.authToken, '', '', '', this.limit, this.skip, '', this.searchstatus, '', '', '');
  }
  getAllPartner(authToken: string, id: string, name: string, firmName: string, limit: string, skip: number, approve: string, accStatus: string, industry: string, location: string, partnerType: string): void {
    this.clientService.getAllPartner(authToken, id, name, firmName, limit, skip, approve, accStatus, industry, location, partnerType).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.partnerList = res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
          this.loader2 = false;
          this.loader = false;
          if (this.fetchedRecord < this.limit) {
            if (this.fetchedRecord <= 10) {
              this.endIndex2 = this.totalRecord;
            } else {
              this.endIndex2 = this.fetchedRecord;
            }
            this.endIndex = this.fetchedRecord;
            this.startIndex = 0;
          }
          this.totalPages = Math.ceil(this.totalRecord / this.itemsPerPage);
          var i = 0;
          for (const data of this.partnerList) {
            const expirationDate = new Date(data.aggrementExpirationdate);
            const currentDate = new Date();
            if (expirationDate < currentDate) {
              this.partnerList[i]['expired'] = true;
            } else {
              this.partnerList[i]['expired'] = false;
            }
            i++;
          }
        } else {
          this.partnerList = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader2 = false;
          this.loader = false;
          this.endIndex = 0;
        }
        // console.log(this.partnerList)
      },
      error => {
        // Handle error
      }
    );
  }

  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  confirmStatusChange(partner: any): void {
    Swal.fire({
      title: `Are you sure you want to ${partner.status ? 'deactivate' : 'activate'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleUserStatus(partner);
      }
    });
  }


  toggleUserStatus(partner: any): void {
    const newStatus = partner.status === 1 ? 0 : 1;
    // console.log(partner._id, newStatus);
    this.clientService.updatePartnerStatus(this.authToken, partner._id, newStatus).subscribe(() => {
      partner.status = newStatus;
      Swal.fire('Updated!', `Partner has been ${newStatus === 1 ? 'activated' : 'deactivated'}.`, 'success');
    }, error => {
      Swal.fire('Error!', 'There was an error updating the partner.', 'error');
    });
  }


  //reset Partial Form:
  resetonpartnerPartialForm() {
    this.editPartner.patchValue({
      partnerLogo: '',
    });
    this.editPartner.get('partnerLogo')?.markAsPristine();
  }
  resetPancardPartialForm() {
    this.editPartner.patchValue({
      pancardImage: '',
    });
    this.editPartner.get('pancardImage')?.markAsPristine();
  }
  resetGstimagePartialForm() {
    this.editPartner.patchValue({
      gstinImage: ''
    });
    this.editPartner.get('gstinImage')?.markAsPristine();
  }
  resetMSMEimagePartialForm() {
    this.editPartner.patchValue({
      msmeImage: ''
    });
    this.editPartner.get('msmeImage')?.markAsPristine();
  }
  resetchequeimagePartialForm() {
    this.editPartner.patchValue({
      chequeImage: ''
    });
    this.editPartner.get('chequeImage')?.markAsPristine();
  }


  onpartnerLogoSelected(event: any) {
    this.partnerLogoFile = File = event.target.files[0];
    if (this.partnerLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];


      if (this.partnerLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetonpartnerPartialForm();
        this.partnerImageUrl = '../assets/images/preview.png';
      } else if (!validFileTypes.includes(this.partnerLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetonpartnerPartialForm();
        this.partnerImageUrl = '../assets/images/preview.png';
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.partnerImageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.partnerLogoFile);
      }
    }

  }
  onPancardSelected(event: any) {
    this.pancardLogoFile = File = event.target.files[0];
    if (this.pancardLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];


      if (this.pancardLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetPancardPartialForm();
        this.pancardImageUrl = '../assets/images/preview.png';
      } else if (!validFileTypes.includes(this.pancardLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetPancardPartialForm();
        this.pancardImageUrl = '../assets/images/preview.png';
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.pancardImageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.pancardLogoFile);
      }
    }

  }
  onGstSelected(event: any) {
    this.gstLogoFile = File = event.target.files[0];
    if (this.gstLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];


      if (this.gstLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetGstimagePartialForm();
        this.gstImageUrl = '../assets/images/preview.png';
      } else if (!validFileTypes.includes(this.gstLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetGstimagePartialForm();
        this.gstImageUrl = '../assets/images/preview.png';
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.gstImageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.gstLogoFile);
      }
    }
  }

  onMsmeSelected(event: any) {
    this.msmeLogoFile = File = event.target.files[0];
    if (this.msmeLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];


      if (this.msmeLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetMSMEimagePartialForm();
        this.msmeImageUrl = '../assets/images/preview.png';
      } else if (!validFileTypes.includes(this.msmeLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetMSMEimagePartialForm();
        this.msmeImageUrl = '../assets/images/preview.png';
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.msmeImageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.msmeLogoFile);
      }
    }
  }
  onChequeSelected(event: any) {
    this.chequeLogoFile = File = event.target.files[0];
    if (this.chequeLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (this.chequeLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetchequeimagePartialForm();
        this.chequeImageUrl = '../assets/images/preview.png';
      } else if (!validFileTypes.includes(this.chequeLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetchequeimagePartialForm();
        this.chequeImageUrl = '../assets/images/preview.png';
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.chequeImageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.chequeLogoFile);
      }
    }
  }





  editPartner = this.fb.group({
    updatePartnerId: [''],
    vendorName: ['', [Validators.required, this.customValidator.alphabetValidator()]],
    partnerLogo: [''],
    shortName: ['', [this.customValidator.alphabetValidator()]],
    firmName: ['', [Validators.required, this.customValidator.alphaNumaricValidator()]],
    mdName: ['', [this.customValidator.alphabetValidator()]],
    designation: ['', [this.customValidator.designationValidator()]],
    primaryContactNumber: ['', [Validators.required, this.customValidator.onlynumberValidator()]],
    secondaryContactNumber: ['', [this.customValidator.onlynumberValidator()]],
    primaryEmailId: ['', [Validators.required, this.customValidator.emailValidator()]],
    secondaryEmailId: ['', [this.customValidator.emailValidator()]],
    partnerType: [''],
    partnerCategory: [''],
    recruitmentPresence: [''],
    currentlyHiringIndustries: ['', Validators.required],
    // referredBy: ['',[Validators.required,this.customValidator.alphabetValidator()]],
    positionLevel: ['', Validators.required],
    currentlyWorkingRoles: ['', Validators.required],
    employeeCount: ['', [Validators.required, this.customValidator.negativeValueValidator()]],
    gstin: [''],
    gistinNumber: [''],
    gstinImage: [''],
    pancard: ['', [this.customValidator.panNumberValidator()]],
    pancardImage: [''],
    msme: [''],
    msmeNumber: ['', [this.customValidator.msmeCodeValidator()]],
    msmeImage: [''],
    bankName: ['', [this.customValidator.bankNameValidator()]],
    accountName: ['', [this.customValidator.bankNameValidator()]],
    branchName: ['', [this.customValidator.bankbranchNameValidator()]],
    accountNumber: ['', [this.customValidator.accountnumberValidator()]],
    ifscCode: ['', [this.customValidator.ifscnumberValidator()]],
    bankAddress: ['', [this.customValidator.addressValidator()]],
    micrCode: ['', [this.customValidator.micrCodeValidator()]],
    chequeImage: [''],
    zone: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    address: ['', [Validators.required, this.customValidator.addressValidator()]],
    registeredAddress: ['', [Validators.required, this.customValidator.addressValidator()]],
    dateOfIncorporation: [null as Date | null],
    dateOfBirth: [null as Date | null, [Validators.required, this.customValidator.minAgeValidator(18)]],
    source: this.fb.group({
      options: [''],
      others: [''],
    }),
  })

  populatePartnerEditForm(partnerData: any): void {
    if (partnerData) {
      // console.log(partnerData)
      this.editgstinCheck(partnerData.gstin ?? false);
      this.msmeCheck(partnerData.msme ?? false);
      this.editPartner.patchValue({
        updatePartnerId: partnerData._id,
        vendorName: partnerData.vendorName,
        shortName: partnerData.shortName,
        firmName: partnerData.firmName,
        mdName: partnerData.mdName,
        designation: partnerData.designation,
        primaryContactNumber: partnerData.primaryContactNumber,
        secondaryContactNumber: partnerData.primaryContactNumbe,
        primaryEmailId: partnerData.primaryEmailId,
        secondaryEmailId: partnerData.secondaryEmailId,
        partnerType: partnerData.partnerType,
        partnerCategory: partnerData.partnerCategory,
        recruitmentPresence: partnerData.recruitmentPresence,
        currentlyHiringIndustries: partnerData.currentlyHiringIndustries,
        // referredBy: partnerData.referredBy,
        positionLevel: partnerData.positionLevel,
        currentlyWorkingRoles: partnerData.currentlyWorkingRoles,
        employeeCount: partnerData.employeeCount,
        gstin: partnerData.gstin,
        gistinNumber: partnerData.gistinNumber,
        pancard: partnerData.pancard,
        msme: partnerData.msme,
        msmeNumber: partnerData.msmeNumber,
        bankName: partnerData.bankName,
        accountName: partnerData.accountName,
        branchName: partnerData.branchName,
        accountNumber: partnerData.accountNumber,
        ifscCode: partnerData.ifscCode,
        bankAddress: partnerData.bankAddress,
        micrCode: partnerData.micrCode,
        zone: partnerData.zone,
        state: partnerData.state,
        city: partnerData.city,
        pincode: partnerData.pincode,
        address: partnerData.address,
        registeredAddress: partnerData.registeredAddress,
        //dateOfIncorporation: this.parseDate(partnerData.dateOfIncorporation),
        //dateOfBirth: this.parseDate(partnerData.dateOfBirth),
        //dateOfBirth: partnerData.dateOfBirth !== null ? this.parseDate(partnerData.dateOfBirth) : '',
      });
      if (partnerData.dateOfBirth !== '') {
        this.editPartner.patchValue({
          dateOfBirth: this.parseDate(partnerData.dateOfBirth),
        })
      }
      if (partnerData.dateOfIncorporation !== '') {
        this.editPartner.patchValue({
          dateOfIncorporation: this.parseDate(partnerData.dateOfIncorporation),
        })
      }
      this.editPartner.get('source')?.patchValue({
        options: partnerData.source?.options ?? '',
        others: partnerData.source?.others ?? '',
      })
    }
  }

  showEditModal(partner: any): void {
    //console.log(partner);
    this.selectedPartner = partner;
    this.populatePartnerEditForm(partner);
    this.getPartnerFields2(partner.partnerCategory);
    this.getReferredFields2(partner.source.options);
    this.displayModal = true;
    if (partner.partnerLogo != '') { this.partnerImageUrl = environment.apiURL + '' + partner.partnerLogo; }
    if (partner.gstinImage != '' && partner.gstinImage != null) {
      const fileExtensionGst = partner.gstinImage.split('.').pop()?.toLowerCase();
      if (fileExtensionGst != 'pdf') {
        this.gstImageUrl = environment.apiURL + partner.gstinImage;
      } else {
        this.gstImageUrl = '../assets/images/pdfpreview.png';
      }
    }
    if (partner.pancardImage != '') {
      this.pancardImageUrl = environment.apiURL + '' + partner.pancardImage;
      const fileExtensionPancard = partner.pancardImage.split('.').pop()?.toLowerCase();
      if (fileExtensionPancard != 'pdf') {
        this.pancardImageUrl = environment.apiURL + partner.pancardImage;
      } else {
        this.pancardImageUrl = '../assets/images/pdfpreview.png';
      }
    }
    if (partner.msmeImage != '' && partner.msmeImage != null) {
      const fileExtensionMsmse = partner.msmeImage.split('.').pop()?.toLowerCase();
      if (fileExtensionMsmse != 'pdf') {
        this.msmeImageUrl = environment.apiURL + partner.msmeImage;
      } else {
        this.msmeImageUrl = '../assets/images/pdfpreview.png';
      }
    }
    if (partner.chequeImage != '') {
      const fileExtensionCheque = partner.chequeImage.split('.').pop()?.toLowerCase();
      if (fileExtensionCheque != 'pdf') {
        this.chequeImageUrl = environment.apiURL + '' + partner.chequeImage;
      } else {
        this.chequeImageUrl = '../assets/images/pdfpreview.png';
      }
    }
    this.editgstinCheck(this.selectedPartner?.gstin);
    this.msmeCheck(this.selectedPartner?.msme);

    var selectedZoneId: any = 0;
    if (partner.zone == 'East') {
      selectedZoneId = 1;
    } else if (partner.zone == 'West') {
      selectedZoneId = 4;
    } else if (partner.zone == 'North') {
      selectedZoneId = 2;
    } else if (partner.zone == 'South') {
      selectedZoneId = 3;
    }
    this.getStateData(this.authToken, selectedZoneId);
    const selectedState = this.stateData.find(state => state.name === partner.state);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken, selectedStateId);
    // console.log(this.selectedPartner.source.options);
  }


  getStateOnZoneChnage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;

    var selectedZoneId: any = 0;
    if (selectedStateName == 'East') {
      selectedZoneId = 1;
    } else if (selectedStateName == 'West') {
      selectedZoneId = 4;
    } else if (selectedStateName == 'North') {
      selectedZoneId = 2;
    } else if (selectedStateName == 'South') {
      selectedZoneId = 3;
    }
    this.getStateData(this.authToken, selectedZoneId);
  }
  getStateData(authToken: string, zoneId: string): void {
    this.clientService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
        //console.log(this.stateData)
      },
      error => {
        // Handle error
      }
    );
  }
  getCityOnStateChnage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateName = selectElement.value;
    const selectedState = this.stateData.find(state => state.name === selectedStateName);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken, selectedStateId);
  }

  getCityData(authToken: string, stateId: string): void {
    this.clientService.getCity(authToken, stateId).subscribe(
      (res: any) => {
        this.cityData = res.result[0].data;
      },
      error => {
        // Handle error
      }
    );
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

  getJobSectorData(authToken: string, master: string): void {
    this.clientService.getAllMasterData(authToken, master).subscribe(
      (res: any) => {
        this.sectorData = res.data;
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

  searchPartnerName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchName = inputElement.value;
    this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
    this.loader2 = true;
  }

  searchPartnerFirmName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchFirmName = inputElement.value;
    this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
    this.loader2 = true;
  }

  searchCanStatus(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    this.searchstatus = inputElement.value;
    this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
    this.loader2 = true;
  }

  searchCanLocation(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    this.searchLocation = inputElement.value;
    this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
    this.loader2 = true;
  }

  searchCanIndustry(event: Event): void {
    const inputElement = event?.target as HTMLSelectElement;
    this.searchIndustry = inputElement.value;
    this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
    this.loader2 = true;
  }

  searchCanPartnerType(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    this.searchPartnetType = inputElement.value;
    this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
    this.loader2 = true;
  }

  onSearchSubmit() {
    if (this.searchName || this.searchFirmName || this.searchstatus || this.searchLocation || this.searchIndustry || this.searchPartnetType) {
      this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
      this.loader2 = true;
    } else {
      this.loader2 = false;
      this.searchName = '';
      this.searchFirmName = '';
      this.searchstatus = '';
      this.searchLocation = '';
      this.searchIndustry = '';
      this.searchPartnetType = '';
    }
  }

  resetFilter() {
    this.searchName = '';
    this.searchFirmName = '';
    this.searchstatus = '';
    this.searchIndustry = '';
    this.searchLocation = '';
    this.searchPartnetType = '';
    this.getAllPartner(this.authToken, '', '', '', this.limit, 0, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
  }
  onSelectChange(event: any): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage; // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;

    // Fetch the data for the new itemsPerPage value
    this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.endIndex2, '', this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
  }

  // onSelectChange(event: Event):void{
  //   this.limit = (event.target as HTMLSelectElement).value;
  //   this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName,this.limit,this.skip,this.approve,this.searchstatus);


  // }
  //*editpartner//
  editgstinCheck(gst: any) {
    this.showgst = gst;
    const gistinNumber = this.editPartner.get('gistinNumber');
    const gstinImage = this.editPartner.get('gstinImage');
    if (this.showgst == false) {
      gistinNumber?.clearValidators();
    } else {
      gistinNumber?.setValidators([Validators.required, this.customValidator.gstnumberValidator()]);
    }
    gistinNumber?.updateValueAndValidity();

    // if(this.showgst == false){
    //   gstinImage?.clearValidators();
    // }else{
    //   gstinImage?.setValidators([Validators.required]);
    // }
    // gstinImage?.updateValueAndValidity();
  }
  msmeCheck(msme: any) {

    this.showmsme = msme;
    //console.log("here"+this.showmsme);
    const msmeNumber = this.editPartner.get('msmeNumber');
    const msmeImage = this.editPartner.get('msmeImage');
    if (this.showmsme == false) {
      msmeNumber?.clearValidators();
    } else {
      msmeNumber?.setValidators([Validators.required, this.customValidator.msmeCodeValidator()]);
    }
    msmeNumber?.updateValueAndValidity();

    // if(this.showmsme == false){
    //   msmeImage?.clearValidators();
    // }else{
    //   msmeImage?.setValidators([Validators.required]);
    // }
    // msmeImage?.updateValueAndValidity();
  }
  edittoUppercase() {
    const pancardControl = this.editPartner.get('pancard');
    if (pancardControl) {
      const value = pancardControl.value;
      if (value && typeof value === 'string') {
        pancardControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }
  editmsmetoUppercase() {
    const pancardControl = this.editPartner.get('msmeNumber');
    if (pancardControl) {
      const value = pancardControl.value;
      if (value && typeof value === 'string') {
        pancardControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }


  updatePartnerAprove: any = this.fb.group({
    partnerType: ['', Validators.required],
    comment: ['', [Validators.maxLength(500)]],
    partnerStatus: ['', Validators.required],
    reason: [''],
    aggrementExpirationdate: [''],
  })


  updateCanPartner(item: any) {
    this.visible = true;
    this.partnerName = item.vendorName;
    if (item.partnerCategory != "Freelancer") {
      this.partnerFirmName = item.firmName;
    } else {
      this.partnerFirmName = item.vendorName;
    }
    this.partnerStatus = item.partnerStatus;
    this.isVerified = item.isVerified;
    this.isSubmited = item.isSubmited;
    this.selectedPartnerId = item._id;
    this.selectedStatus = '';
    this.updatePartnerAprove.patchValue({
      partnerStatus: '',
      partnerType: item.partnerType,
      comment: '',
      reason: '',
      aggrementExpirationdate: '',
    })



  }

  partnerStatusChange(event: Event): void {
    const selectedValue = event.target as HTMLSelectElement;
    this.selectedStatus = selectedValue.value;
    if (this.selectedStatus == "rejected") {
      this.updatePartnerAprove.controls.reason.setValidators([Validators.required]);
      this.updatePartnerAprove.controls.reason.updateValueAndValidity();
      this.updatePartnerAprove.controls.aggrementExpirationdate.clearValidators();
      this.updatePartnerAprove.controls.aggrementExpirationdate.updateValueAndValidity();
    } else {
      this.updatePartnerAprove.controls.aggrementExpirationdate.setValidators([Validators.required]);
      this.updatePartnerAprove.controls.aggrementExpirationdate.updateValueAndValidity();
      this.updatePartnerAprove.controls.reason.clearValidators();
      this.updatePartnerAprove.controls.reason.updateValueAndValidity();
    }
  }

  updateAproveStage() {
    this.isFormSubmited3 = true;
    this.isLoading = true; // Start 
    //console.log(this.updatePartnerAprove.value)
    const data: any = {
      partnerStatus: this.updatePartnerAprove.controls.partnerStatus.value,
      partnerType: this.updatePartnerAprove.controls.partnerType.value,
      statusLog: {
        status: this.updatePartnerAprove.controls.partnerStatus.value,
        comment: this.updatePartnerAprove.controls.comment.value,
        createdByName: this.loginUserName,
        createdById: this.loginUserId
      }
    }
    if (this.updatePartnerAprove.controls.partnerStatus.value === "approved") {
      let formattedDate = this.datePipe.transform(this.updatePartnerAprove.controls.aggrementExpirationdate.value, 'yyyy-MM-dd')
      data['statusLog']['aggrementExpirationdate'] = formattedDate
    }

    if (this.updatePartnerAprove.controls.partnerStatus.value === "rejected") {
      data['statusLog']['reason'] = this.updatePartnerAprove.controls.reason.value
    }
    // this.updatePartnerAprove.value;
    //console.log(data)
    // data.aggrementExpirationdate = formattedDate;
    this.authToken = localStorage.getItem('access_token');

    if (this.updatePartnerAprove.valid) {
      this.http.put<any>(`${environment.apiURL}${constant.apiEndPoint.UPDATEPARTNERSTAGE}/${this.selectedPartnerId}`, data, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false; // Stop loading
          if (response.status === 1) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.getAllPartner(this.authToken, '', '', '', this.limit, this.skip, this.approve, this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);
            this.visible = false;
            this.reason = false;
            this.expireDate = false;
            this.updatePartnerAprove.reset()
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false; // Stop loading
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the stage.' });
        }
      );
      this.overallFormValid3 = "";
    } else {
      this.isLoading = false; // Stop loading
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  updatePartner() {
    this.isFormSubmited = true;
    this.isLoading = true;
    const data = this.editPartner.value;
    const updatedId = this.editPartner.controls.updatePartnerId.value;
    this.authToken = localStorage.getItem('access_token');

    const formData: FormData = new FormData();
    if (this.partnerLogoFile) {
      formData.append('partnerLogo', this.partnerLogoFile);
    }
    if (this.gstLogoFile) {
      formData.append('gstinImage', this.gstLogoFile);
    }
    if (this.pancardLogoFile) {
      formData.append('pancardImage', this.pancardLogoFile);
    }
    if (this.msmeLogoFile) {
      formData.append('msmeImage', this.msmeLogoFile);
    }
    if (this.chequeLogoFile) {
      formData.append('chequeImage', this.chequeLogoFile);
    }

    formData.append('partnerData', JSON.stringify(data));

    if (this.editPartner.valid) {
      this.http.put<any>(`${environment.apiURL}${constant.apiEndPoint.EDITPARTNER}?id=${updatedId}`, formData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false;
          if (response.status === 1) {
            // this.editPartner.reset();
            // this.getAllPartner(this.authToken, '', '', '', '10',0,'',this.searchstatus,'','','');
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the partner data.' });
        }
      );
      this.overallFormValid2 = '';
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  getPartnerFields2(partnerCategory: any) {
    this.slectedPartnerType = partnerCategory;

    const firmName = this.editPartner.get('firmName');
    const mdName = this.editPartner.get('mdName');
    const designation = this.editPartner.get('designation');
    const dateOfIncorporation = this.editPartner.get('dateOfIncorporation');

    if (this.slectedPartnerType != 'Freelancer') {
      firmName?.setValidators([Validators.required]);
      mdName?.setValidators([Validators.required]);
      designation?.setValidators([Validators.required]);
      this.label = "Logo";
      dateOfIncorporation?.setValidators([Validators.required]);
    } else {
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


  getPartnerFields(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.slectedPartnerType = selectedValue;

    const firmName = this.editPartner.get('firmName');
    const mdName = this.editPartner.get('mdName');
    const designation = this.editPartner.get('designation');
    const dateOfIncorporation = this.editPartner.get('dateOfIncorporation');

    if (this.slectedPartnerType != 'Freelancer') {
      firmName?.setValidators([Validators.required]);
      mdName?.setValidators([Validators.required]);
      designation?.setValidators([Validators.required]);
      this.label = "Logo";
      dateOfIncorporation?.setValidators([Validators.required]);
    } else {
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



  getReferredFields2(others: any) {
    this.selectedReferredType = others;

    const referredType = this.editPartner.get('others');
    if (this.selectedReferredType == "Others") {
      referredType?.setValidators([Validators.required]);
    } else {
      referredType?.clearValidators();
    }
    referredType?.updateValueAndValidity();
  }

  getReferredFields(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedReferredType = selectedValue;
    // console.log(this.selectedReferredType)

    const referredType = this.editPartner.get('others');
    if (this.selectedReferredType == "Others") {
      referredType?.setValidators([Validators.required]);
    } else {
      referredType?.clearValidators();
    }
    referredType?.updateValueAndValidity();
  }


  onCheckBoxCheck(pid: any, event: Event): void {
    const ischecked = (event.target as HTMLInputElement).checked;
    if (ischecked) {
      this.checkedPartner.push(pid);
    } else {
      this.checkedPartner = this.checkedPartner.filter(id => id !== pid);
    }
    this.showNotification = this.checkedPartner.length >= 1;
    // console.log('partnerLength',this.checkedPartner)
  }



  onNotifications() {
    this.showNotificationModel = true;
  }

  onWhatsAppChange(whatsApp: any): void {
    this.showWhatsAppData = whatsApp;
    this.showMailData = !whatsApp;
    this.showMessage = false;

    this.getNotificationType(this.authToken, 'whatsapp_bulk');
    this.seletedType = whatsApp ? 'whatsapp_bulk' : '';
  }

  onMailChange(email: any): void {
    this.showMailData = email;
    this.showWhatsAppData = !email;
    this.showMessage = false;

    this.getNotificationType(this.authToken, 'email_bulk');
    this.seletedType = email ? 'email_bulk' : '';
  }


  getNotificationType(authToken: string, type: string): void {
    this.clientService.getNotificationType(authToken, type).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.loader3 = false;
          this.notificationList = res.result;
          // var i = 0;
          // for (const body of this.notificationList){
          //   this.notificationList[i]['body'] = this.sanitizer.bypassSecurityTrustHtml(this.notificationList[i].body)
          // }
          for (let i = 0; i < this.notificationList.length; i++) {
            if (this.notificationList[i].type === 'alert') {
              this.notificationList[i]['body'] = this.sanitizer.bypassSecurityTrustHtml(this.notificationList[i].body);
            }

          }
        }
      },
      error => {
        //Handel error
      }
    );

  }


  sendBulkNotification(index: any): void {
    this.authToken = localStorage.getItem('access_token');
    const partnerListId = this.checkedPartner;
    const templateId = this.notificationList[index]["_id"];
    const source = {
      name: this.sourceName || null,
      id: this.sourceId || null,
      role_id: this.roleId,
      role_name: this.roleName,
    };
    const data = {
      "partner_list_ids": partnerListId,
      "notify_type": this.seletedType,
      "template_id": templateId,
      "source": source
    }
    if (this.notificationList) {
      const url = `${environment.apiURL}${constant.apiEndPoint.SENDBULKNOTIFICATION}`;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });
      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {

            if (response.status === 1) {

              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });

            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while reassigning the partner.' });
          }
        );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }

  }


  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecord) {
      this.currentPage++;

      // Calculate startIndex2 and endIndex2 based on the current page and itemsPerPage
      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.startIndex2 = this.startIndex + 1;
      this.endIndex2 = this.currentPage * this.itemsPerPage;

      // Ensure endIndex2 doesn't exceed the total records
      if (this.endIndex2 > this.totalRecord) {
        this.endIndex2 = this.totalRecord;
      }

      this.endIndex = this.startIndex + this.itemsPerPage - 10;

      // Fetch the new set of partners based on pagination
      this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.endIndex, '', this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);

      // Enable/disable pagination buttons
      this.isDisabled = this.currentPage > 1 ? "" : "disabled";
      this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      // Calculate startIndex and endIndex dynamically based on the current page
      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.startIndex2 = this.startIndex + 1;
      this.endIndex2 = this.currentPage * this.itemsPerPage;

      // Ensure endIndex2 doesn't exceed total records
      if (this.endIndex2 > this.totalRecord) {
        this.endIndex2 = this.totalRecord;
      }

      this.endIndex = this.startIndex + this.itemsPerPage - 10;

      // Fetch the previous set of partners based on pagination
      this.getAllPartner(this.authToken, '', this.searchName, this.searchFirmName, this.limit, this.endIndex, '', this.searchstatus, this.searchIndustry, this.searchLocation, this.searchPartnetType);

      // Enable/disable pagination buttons
      this.isDisabled = this.currentPage > 1 ? "" : "disabled";
      this.isDisabled2 = this.currentPage < this.totalPages ? "" : "disabled";
    }
  }


}
