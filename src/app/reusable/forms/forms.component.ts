import { Component, inject, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../core/service/dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule, MultiSelectComponent } from 'ng-multiselect-dropdown';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, CommonModule,NgMultiSelectDropDownModule,MatSelectModule],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  @ViewChildren('inputElem') inputElements!: QueryList<any>;
  @ViewChildren('inputElemmul') multiSelects!: QueryList<any>;
  formService = inject(DashboardService);
  authToken: any = "";
  assessmentList: any[] = [];
  formId: any = "";
  formData: any;
  masters: any;
  formerror:any;
  db_name:any;
  dropdownSettings: IDropdownSettings = {};
  queryParams: { [key: string]: string | null } = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.formId);
    this.authToken = localStorage.getItem('access_token');
    this.getformfields(this.authToken, this.formId);
  }

  async getformfields(authToken: any, id: any) {
   await  this.formService.getFormdata(authToken, id).subscribe((res: any) => {
      console.log(res);
      this.formData = res.result;
    });
    this.getmasters(this.authToken);

  }

  async getmasters(authToken: any) {
    await this.formService.getMastersdata(authToken).subscribe((res: any) => {
      console.log(res);
      this.masters = res;
      this.processFormData();

    });
  }


  async processFormData() {
    if (this.masters.length > 0 && this.formData.form_data) {
      this.formData.form_data.forEach((field: any) => {
        if ((field.input_type === 'options' || field.input_type === 'multi_select') && field.subOptions) {
          const master = this.masters.find((m: any) => m.type === field.subOptions);
          if (master) {
            field.optionsData = master.data;
          }
        }
      });
    }
    console.log(this.formData);
  }

  onOptionsSelected(field: any) {
    console.log('Options selected:', field);
  }

  getOptionsForField(subOptions: any) {
    // if(!field){
      console.log(subOptions);
      const matchingMaster = this.masters?.find((master: any) => master.type == subOptions);
      console.log(matchingMaster.data);
      return matchingMaster.data ? matchingMaster.data.emp_type : [];
    // }
  }

  async onSubmit() {
    this.formerror="";
    this.db_name="";
    const formData: any = {};
    let valid = true;

    await this.route.queryParams.subscribe(params => {
      for (const key in params) {
        console.log(params);
        if (params.hasOwnProperty(key)) {
          formData[key] = params[key];
        }
      }
    });

    this.inputElements.forEach(input => {
      const element = input.nativeElement;
      if (element.type === 'radio') {
        if (element.checked) {
          formData[element.name] = element.value;
        }
      } else if (element.tagName === 'select') {
        formData[element.name] = element.value;
      } else if(element.tagName === 'ng-multiselect-dropdown'){


      } {
        formData[element.name] = element.value;
      }
      const hiddenInput = this.inputElements.find(e => e.nativeElement.name === element.name && e.nativeElement.type === 'hidden');
      if (hiddenInput) {
        this.db_name = hiddenInput.nativeElement.value;
      }
      const field = this.formData.form_data.find((f: any) => f.label_name === element.name);
      if (field && field.required && !element.value) {
        valid = false;
        element.classList.add('is-invalid'); 
      } else {
        element.classList.remove('is-invalid');
      }
    });

    this.multiSelects.forEach((dropdown, index) => {
      const selectedItems = dropdown.selectedItems.map((item: { text: any; }) => item.text);
      const field = this.formData.form_data[index];
      if (selectedItems.length > 0) {
        formData[field.label_name] = selectedItems;
      }
    });

    
    if (!valid) {
      this.formerror = "Validation failed. Please fill in all required fields.";
      console.error('Validation failed. Please fill in all required fields.');
      return;
    }

    console.log('Collected form data:', formData);
    const payload = {
      db_name: this.db_name,  
      data: formData
    };

    
    fetch(environment.apiURL+'save_form_data', {
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
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}
