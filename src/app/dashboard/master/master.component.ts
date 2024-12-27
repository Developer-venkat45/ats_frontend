import { Component, inject, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DashboardService } from '../../core/service/dashboard.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { throwError } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


interface MasterData {
  _id: {
    $oid: string;
  };
  indent_type: string[] | null;
  emp_type: string[] | null;
  type: string;
  data: string[] | null;
  placeholder_type: string[] | null;
}

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [
    OrganizationChartModule, ReactiveFormsModule, CommonModule, DialogModule, 
    FormsModule, TableModule, IconFieldModule, InputTextModule, 
    InputIconModule, NgMultiSelectDropDownModule,RouterModule,ButtonModule,DropdownModule,ChipsModule,  ToastModule
  ],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css',
  providers: [MessageService]
})
export class MasterComponent {
  @ViewChild('chipComponent', { static: false }) childComponent!: any;
  indentTypes: any;
  Formname:any;
  indedentService = inject(DashboardService);
  authToken: any;
  loading:boolean=true;
  masterlist:any=[]
  isAddFieldDialogActive: boolean = false;
  addFieldVisible: boolean = false;
  addFieldDialogHeader: string = "";
  addDialogVisible: boolean = false
  type: string = ""
  values: string[] = []
  isEditable: string = "no"
  err: boolean = false
  repeatedValues:any=[]
  

  constructor(private cdr: ChangeDetectorRef,private router: Router,private messageService: MessageService) { }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    var  role = "";
    this.indedentService.getMastersdata(this.authToken).subscribe(
      (res: any) => { 
        let arr:any=[]
        for (let obj of res) {
          let keys:any=Object.keys(obj)
          if (keys.includes("type") && keys.includes("data"))  arr.push(obj)    
        }
        this.masterlist = arr;
        this.loading = false;
      },
      error => {
        // Handle error
      }
    );
  }
  
  
  goToMasterData(category:string,data:any) {
       this.router.navigate([`/master`, category], {
    state: { data: data }  
  });
  }

    addFieldDialog() {
    this.isAddFieldDialogActive = true
    this.addDialogVisible = true
      this.addFieldDialogHeader = `Add new master`
      this.type = ""
      this.values = []
      this.isEditable = "no"
      this.repeatedValues=[]
  }

  removeDataVal(ind:any) {
      this.values.splice(ind,1)
  }
 
  checkErr() {
    this.repeatedValues = []
    this.err=false
    if (this.type === "") {
      this.err = true
      this.repeatedValues.push("Type is empty")
    } 

      if (this.type.length>125) {
      this.err = true
      this.repeatedValues.push("Max characters of limit 125 exceeded")
    } 

      if (this.values.length===0) {
      this.err = true
      this.repeatedValues.push("Data is empty")
    } 


    for (let obj of this.masterlist) {
      if (obj["type"].toLowerCase() === this.type.toLowerCase()) {
        this.err = true
        this.repeatedValues.push("Type already exists")
        break;
      }
    }
      let obj:any = {}
      for (let value of this.values) {
        if (Object.keys(obj).includes(value.toLowerCase())) {
          obj[value.toLowerCase()]+=1
          this.err = true
          this.repeatedValues.push(`Duplicate values in data`)
          break;
        }
        else {
           obj[value.toLowerCase()]=1
        }
    }

     for (let value of this.values) {
       if (value.length > 125) {
          this.err = true
         this.repeatedValues.push("Max characters of limit 125 exceeded")
          break;
       }
    }
    if (!this.err) {
      let masterData:any = {
        "type": this.type,
        "name": this.values,
        "status": [],
        "created_by": [],
        "isEditable":this.isEditable==="yes"? true : false
      }
      for (let i = 0; i < this.values.length; i++){
        masterData["status"].push(1)
        masterData["created_by"].push("jdas")
      }
      this.createMasterObjRoute(masterData)
    }
  }
  
  createMasterObjRoute(masterData:any) {
        this.indedentService.createMasterObjRoute(this.authToken,masterData).subscribe(
          (res: any) => { 
              this.isAddFieldDialogActive = false
            this.addDialogVisible = false
            this.loading=true
              this.indedentService.getMastersdata(this.authToken).subscribe(
                (res: any) => { 
                   this.messageService.add({
                        severity: 'success', 
                        summary: 'Data insert successful',
                        detail: 'Data has been inserted successfully.',
                  });
                  let arr:any=[]
                  for (let obj of res) {
                    let keys:any=Object.keys(obj)
                    if (keys.includes("type") && keys.includes("data"))  arr.push(obj)    
                  }
                  this.masterlist = arr;
                  this.loading = false;
               },
                error => {
                   this.messageService.add({
                        severity: 'error', 
                        summary: 'Data insert failed',
                        detail: 'There was an issue in inserting the data. Please try again.',
                  });
                  console.log(error)
                  this.isAddFieldDialogActive = false
                  this.addDialogVisible = false
              });
      },
          error => {
         this.messageService.add({
                        severity: 'error', 
                        summary: 'Data insert failed',
                        detail: 'There was an issue in inserting the data. Please try again.',
                  });
            console.log(error)
          })
      this.isAddFieldDialogActive = false
      this.addDialogVisible = false
  }

  addMasterData() {
    let inputElement: HTMLInputElement | null = document.querySelector("#data")?.querySelector("input") ?? null;
    if (inputElement) {
          let val = inputElement.value;
          if (val != "") {
            this.values.push(val)
            inputElement.value=""
          }
    }
  
 }
}