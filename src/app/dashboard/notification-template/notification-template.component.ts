import { Component, inject, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DashboardService } from '../../core/service/dashboard.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';
import Swal from 'sweetalert2';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TooltipModule } from 'primeng/tooltip';



@Component({
  selector: 'app-notification-template',
  standalone: true,
  imports: [
    OrganizationChartModule, ReactiveFormsModule, CommonModule, DialogModule, 
    FormsModule, TableModule, IconFieldModule, InputTextModule, 
    InputIconModule, NgMultiSelectDropDownModule,NgxEditorModule,
    ToastModule,RouterModule,TooltipModule
  ],
  templateUrl: './notification-template.component.html',
  styleUrl: './notification-template.component.css'
})
export class NotificationTemplateComponent {

  indedentService = inject(DashboardService);

  apiMessage2: any;
  editNotifyType: any;
  tempVar: any=[];
  
  
  confirmStatusChange(_t54: any) {
  throw new Error('Method not implemented.');
  }

  showUserDetails(_t54: any) {
  throw new Error('Method not implemented.');
  }
  loading: boolean = true;
  NotifyList: any[] = [];
  ProcessList:any[]=[];
  displayModalAdd: boolean = false;
  fb = inject(FormBuilder);
  isTablevisible:boolean=true;
  isFormvisible:boolean=false;
  isFormSubmited2: boolean = false;
  isUpdateFormvisible:boolean = false;
  isFormSubmited:boolean=false;
  isBtnLoading: boolean= false;
  prcesserror:any="";
  statuserror:any="";
  authToken:any="";
  subjecterror:any="";
  bodyerror:any = "";
  editorContent = 'Please Enter the body Here ...';
  editor: any;
  html:any= '';
  updatehtml: any = "";
  templateVariables:any=[]


    toolbar: Toolbar = [
      ["bold", "italic"],
      ["underline", "strike"],
      ["code", "blockquote"],
      ["ordered_list", "bullet_list"],
      [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
      ["link", "image"],
      ["text_color", "background_color"],
      ["align_left", "align_center", "align_right", "align_justify"],
    ];
    colorPresets = ["red", "black", "green", "yellow","blue","pink","orange"];

    constructor (private messageService: MessageService, private http: HttpClient){}


  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    var  role = "";
    this.editor = new Editor();

    this.getAllNotifications(this.authToken)
    // this.indedentService.getAllNotifications(this.authToken).subscribe(
    //   (res: any) => {
    //     this.NotifyList = res.result;
    //     this.loading = false;
    //   },
    //   error => {
    //     // Handle error
    //   }
    // );
    

  }

  async tempVarFunc() {
    let notify_type:HTMLInputElement | null=document.querySelector("input[formControlName='Notify_type']:checked") ?? null;
    let module: HTMLInputElement | null = document.querySelector("input#module") ?? null;
    let action: HTMLInputElement | null = document.querySelector("input#action") ?? null;
    let process: HTMLInputElement | null = document.querySelector("input#process") ?? null;
    if (notify_type?.value !== "email_bulk" && notify_type?.value !== "whatsapp_bulk") {
       await this.fetchTemplateVar(this.authToken,notify_type?.value ?? "",module?.value ?? "",action?.value,process?.value )
    }
    else {
       await this.fetchTemplateVar(this.authToken,notify_type?.value ?? "",module?.value ?? "")
    }
  }
 
