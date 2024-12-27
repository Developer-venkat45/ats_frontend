import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid, ClientResponse, ClientResponse2 } from '../../core/model/model';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TreeSelectModule } from 'primeng/treeselect';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CustomValidatorComponent } from '../../validations/custom-validator.component';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-client',
  standalone: true,
  imports: [FormsModule, NavbarComponent, CommonModule, DialogModule, NgMultiSelectDropDownModule, ReactiveFormsModule, TreeSelectModule, NgxSkeletonLoaderModule, RouterModule, ToastModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {
  clientService = inject(DashboardService);
  authToken: any;
  clientList: ClientResponse2[] = [];
  selectedClient: ClientResponse2 | null = null;
  displayModalAdd: boolean = false;
  displayModal: boolean = false;
  imageUrl: string = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
  showgst: boolean = true;
  showgst2: boolean = true;
  pancardImageUrl: string = '../assets/images/preview.png';
  pancardLogoFile: any = "";

  gstLogoFile: any = "";
  gstImageUrl: string = '../assets/images/preview.png';

  file: any = "";
  degreeData: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  fb = inject(FormBuilder);
  apiMessage: any = "";
  isFormSubmited: boolean = false;
  overallFormValid: string = "";
  clientInsertData: any;
  industryData: any[] = [];
  sectorData: any[] = [];
  locationData: any[] = [];
  apiMessage2: any = "";
  isFormSubmited2: boolean = false;
  overallFormValid2: string = "";

  baseAPIURL: any;
  searchClientName: any;
  searchClientSector: any;
  searchClientIndustry: any;
  private customValidator = new CustomValidatorComponent();
  isLoading: boolean = false;
  loader: boolean = true;
  loader2: boolean = true;
  loaderCount: number = 10;
  loginUserName: any;
  loginUserId: any;
  zoneData: any[] = [];
  stateData: any[] = [];
  cityData: any[] = [];

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
  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getAllClient(this.authToken, '', '', '', '', this.limit, this.skip);
    this.getJobIndustryData(this.authToken, 'job industry');
    this.getJobSectorData(this.authToken, 'sector');
    this.getLocationData(this.authToken);
    this.getStateData(this.authToken, '');

    this.dropdownSettings = {
      idField: 'item_text',
      textField: 'item_text',
      enableCheckAll: false,
      itemsShowLimit: 3,
      // selectAllText: "Select All Items From List",
      // unSelectAllText: "UnSelect All Items From List",
      allowSearchFilter: true
    };

    this.baseAPIURL = environment.apiURL;
    this.loginUserId = localStorage.getItem('id');
    this.loginUserName = localStorage.getItem('name');
  }

  getAllClient(authToken: string, name: string, sector: string, industry: string, status: string, limit: string, skip: number): void {
    this.clientService.getAllClient(authToken, name, sector, industry, status, limit, skip).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.clientList = res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;
          this.loader = false;
          this.loader2 = false;
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
        } else {
          this.clientList = [];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.loader = false;
          this.loader2 = false;
          this.endIndex = 0;
        }
      },
      error => {
        // Handle error
      }
    );
  }


  confirmStatusChange(client: ClientResponse2): void {
    Swal.fire({
      title: `Are you sure you want to ${client.status ? 'deactivate' : 'activate'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleUserStatus(client);
      }
    });
  }


  toggleUserStatus(user: ClientResponse2): void {
    const newStatus = user.status === 1 ? 0 : 1;
    console.log(user._id, newStatus);
    this.clientService.updateClientStatus(this.authToken, user._id, newStatus).subscribe(() => {
      user.status = newStatus;
      Swal.fire('Updated!', `User has been ${newStatus === 1 ? 'activated' : 'deactivated'}.`, 'success');
    }, error => {
      Swal.fire('Error!', 'There was an error updating the user.', 'error');
    });
  }





  insertNewClient = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150), this.customValidator.alphabetSpeclValidator()]],
    clientLogo: ['', Validators.required],
    shortName: ['', [Validators.required, Validators.maxLength(150), this.customValidator.alphabetSpeclValidator()]],
    firmName: ['', [Validators.required, Validators.maxLength(150), this.customValidator.alphabetSpeclValidator()]],
    industry: ['', Validators.required],
    sector: ['', Validators.required],
    location: ['', Validators.required],
    pancard: ['', [Validators.required, this.customValidator.panNumberValidator()]],
    pancardImage: ['', Validators.required],
    gstin: [false],
    gistinNumber: [''],
    gstinImage: [''],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    state: ['', Validators.required],
    city: ['', Validators.required],
    address: ['', [Validators.required, Validators.maxLength(500)]],
    created_by: '666fcb51665b703fa25728b7'
  })

  addNewClient() {
    this.displayModalAdd = true;
    this.insertNewClient.reset();
    this.insertNewClient.patchValue({
      gstin: false,
      state: '',
      city: '',
    });
    this.editgstinCheck(this.insertNewClient.controls.gstin.value)
  }

  onFileSelected(event: any, operation: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const maxSize = 2 * 1024 * 1024;
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (operation == 'insert') {
        if (this.file.size > maxSize) {
          this.insertNewClient.controls.clientLogo.setErrors({ maxSize: true });
          return;
        }
        if (!validFileTypes.includes(this.file.type)) {
          this.insertNewClient.controls.clientLogo.setErrors({ invalidFileType: true });
          return;
        }
      } else {
        if (this.file.size > maxSize) {
          this.editClient.controls.clientLogo.setErrors({ maxSize: true });
          return;
        }
        if (!validFileTypes.includes(this.file.type)) {
          this.editClient.controls.clientLogo.setErrors({ invalidFileType: true });
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.file);
    }
  }


  resetPancardPartialForm() {
    this.insertNewClient.patchValue({
      pancardImage: '',
    });
    this.insertNewClient.get('pancardImage')?.markAsPristine();
  }
  resetGstimagePartialForm() {
    this.insertNewClient.patchValue({
      gstinImage: ''
    });
    this.insertNewClient.get('gstinImage')?.markAsPristine();
  }

  onPancardSelected(event: any) {
    this.pancardLogoFile = File = event.target.files[0];
    if (this.pancardLogoFile) {
      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (this.pancardLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetPancardPartialForm();
        this.resetPancardPartialForm2();
        this.pancardImageUrl = '../assets/images/preview.png';
      } else if (!validFileTypes.includes(this.pancardLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetPancardPartialForm();
        this.resetPancardPartialForm2();
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
      const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (this.gstLogoFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* File size should be less than 2 MB" });
        this.resetGstimagePartialForm();
        this.resetGstimagePartialForm2();
        this.gstImageUrl = '../assets/images/preview.png';
      } else if (!validFileTypes.includes(this.gstLogoFile.type)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "* Invalid file type. Only JPEG, JPG, and PNG are allowed" });
        this.resetGstimagePartialForm();
        this.resetGstimagePartialForm2();
        this.gstImageUrl = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
      } else {
        if (this.gstLogoFile.type == 'application/pdf') {
          this.gstImageUrl = "../assets/images/pdfpreview.png";
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            this.gstImageUrl = reader.result as string;
          };
          reader.readAsDataURL(this.gstLogoFile);
        }
      }
    }
  }

  editgstinCheck(gstvalue: any) {
    this.showgst = gstvalue;
    const gistinNumber = this.insertNewClient.get('gistinNumber');
    const gstinImage = this.insertNewClient.get('gstinImage');
    if (this.showgst == false) {
      gistinNumber?.clearValidators();
    } else {
      gistinNumber?.setValidators([Validators.required, this.customValidator.gstnumberValidator()]);
    }
    gistinNumber?.updateValueAndValidity();

    if (this.showgst == false) {
      gstinImage?.clearValidators();
    } else {
      gstinImage?.setValidators([Validators.required]);
    }
    gstinImage?.updateValueAndValidity();
  }

  edittoUppercase() {
    const pancardControl = this.insertNewClient.get('pancard');
    if (pancardControl) {
      const value = pancardControl.value;
      if (value && typeof value === 'string') {
        pancardControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }



  async insertClient() {
    this.isFormSubmited = true;
    this.isLoading = true;
    this.insertNewClient.patchValue({
      created_by: this.loginUserId
    });
    this.clientInsertData = this.insertNewClient.value;
    this.authToken = localStorage.getItem('access_token');

    const formData: FormData = new FormData();
    formData.append('image', this.file);
    formData.append('pancardImage', this.pancardLogoFile);

    if (this.gstLogoFile) {
      formData.append('gstinImage', this.gstLogoFile);
    }
    formData.append('clientData', JSON.stringify(this.clientInsertData));

    if (this.insertNewClient.valid) {
      this.http.post<any>(`${environment.apiURL}${constant.apiEndPoint.ADDCLIENT}`, formData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false;
          if (response.status === 1) {
            this.imageUrl = 'https://tms.tmivirtually.com/profiles/noimg.jpg';
            this.insertNewClient.reset();
            this.getAllClient(this.authToken, '', '', '', '', '10', 0);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the client data.' });
        }
      );
      this.overallFormValid = '';
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

  editClient = this.fb.group({
    updateClientId: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(50), this.customValidator.alphabetSpeclValidator()]],
    clientLogo: [''],
    oldClientLogo: [''],
    shortName: ['', [Validators.required, Validators.maxLength(150), this.customValidator.alphabetSpeclValidator()]],
    firmName: ['', [Validators.required, Validators.maxLength(150), this.customValidator.alphabetSpeclValidator()]],
    industry: [[''], Validators.required],
    sector: [[''], Validators.required],
    location: [[''], Validators.required],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    pancard: ['', [Validators.required, this.customValidator.panNumberValidator()]],
    pancardImage: [''],
    oldPancardImage: [''],
    gstin: [false],
    gistinNumber: [''],
    gstinImage: [''],
    oldGstinImage: [''],
    state: ['', Validators.required],
    city: ['', Validators.required],
    address: ['', [Validators.required, Validators.maxLength(5000)]],
  })

  populateClientEditForm(clientData: ClientResponse2): void {
    if (clientData) {
      this.editgstinCheck2(clientData.gstin ?? false);
      this.editClient.patchValue({
        updateClientId: clientData._id,
        name: clientData.name,
        oldClientLogo: clientData.clientLogo,
        shortName: clientData.shortName,
        firmName: clientData.firmName,
        industry: clientData.industry,
        sector: clientData.sector,
        location: clientData.location,
        description: clientData.description,
        pancard: clientData.pancard,
        oldPancardImage: clientData.pancardImage,
        gstin: !!clientData.gstin,
        gistinNumber: clientData.gistinNumber !== null ? clientData.gistinNumber : '',
        oldGstinImage: clientData.gstinImage,
        state: clientData.state,
        city: clientData.city,
        address: clientData.address
      });
    }
  }

  showEditModal(client: ClientResponse2): void {
    this.selectedClient = client;
    this.populateClientEditForm(client);
    this.displayModal = true;
    this.imageUrl = environment.apiURL + '' + client.clientLogo;
    this.pancardImageUrl = environment.apiURL + '' + client.pancardImage;
    this.gstImageUrl = environment.apiURL + '' + client.gstinImage;
    const selectedState = this.stateData.find(state => state.name === client.state);
    const selectedStateId = selectedState ? selectedState.id : '';
    this.getCityData(this.authToken, selectedStateId);
    this.editgstinCheck2(this.selectedClient?.gstin ?? false);
  }



  resetPancardPartialForm2() {
    this.editClient.patchValue({
      pancardImage: '',
    });
    this.editClient.get('pancardImage')?.markAsPristine();
  }
  resetGstimagePartialForm2() {
    this.editClient.patchValue({
      gstinImage: ''
    });
    this.editClient.get('gstinImage')?.markAsPristine();
  }

  edittoUppercase2() {
    const pancardControl = this.editClient.get('pancard');
    if (pancardControl) {
      const value = pancardControl.value;
      if (value && typeof value === 'string') {
        pancardControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }

  editgstinCheck2(gst: any) {
    this.showgst2 = gst;
    const gistinNumber = this.editClient.get('gistinNumber');
    const gstinImage = this.editClient.get('gstinImage');
    if (this.showgst2 == false) {
      gistinNumber?.clearValidators();
    } else {
      gistinNumber?.setValidators([Validators.required, this.customValidator.gstnumberValidator()]);
    }
    gistinNumber?.updateValueAndValidity();

    // if(this.gstImageUrl != ''){
    //   if(this.showgst2 == false){
    //     gstinImage?.clearValidators();
    //   }else{
    //     gstinImage?.setValidators([Validators.required]);
    //   }
    //   gstinImage?.updateValueAndValidity();
    // }
  }

  updateClient() {
    this.isLoading = true;
    this.isFormSubmited2 = true;
    const data = this.editClient.value;
    const updatedId = this.editClient.controls.updateClientId.value;
    this.authToken = localStorage.getItem('access_token');

    const formData: FormData = new FormData();
    if (this.file) {
      formData.append('image', this.file);
    }
    if (this.pancardLogoFile) {
      formData.append('pancardImage', this.pancardLogoFile);
    }
    if (this.gstLogoFile) {
      formData.append('gstinImage', this.gstLogoFile);
    }

    formData.append('clientData', JSON.stringify(data));

    if (this.editClient.valid) {
      this.http.put<any>(`${environment.apiURL}${constant.apiEndPoint.EDITCLIENT}?id=${updatedId}`, formData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }).subscribe(
        response => {
          this.isLoading = false;
          if (response.status === 1) {
            this.getAllClient(this.authToken, '', '', '', '', '10', 0);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error => {
          this.isLoading = false;
          if (error.status === 401) {
            this.messageService.add({ severity: 'warn', summary: 'Unauthorized', detail: 'Your session has expired. Please log in again.' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the client data.' });
          }
        }
      );
      this.overallFormValid2 = '';
    } else {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
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


  getStateData(authToken: string, zoneId: string): void {
    this.clientService.getState(authToken, zoneId).subscribe(
      (res: any) => {
        this.stateData = res.result[0].data;
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

  getNumberArray(count: number): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  searchName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchClientName = inputElement.value;
    this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.skip);
    this.loader2 = true;
  }

  searchSector(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchClientSector = selectedValue;
    this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.skip);
    this.loader2 = true;
  }

  searchIndustry(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.searchClientIndustry = selectedValue;
    this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.skip);
    this.loader2 = true;
  }

  onSearchSubmit(): void {
    if(this.searchClientName || this.searchClientSector || this.searchClientIndustry) {
      this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.skip);
      this.loader2 = true;
    } else{
      this.loader2 = false;
      this.searchClientName = '';
      this.searchClientSector = '';
      this.searchClientIndustry = '';
    }
  }

  resetFilter() {
    this.searchClientName = '';
    this.searchClientSector = '';
    this.searchClientIndustry = '';
    this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.skip);
  }

  // onSelectChange(event: Event): void {
  //   this.limit = (event.target as HTMLSelectElement).value;
  //   this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.skip);
  // }
  onSelectChange(event: Event): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value; // Convert the selected value to a number
    this.currentPage = 1; // Reset to the first page
    this.startIndex2 = 1; // Reset startIndex2
    this.endIndex2 = this.itemsPerPage;
    // Reset endIndex2 based on the selected value

    this.limit = (event.target as HTMLSelectElement).value;
    this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.endIndex);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecord) {
      this.currentPage++;

      if (this.currentPage == 1) {
        this.startIndex = 0;
        this.startIndex2 = 11;
        this.endIndex2 = this.itemsPerPage + 10;
      } else {
        this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.itemsPerPage + this.startIndex;
      }
      this.endIndex = this.startIndex + this.itemsPerPage;
      this.endIndex = this.endIndex - 10;
      this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.endIndex);
      // console.log(this.startIndex, this.endIndex2)

      if (this.currentPage > 1) {
        this.isDisabled = "";
      } else {
        this.isDisabled = "disabled";
      }


      if (this.currentPage < this.totalPages) {
        this.isDisabled2 = "";
      } else {
        this.isDisabled2 = "disabled";
      }

      this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.endIndex);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      if (this.currentPage == 1) {
        this.endIndex = 0;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.itemsPerPage + this.startIndex;
      } else {
        this.endIndex = this.startIndex + this.itemsPerPage;
        this.startIndex2 = this.startIndex + 1;
        this.endIndex2 = this.itemsPerPage + this.startIndex;
        this.endIndex = this.endIndex - 10;
      }
      this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.endIndex);

      if (this.currentPage > 1) {
        this.isDisabled = "";
      } else {
        this.isDisabled = "disabled";
      }

      if (this.currentPage < this.totalPages) {
        this.isDisabled2 = "";
      } else {
        this.isDisabled2 = "disabled";
      }

      this.getAllClient(this.authToken, this.searchClientName, this.searchClientSector, this.searchClientIndustry, '', this.limit, this.endIndex);
    }
  }

}
