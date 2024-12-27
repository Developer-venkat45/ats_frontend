import { Component, inject} from '@angular/core';
import { NgIf,NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from '../../core/service/dashboard.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


interface data {
  id:string | null
  name: string | null
  zone_id: string | null
  state_id:string | null
  status: string | null
  created_by: string | null
  created_on:string | null
}

interface option{
  label: string
  value: string
}


@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [RouterModule,TableModule,IconFieldModule,InputIconModule,NgIf,NgFor,DropdownModule,DialogModule,FormsModule,ButtonModule, ToastModule],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.css',
  providers: [MessageService]
})
export class MasterDataComponent {
  indedentService = inject(DashboardService);
  authToken: any = ""
  masterCategory: string = ""
  loading: boolean = true
  fieldData: any = []
  fieldDataType: string = ""
  fieldDataProperties: string[] = []
  fieldSortable: boolean[] = []
  isAddFieldDialogActive: boolean = false
  addDialogVisible: boolean = false
  addFieldDialogHeader: string = ""
  captureInsertValues: string[] = []
  zoneIdOptionValues: option[] = []
  stateIdOptionValues: option[] = []
  isUpdateFieldDialogActive: boolean = false;
  updateFieldDialogHeader: string = "";
  updateDialogVisible: boolean = false
  captureUpdateValues: string[] = []
  updateFieldvalues: any = []
  isStatusFieldDialogActive: boolean = false
  statusFieldDialogHeader: string = ""
  statusDialogVisible: boolean = false
  statusFieldData: any
  doesStatusExist:boolean=false
  zoneIdData:any={}
  stateIdData: any = {}
  stateInd: number = -1
  zoneInd: number = -1
  dupEntry: boolean = false  
  err:any=[]
  
  constructor(private route: ActivatedRoute,private messageService: MessageService) { } 

  ngOnInit() {
    this.authToken = localStorage.getItem('access_token');
    this.masterCategory = this.route.snapshot.paramMap.get('masterCategory')!;
    this.callLoadData()
  }

  async callLoadData() {
    this.fieldData = await this.loadData()
      this.loadZoneAndState()
  }
 
  async loadZoneAndState(){
      if (this.masterCategory === "state") {
        const zoneResponse = await this.indedentService.getNamesForZoneIds(this.authToken).toPromise();
        if (zoneResponse.status === 1) {  
          this.zoneIdData={
            "0": {"name": "select a zone"},
             ...zoneResponse.result
          }
        } else {
          throw new Error("Fetching names for zone ID failed!!!");
        }
      }
  
      if (this.masterCategory === "cities") {
        const stateResponse = await this.indedentService.getNamesForStateIds(this.authToken).toPromise();
        if (stateResponse.status === 1) {
          this.stateIdData = {
           "0":"select a state",
           ...stateResponse.result
         };

        } else {
          throw new Error("Fetching names for state ID failed!!!");
        }
      }

     this.populateUserEditForm()
  }

  async populateUserEditForm() {
    this.loading = false;
    this.dupEntry=false
    if (typeof this.fieldData[0] === "string")
    {
      this.fieldDataType = "string"
      this.fieldDataProperties=[]
      this.fieldSortable=[]
    }
    else {
      this.fieldDataType = "object";
      this.fieldDataProperties=[]
      this.fieldSortable=[]
      this.zoneIdOptionValues=[]
      this.stateIdOptionValues=[]
      for (let field of Object.keys(this.fieldData[0]))
      {
        if (field === "status") {
          this.doesStatusExist=true
        }
        if(field==="zone_id"){
              this.fieldDataProperties.push("zone")
              this.fieldSortable.push(false)
          for (let zone_id of Object.keys(this.zoneIdData)) {
              this.zoneIdOptionValues.push(
                  {
                    "label":this.zoneIdData[zone_id]["name"],
                  "value": zone_id,
                  }
                )
          }  
        }


        if(field==="state_id"){
          this.fieldDataProperties.push("state")
          this.fieldSortable.push(false)
          for (let state_id of Object.keys(this.stateIdData)) {
            this.stateIdOptionValues.push(
                {
                  "label":this.stateIdData[state_id],
                  "value":state_id
                }
              )
             }   
        }
      } }
    this.fieldDataProperties.unshift(this.masterCategory)
    this.fieldSortable.unshift(true)
    this.fieldDataProperties.unshift("serial number")
    this.fieldSortable.unshift(false)
    this.addZoneCityValues()
  }
   