  async fetchTemplateVar(authToken: any, type: string, module: string, action: string | null = null, process: string | null = null) {
     const url = `${environment.apiURL}${constant.apiEndPoint.FETCHTEMPLATEVAR}?type=${type}&module=${module}&action=${action}&process=${process}`;
     const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
      });

      this.http.get<any>(url,{ headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.tempVar=response["data"]
            } else {
              this.tempVar=""
            }
          },
          error => {
            console.error('Error:', error);
          }
        );
  }

  copyText(t: string,idx:number) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = t;  
    document.body.appendChild(tempTextArea);  
    tempTextArea.select();
    document.execCommand("copy");   
    document.body.removeChild(tempTextArea);
    let ele: HTMLDivElement | null = document.querySelector(`span#var-${idx}`) ?? null;
    const rect:any = ele?.getBoundingClientRect();
    let selectEle: HTMLDivElement | null = document.querySelector("div#selectedBox") ?? null;
    console.log(selectEle)
    if (ele && selectEle) {
      selectEle.style.display = "block";
      selectEle.style.left = `${rect.left+2}px`;
      selectEle.style.top = `${rect.top - 35}px`;
      setTimeout(() => {
        selectEle.style.display = "none";
      },200)
    }
  }

  
  getAllNotifications(authToken: string): void {
    this.indedentService.getAllNotifications(authToken).subscribe(
      (res: any) => {
        this.NotifyList = res.result;
        this.loading = false;
      },
      error => {
        // Handle error
      }
    );
  }

   removeDataVal(ind:any) {
      this.templateVariables.splice(ind,1)
  }
  
  addNotification = this.fb.group({
    module: ['', Validators.required],
    action: ['', Validators.required],
    process: ['', Validators.required],
    status: ['1', Validators.required],
    subject: ['', Validators.required],
    body: ['', Validators.required],
    variables:[''],
    channelId: ['', Validators.required],
    templateName: ['', Validators.required],
    namespace:  ['', Validators.required],
    cc: [''],
    fromemail: [''],
    bc: [''],
    Notify_type: ['email', Validators.required],
    created_by: '66694895cfaa5427c0be5f30',
    title: ["", Validators.required],
    priority: ["Low", Validators.required]
  })


  editNotification = this.fb.group({
    id: ['', Validators.required],
    module: ['', Validators.required],
    action: ['', Validators.required],
    process: ['', Validators.required],
    status: ["", Validators.required],
    subject: ['', Validators.required],
    body: ['', Validators.required],
    channelId: ['', Validators.required],
    templateName: ['', Validators.required],
    namespace:  ['', Validators.required],
    cc: [''],
    fromemail: [''],
    bc: [''],
    Notify_type: [{ value: 'email', disabled: true },Validators.required],
    title: ["", Validators.required],
    priority: ["Low", Validators.required],
    created_by: '66694895cfaa5427c0be5f30',
    variables:[""]
  })

  addVariable() {
    if (this.isUpdateFormvisible) {
           this.templateVariables.push(this.editNotification.controls.variables.value)
          this.editNotification.get('variables')?.setValue("");
    }
    if (this.isFormvisible) {
          this.templateVariables.push(this.addNotification.controls.variables.value)
          this.addNotification.get('variables')?.setValue("");
    }
 }

  showEditModal(notify: any) {
    this.isTablevisible=false;
    this.isFormvisible=false;
    this.isUpdateFormvisible=true;
    this.populateUserEditForm(notify);
  }

  async populateUserEditForm(notify: any) {
   this.updateNotAddValidators([["title","priority","subject",'templateName',"namespace","channelId","process","action"]])
    if (notify) {
      this.editNotifyType = notify.Notify_type;
      this.updatehtml =  notify.message ?? notify.body ?? "";
      this.templateVariables = notify.templateVariables ?? [];
      this.editNotification.patchValue({
        id: notify._id,
        module: notify.module,
        action: notify.action ?? "",
        process: notify.process ?? "",
        status: notify.status===true? "1":"2",
        subject: notify.subject,
        body: notify.message ?? notify.body ?? "",
        cc: notify.cc ?? "",
        fromemail: notify.fromemail ?? "",
        bc: notify.bc ?? "",
        Notify_type: notify.Notify_type,
        created_by: '66694895cfaa5427c0be5f30',
        title: notify.title ?? "",
        priority: notify.priority ?? "",
        namespace: notify.namespace ?? "",
        channelId: notify.channelId ?? "",
        templateName: notify.templateName ?? '',
        variables:""
      });
      await this.fetchTemplateVar(this.authToken,notify.Notify_type,notify.module,notify.action ?? null,notify.process ?? null)
    }
  }
  
  onprocessChnage(event: any){
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedText = selectedOption.text;
    const selectedValue = selectedOption.value;
    // this.addNotification.patchValue({
    //   process_text: selectedText
    // });
  }

  addNotClearValidators(var_arr:any=[]) {
    if (var_arr.length > 0) {
      for (let item of var_arr) {
          this.addNotification?.get(item)?.clearValidators(); 
          this.addNotification?.get(item)?.updateValueAndValidity(); 
         }
      }
  }

  addNotAddValidators(var_arr:any=[]) {
    if (var_arr.length > 0) {
      for (let item of var_arr) {
            this.addNotification.get(item)?.setValidators([Validators.required]);
            this.addNotification.get(item)?.updateValueAndValidity();
         }
      }
  }

  async addNotifications(){
    this.isTablevisible=false;
    this.isFormvisible=true;
    this.isUpdateFormvisible = false;
    this.addNotification.reset({
              module: "", 
              action: "", 
              process: "", 
              status: "1", 
              subject: "", 
              body: "", 
              cc: "", 
              fromemail: "", 
              bc: "", 
              Notify_type: "email",
              created_by: "66694895cfaa5427c0be5f30", 
              title: "", 
              priority: "Low",
              namespace: "",
              templateName: "",
             channelId: "",
              variables:""
    });
    this.templateVariables=[]
    this.addNotAddValidators(["title", "priority", "namespace", "channelId", "templateName", "subject", "body", "action", "process"])
    await this.tempVarFunc()
  }

  async backtotable() {
    this.isTablevisible=true;
    this.isFormvisible=false;
    this.isUpdateFormvisible = false;
    this.getAllNotifications(this.authToken)
  }

 

  async insertNotification() {
    this.isFormSubmited2 = true;
    const notificationBody:any = this.addNotification.value;
    const data:any = {};
    if (notificationBody["Notify_type"]?.toLowerCase() === "email") {
      delete notificationBody.priority;
      delete notificationBody.title;
      delete notificationBody.channelId;
      delete notificationBody.namespace;
      delete notificationBody.templateName;
      delete notificationBody.variables
      data["emailNotificationBody"] = notificationBody
      data["webNotificationBody"] = null
      data["whatsappNotificationBody"] = null
      data["emailBulkBody"] = null
      data["whatsappBulkBody"] = null
      this.addNotClearValidators(["priority","title","channelId","namespace","templateName"])
    }
    if (notificationBody["Notify_type"]?.toLowerCase() === "web_notification") {
      delete notificationBody.cc;
      delete notificationBody.fromemail;
       delete notificationBody.bc;
      delete notificationBody.channelId;
      delete notificationBody.namespace;
      delete notificationBody.templateName;
       delete notificationBody.variables
      data["emailNotificationBody"] = null
      data["webNotificationBody"] = notificationBody
      data["whatsappNotificationBody"] = null
      data["emailBulkBody"] = null
      data["whatsappBulkBody"] = null
      this.addNotClearValidators(["channelId","namespace","templateName"])
    }

      if (notificationBody["Notify_type"]?.toLowerCase() === "whatsapp") {
      delete notificationBody.cc;
      delete notificationBody.fromemail;
      delete notificationBody.bc;
      delete notificationBody.priority;
      delete notificationBody.title;
      delete notificationBody.body;
      delete notificationBody.variables;
      if(this.templateVariables.length === 0) notificationBody["templateVariables"] = null;
      else {
        notificationBody["templateVariables"] = this.templateVariables;
        }    
      data["emailNotificationBody"] = null;
      data["webNotificationBody"] = null;
      data["whatsappNotificationBody"] = notificationBody;
      data["emailBulkBody"] = null
      data["whatsappBulkBody"] = null
      this.addNotClearValidators(["priority","title",'subject',"body"])
    }
    if(notificationBody["Notify_type"]?.toLowerCase() === "email_bulk") {
            delete notificationBody.priority;
            delete notificationBody.title;
            delete notificationBody.channelId;
            delete notificationBody.namespace;
            delete notificationBody.templateName;
            delete notificationBody.variables;
            delete notificationBody.action;
            delete notificationBody.process;
            data["emailNotificationBody"] = null
            data["webNotificationBody"] = null
            data["whatsappNotificationBody"] = null
            data["emailBulkBody"] = notificationBody
            data["whatsappBulkBody"] = null
            this.addNotClearValidators(["priority","title","channelId","namespace","templateName","action",'process'])
    }
     if(notificationBody["Notify_type"]?.toLowerCase() === "whatsapp_bulk") {
              delete notificationBody.cc;
              delete notificationBody.fromemail;
              delete notificationBody.bc;
              delete notificationBody.priority;
              delete notificationBody.title;
              delete notificationBody.body;
              delete notificationBody.variables;
              delete notificationBody.process;
              delete notificationBody.action;
              if(this.templateVariables.length === 0) notificationBody["templateVariables"] = null;
              else {
                notificationBody["templateVariables"] = this.templateVariables;
                }    
              data["emailNotificationBody"] = null;
              data["webNotificationBody"] = null;
              data["whatsappNotificationBody"] = null;
              data["emailBulkBody"] = null
              data["whatsappBulkBody"] = notificationBody
              this.addNotClearValidators(["priority","title",'subject',"body","process","action"])
      }
    this.authToken = localStorage.getItem('access_token');

    if (this.addNotification.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.ADDNOTIFICATION}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              this.appendNotification();
              this.backtotable();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while inserting the notification.' });
          }
        );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }

    updateNotClearValidators(var_arr:any=[]) {
    if (var_arr.length > 0) {
      for (let item of var_arr) {
          this.editNotification?.get(item)?.clearValidators(); 
          this.editNotification?.get(item)?.updateValueAndValidity(); 
         }
      }
  }

  updateNotAddValidators(var_arr:any=[]) {
    if (var_arr.length > 0) {
      for (let item of var_arr) {
            this.editNotification.get(item)?.setValidators([Validators.required]);
            this.editNotification.get(item)?.updateValueAndValidity();
         }
      }
  }


  async updateNotification2() {
    this.isFormSubmited2 = true;
    const data:any = this.editNotification.value;
    if (this.editNotifyType?.toLowerCase() === "email") {
      delete data["title"]
      delete data["priority"]
      delete data["namespace"]
      delete data["channelId"]
      delete data["templateName"]
      delete data["variables"]
       this.updateNotClearValidators(["priority","title","channelId","namespace","templateName"])
    }
    else  if(this.editNotifyType?.toLowerCase() === "web_notification") {
      delete data["cc"]
      delete data["bc"]
      delete data["fromemail"]
      delete data["channelId"]
      delete data["templateName"]
      data["message"] = data["body"]
      delete data["body"]
      delete data["variables"]
      this.updateNotClearValidators(["channelId","namespace","templateName"])
    }
    else  if(this.editNotifyType?.toLowerCase() === "whatsapp") {
      delete data["cc"]
      delete data["bc"]
      delete data["fromemail"]
      delete data["title"]
      delete data["priority"]
      delete data["body"]
      delete data["variables"]
      data["templateVariables"] = this.templateVariables;
      this.updateNotClearValidators(["priority","title",'subject',"body"])
    }
     else  if(this.editNotifyType?.toLowerCase() === "email_bulk") {
      delete data["title"]
      delete data["priority"]
      delete data["namespace"]
      delete data["channelId"]
      delete data["templateName"]
      delete data["variables"]
      delete data["process"]
      delete data["action"]
       this.updateNotClearValidators(["priority","title","channelId","namespace","templateName","process","action"])
    }
     else if(this.editNotifyType?.toLowerCase() === "whatsapp_bulk") {
      delete data["cc"]
      delete data["bc"]
      delete data["fromemail"]
      delete data["title"]
      delete data["priority"]
      delete data["body"]
      delete data["variables"]
      delete data["process"]
      delete data["action"]
      data["templateVariables"] = this.templateVariables;
      this.updateNotClearValidators(["priority","title",'subject',"body","process","action"])
    }
    this.authToken = localStorage.getItem('access_token');

    if (this.editNotification.valid) {
      const url = `${environment.apiURL}${constant.apiEndPoint.UPDATENOTIFICATION}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, data, { headers })
        .subscribe(
          response => {
            if (response.status === 1) {
              //this.updateNotification();
              this.getAllNotifications(this.authToken);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error => {
            console.error('Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the notification.' });
          }
        );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the mandatory fields!' });
    }
  }


  updateNotification() {
    const notification = this.NotifyList.find(n => n.id === this.editNotification.value.id);
    if (notification) {
      Object.assign(notification, this.editNotification.value);
    }
  }

  appendNotification() {
    this.NotifyList.push(this.addNotification.value);
    this.addNotification.reset();
  }




  confirmStatusChange2(user: any): void {
    Swal.fire({
      title: `Are you sure you want to ${user.status ? 'deactivate' : 'activate'} this template?`,
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

  toggleUserStatus(user: any): void {
    const newStatus = user.status === true ? false : true;
    this.indedentService.updateTemplateStatus(user._id, newStatus).subscribe(() => {
      user.status = newStatus;
      Swal.fire('Updated!', `Template has been ${newStatus === true ? 'activated' : 'deactivated'}.`, 'success');
    }, error => {
      Swal.fire('Error!', 'There was an error updating the template status.', 'error');
    });
  }



}
