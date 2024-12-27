import { Component, inject, signal, effect, input,ElementRef, HostListener, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/service/dashboard.service';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';

@Component({
  selector: 'app-addform',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './addform.component.html',
  styleUrls: ['./addform.component.css']
})
export class AddformComponent {
  formService = inject(DashboardService);
  inputs: Array<{ id: number, field1: string, field2: string, field3: string, required: boolean, subOptions?: string, radioLabels?: Array<{ value: string }> }> = [];
  extraField: string = '';
  authToken: any = "";
  masters: any;
  collections:any;
  catergory:any=['job','indent'];
  db_table:string='';
  db_category:string='';
  options:any;
  // extraField = signal('');
  dbTable = signal('');
  dbTable2 = signal('');
  dropdownOpen:boolean = false;
  dropdownOpen2:boolean = false;
  
  constructor(private eRef: ElementRef) {}

  filteredOptions = computed(() => {
    const value = this.dbTable().toLowerCase();
    return this.collections.filter((option: string) => option.toLowerCase().includes(value));
  });
  
  filteredOptions2 = computed(() => {
    const value = this.dbTable().toLowerCase();
    return this.catergory.filter((option: string) => option.toLowerCase().includes(value));
  });

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getmasters(this.authToken);
    this.getcolllections(this.authToken);
  }

  updateDbTableFromInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.dbTable.set(inputElement.value);
      this.toggleDropdown(true);
    }
  }

  
  updateDbTableFromInput2(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.dbTable2.set(inputElement.value);
      this.toggleDropdown2(true);
    }
  }

  toggleDropdown2(open: boolean) {
    this.dropdownOpen2=open;
  }

  toggleDropdown(open: boolean) {
    this.dropdownOpen=open;
  }

  selectOption(option: string) {
    this.dbTable.set(option);
    this.toggleDropdown(false);
  }

  
  selectOption2(option: string) {
    this.dbTable2.set(option);
    this.toggleDropdown2(false);
  }

  dbclick(){
    this.toggleDropdown(true);
  }

  catclick(){
    this.toggleDropdown2(true);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    console.log(event);
    console.log(this.eRef.nativeElement);
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.toggleDropdown(false);
    }
  }


  addRow() {
    const newId = this.inputs.length ? this.inputs[this.inputs.length - 1].id + 1 : 1;
    this.inputs.push({ id: newId, field1: '', field2: '', field3: '', required: false, subOptions:'', radioLabels: [] });
    console.log(this.inputs);
  }

  removeRow(index: number) {
    this.inputs.splice(index, 1);
  }

  addRadioLabel(index: number) {
    this.inputs[index].radioLabels!.push({ value: '' });
  }

  async postData(url = '', data = {}, authToken: string) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  submit() {
    const invalidInputs = this.inputs.some(input => !input.field1 || (!input.field2 && input.field3 !== 'radio') || !input.field3) || !this.extraField|| !this.db_table;

    
    if (invalidInputs) {
      alert('All fields are required. Please fill in all fields before submitting.');
      return;
    }

    const hasButton = this.inputs.some(input => input.field3 === 'button');
    if (!hasButton) {
      alert('At least one input must be of type "button".');
      return;
    }

    const formData = {
      form_name: this.extraField,
      db_table:this.db_table,
      category:this.db_category,
      formslist: this.inputs.map(input => ({
        id: input.id,
        label_name: input.field1,
        placeholder: input.field2,
        input_type: input.field3,
        required: input.required,
        subOptions: input.subOptions,
        radioLabels: input.radioLabels 
      }))
    };

    this.postData(environment.apiURL+'submit_forms', formData, this.authToken)
      .then(data => {
        if (data.status === 1) {
          console.log('Data Inserted');
        } else {
          console.log('Data Not Inserted');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    console.log('Submitted data:', formData);
  }

  onField3Change(index: number) {
    const selectedValue = this.inputs[index].field3;
    // if (selectedValue === 'options') {
    //   // this.inputs[index].subOptions = ''; 
    // } else {
    //   // this.inputs[index].subOptions = undefined; 
    // }
  }


  async getmasters(authToken: any) {
    this.formService.getMastersdata(authToken).subscribe(
      (res: any) => {
        console.log(res);
        this.masters = res;
      }
    );
  }

  async getcolllections(authToken: any) {
    this.formService.getcollectiondata(authToken).subscribe(
      (res: any) => {
        console.log(res);
        this.collections = res;
      }
    );
  }

}