  addZoneCityValues(){
      if(this.masterCategory==="state"){
        for (let obj of this.fieldData) {
                obj["displayName"]=this.zoneIdData[obj["zone_id"]]["name"]
         }
      }
      if(this.masterCategory==="cities"){
        for(let obj of this.fieldData){
               obj["displayName"]=this.stateIdData[obj["state_id"]]
        }
     }
  }
  
  addFieldDialog() {
    this.isAddFieldDialogActive = true
    this.addDialogVisible = true
    this.addFieldDialogHeader = `Add ${this.masterCategory}`
    this.captureInsertValues = []
    this.dupEntry=false
    for (let i = 1; i < this.fieldDataProperties.length; i++){
      this.captureInsertValues.push("")
    }
  }

  async loadMasterData() {
      this.indedentService.getMastersdata(this.authToken).subscribe(
        (res: any) => { 
              let masterlist =[...res] ;
              this.loading = false;
              this.isAddFieldDialogActive = false
          this.fieldData = masterlist.filter((obj: any) => obj.type === this.masterCategory)[0]["data"]    
              this.populateUserEditForm()
      },
      error => {
          console.log(error)
      })
  }
   
  async checkDupEntry() {
    this.err = []
    this.dupEntry=false
    if (this.isUpdateFieldDialogActive) {
      if (this.captureUpdateValues[0]?.toLowerCase() === this.updateFieldvalues[0]?.toLowerCase() && this.captureUpdateValues[1]?.toLowerCase() === this.updateFieldvalues[1]) {
        this.callUpdateRoute()
        this.isUpdateFieldDialogActive = false
      }
    }

    if (this.isAddFieldDialogActive) {     
      for (let value of this.captureInsertValues) {
        if (value === ""){
          this.dupEntry = true
          this.err.push("Empty values are not allowed")
          break;
        } 
      }

        for (let value of this.captureInsertValues) {
        if (value.length >125){
          this.dupEntry = true
          this.err.push("Max characters of limit 125 exceeded")
          break;
        } 
      }
     }
    if (this.isUpdateFieldDialogActive) { 
      for (let value of this.captureUpdateValues) {
        if (value === ""){
          this.dupEntry = true
          this.err.push("Empty values are not allowed")
          break;
              } 
      }

       for (let value of this.captureUpdateValues) {
        if (value.length >125){
          this.dupEntry = true
          this.err.push("Max characters of limit 125 exceeded")
          break;
              } 
      }
     }
   
    if (!this.dupEntry) {

            this.indedentService.checkDupEntry(this.authToken, this.masterCategory,this.isAddFieldDialogActive? this.captureInsertValues[0] : this.captureUpdateValues[0],this.masterCategory==="cities"? (this.isAddFieldDialogActive? this.captureInsertValues[1] : this.captureUpdateValues[1]):"",this.masterCategory==="state"? (this.isAddFieldDialogActive? this.captureInsertValues[1] : this.captureUpdateValues[1]):"").subscribe(
             (res: any) => {        
                if (res["status"] === 1) {
                  this.dupEntry = true
                  this.err.push("Duplicate value not allowed")
                }
        else {
          if (this.isAddFieldDialogActive) {
            this.callInsertRoute()
          }
          else {
            this.callUpdateRoute()
            this.isUpdateFieldDialogActive=false
        }
          }
      },
      err => {
        console.log(err.message)
      })
      }
       
  }
  
  
  async callInsertRoute() {
    this.loading=true
    if (this.masterCategory === "cities") { 
      let cityData: any = {}
      cityData["name"]=this.captureInsertValues[0]
      cityData["state_id"]=this.captureInsertValues[1]
      cityData["status"] = "1"
      cityData["created_by"]="jdas"
      this.indedentService.insertCityData(this.authToken, cityData).subscribe(
        (res: any) => {
          if (res["status"] === 1)
          {
               this.messageService.add({
                        severity: 'success', 
                        summary: 'Data insert successful',
                        detail: 'Data has been inserted successfully.',
                  });
            this.loadMasterData()
          }
          else{
              throw new Error("inserting city failed!!!")
          }
      },
        err => {
         this.messageService.add({
                        severity: 'error', 
                        summary: 'Data insert failed',
                        detail: 'There was an issue in inserting the data. Please try again.',
                  });
        console.log(err.message)
      })
    }
    else if (this.masterCategory === "state") {
      let stateData: any = {}
      stateData["name"]=this.captureInsertValues[0]
      stateData["zone_id"]=this.captureInsertValues[1]
      stateData["status"] = "1"
      stateData["created_by"]="jdas"
            
      this.indedentService.insertStateData(this.authToken, stateData).subscribe(
      (res: any) => {        
          if (res["status"] === 1)
          {
                     this.messageService.add({
                        severity: 'success', 
                        summary: 'Data insert successful',
                        detail: 'Data has been inserted successfully',
                  }); 
                    this.loadMasterData()
          }   
        else{
              throw new Error("inserting city failed!!!")
          }
      },
        err => {
         this.messageService.add({
                        severity: 'error', 
                        summary: 'Data insert failed',
                        detail: 'There was an issue in inserting the data. Please try again',
                  });
        console.log(err.message)
      })
    }
    else {
            let data:any={}
            data["name"] = this.captureInsertValues[0]
            data["status"] = 1
            data["created_by"] = "jdas"
            data["type"]= this.masterCategory
            this.indedentService.insertMasterData(this.authToken,data).subscribe(
            (res: any) => {        
                if (res["status"] === 1)
                {
                   this.messageService.add({
                        severity: 'success', 
                        summary: 'Data insert successful',
                        detail: 'Data has been inserted successfully',
                   });
                     this.loadMasterData()
                }  
              else{
                      throw new Error("inserting city failed!!!")
                  }
            },
              err => {
                   this.messageService.add({
                        severity: 'error', 
                        summary: 'Data insert failed',
                        detail: 'There was an issue in inserting the data. Please try again.',
                  });
              console.log(err.message)
            })
    }
    let inputEle = document.querySelector("#search") as HTMLInputElement
     inputEle.value==`Search ${this.masterCategory}`
     
  }

  callUpdateRoute(){
        let updateData: any = {}
        updateData["master_type"]=this.masterCategory
        let serial_number: string = ""
       for(let i = 0; i < this.fieldData.length; i++) {
         if (this.masterCategory === "cities") {
                 if(this.fieldData[i]["name"]===this.updateFieldvalues[0] && this.fieldData[i]["state_id"]===this.updateFieldvalues[1] )
                 {
                       updateData["serial_number"]=this.fieldData[i]["id"]
                  }
         }
         else if (this.masterCategory === "state") {
                if(this.fieldData[i]["name"]===this.updateFieldvalues[0] && this.fieldData[i]["zone_id"]===this.updateFieldvalues[1] )
                 {
                       updateData["serial_number"]=this.fieldData[i]["id"]
                  }
         }
         else {
                if(this.fieldData[i]["name"]===this.updateFieldvalues[0] )
                 {
                       updateData["serial_number"]=this.fieldData[i]["id"]
                  }
         }
    }
        console.log(updateData["serial_number"] )
            if(this.masterCategory==="cities"){
              updateData["name"]=this.captureUpdateValues[0]
              updateData["state_id"]=this.captureUpdateValues[1]
        }
        else if(this.masterCategory==="state"){
          updateData["name"]=this.captureUpdateValues[0]
          updateData["zone_id"]=this.captureUpdateValues[1]
         }
        else{
              updateData["name"]=this.captureUpdateValues[0]
        }
       
        this.indedentService.updateMasterData(this.authToken,updateData).subscribe(
            (res: any) => {        
            if (res["status"] === 1) {
                  this.messageService.add({
                        severity: 'success', 
                        summary: 'Data updated',
                        detail: 'Data has been updated successfully.',
                  });
                       this.loadMasterData()
                }
                else{
                   throw Error('err')
                   }
                },
          error => {
                 this.messageService.add({
                        severity: 'error', 
                        summary: 'Data update failed',
                        detail: 'There was an issue in updating the data. Please try again.',
                  });
              console.log(error.message)
          })
    
  }

    updateFieldDialog(eachFieldData: any) {
    this.isUpdateFieldDialogActive = true
    this.updateDialogVisible = true
    this.updateFieldDialogHeader = `Update ${this.masterCategory} field`
      this.updateFieldvalues = []
      this.dupEntry=false
    if (typeof eachFieldData == "string") this.updateFieldvalues.push(eachFieldData)
    else {
      for (let i = 0; i < this.fieldDataProperties.length; i++){
        if (i !== 0 ) {
          if (i == 1) this.updateFieldvalues.push(eachFieldData["name"])
          else {
            if (this.fieldDataProperties[i] === "state") {
              this.updateFieldvalues.push(eachFieldData['state_id'])
              this.stateInd = parseInt(eachFieldData["state_id"])
              
            }          
            else if (this.fieldDataProperties[i] === "zone") {
              this.updateFieldvalues.push(eachFieldData['zone_id'])
              this.zoneInd=parseInt(eachFieldData["zone_id"])
            } 
            else this.updateFieldvalues.push(eachFieldData[this.fieldDataProperties[i]])                     
          }          
         }
      }
    }
    this.captureUpdateValues = []
    for (let value of this.updateFieldvalues) {
       this.captureUpdateValues.push(value)
    }
  }

  changeStatus(fieldData: any) {
    this.isStatusFieldDialogActive = true
    this.statusDialogVisible = true
    this.statusFieldDialogHeader = `Do you want to change the status from ${fieldData["status"]===1?"active":"inactive"} to ${ fieldData["status"]===1? "inactive": "active" }?`
    this.statusFieldData=fieldData
  }

  async changeStatusRoute() {
          let updateData: any = {}
    updateData["master_type"] = this.masterCategory
    updateData["serial_number"]=this.statusFieldData["id"]
    updateData["status"] = this.statusFieldData["status"] === 0 ? 1 : 0
          this.indedentService.updateMasterData(this.authToken,updateData).subscribe(
            (res: any) => {        
              if (res["status"] === 1) {
                        this.messageService.add({
                                  severity: 'success',
                                  summary: 'Status Changed',
                                  detail: 'The status has been successfully changed.', });
                       this.loadMasterData()
                }
              else {
                   throw Error('err')
                   }
                },
            error => {
              this.messageService.add({
                    severity: 'error', 
                    summary: 'Status Change Failed',
                    detail: 'There was an issue changing the status. Please try again.'});
              console.log(error.message)
            })
  }

// async filterData() {
//   const input = document.querySelector("#search") as HTMLInputElement;
//     if (input.value !== "") {
//       try {
//         const fetched_list: any = await this.loadData();
//         if(this.fieldDataType==="string") this.fieldData = fetched_list.filter((dt: string) =>
//           dt.toLowerCase().includes(input.value.toLowerCase())
//         );
//         else {
//            this.fieldData = fetched_list.filter((dt:any) =>
//           dt["name"].toLowerCase().includes(input.value.toLowerCase())
//         );
//         }
//         if (this.fieldData.length !== 0) this.populateUserEditForm();
//       } catch (error) {
//         console.log("Error fetching data:", error);
//       }
//     } else {
//       this.loadMasterData(); 
//     }

// }

async loadData() {
  return new Promise((resolve, reject) => {
    this.indedentService.getMastersdata(this.authToken).subscribe(
      (res: any) => {
        const masterlist = [...res];
        const filtered_list = masterlist.filter(
          (obj: any) => obj.type === this.masterCategory
        )[0]["data"];
        resolve(filtered_list); 
      },
      (error) => {
        console.log(error);
        reject(error); // Reject the promise if an error occurs
      }
    );
  });
}

}