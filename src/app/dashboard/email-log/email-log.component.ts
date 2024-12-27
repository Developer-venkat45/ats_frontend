import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RouterModule} from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DashboardService } from '../../core/service/dashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-log',
  standalone: true,
  imports: [TableModule,RouterModule,InputTextModule,InputIconModule,IconFieldModule,FormsModule],
  templateUrl: './email-log.component.html',
  styleUrl: './email-log.component.css'
})
export class EmailLogComponent implements OnInit {

  clientService = inject(DashboardService);
  authToken: any;
  logNotifications: any[]=[];
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

  isDisabled: string='';
  isDisabled2: string='';
  searchQuery='';

  ngOnInit(): void {
    this.authToken = localStorage.getItem('authToken');
    this.getLogNotifications(this.authToken,this.limit,0,this.searchQuery);
    
  }
  getLogNotifications(authToken:string,limit:string,skip:number,search:string):void{
    this.clientService.getLogNotifications(authToken,limit,skip,search).subscribe(
      (res:any)=>{
        console.log(res);
        if(res.status == 1){
          this.logNotifications=res.result;
          this.totalRecord = res.total_record;
          this.filterdRecord = res.filter_record;
          this.fetchedRecord = res.fetched_record;

          if(this.fetchedRecord < this.limit){
            if(this.fetchedRecord<=10){
              this.endIndex2 = this.totalRecord;
            }else{
              this.endIndex2 = this.fetchedRecord;
            }
            this.endIndex = this.fetchedRecord;
            this.startIndex=0;
          }
          this.totalPages=Math.ceil(this.totalRecord/this.itemsPerPage)
          console.log(this.logNotifications)
        }
        else{
          this.logNotifications=[];
          this.totalRecord = 0;
          this.filterdRecord = 0;
          this.fetchedRecord = 0;
          this.endIndex=0;
        }
      },
      error=>{
        // Handle error
      }
    )
  }


  searchLogNotification(event: Event): void {
     const inputElement = event.target as HTMLInputElement; this.searchQuery = inputElement.value; 
     }

  onSubmit():void{
    if (this.searchQuery !== '') {
       this.getLogNotifications(this.authToken, this.limit, 0, this.searchQuery); 
      } else {
         this.searchQuery = ''; } console.log(this.searchQuery)
  }
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecord) {
      this.currentPage++;

      if(this.currentPage == 1){
        this.startIndex = 0;
        this.startIndex2 = 11;
        this.endIndex2 = this.itemsPerPage+10; 
      }else{
        this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.startIndex2 = this.startIndex+1;
        this.endIndex2 = this.itemsPerPage+this.startIndex; 
      }
      this.endIndex = this.startIndex + this.itemsPerPage;
      this.endIndex = this.endIndex-10;
      this.getLogNotifications(this.authToken, this.limit,this.endIndex, this.searchQuery);

      if(this.currentPage > 1){
        this.isDisabled = "";
      }else{
        this.isDisabled = "disabled";
      }

      
      if(this.currentPage < this.totalPages){
        this.isDisabled2 = "";
      }else{
        this.isDisabled2 = "disabled";
      }

      this.getLogNotifications(this.authToken, this.limit,this.endIndex, this.searchQuery);
}
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
      if(this.currentPage == 1){
        this.endIndex = 0;
        this.startIndex2 = this.startIndex+1;
        this.endIndex2 = this.itemsPerPage+this.startIndex; 
      }else{
        this.endIndex = this.startIndex + this.itemsPerPage;
        this.startIndex2 = this.startIndex+1;
        this.endIndex2 = this.itemsPerPage+this.startIndex;
        this.endIndex = this.endIndex-10;
      }
      this.getLogNotifications(this.authToken, this.limit,this.endIndex, this.searchQuery);
      
      if(this.currentPage > 1){
        this.isDisabled = "";
      }else{
        this.isDisabled = "disabled";
      }

      if(this.currentPage < this.totalPages){
        this.isDisabled2 = "";
      }else{
        this.isDisabled2 = "disabled";
      }

      this.getLogNotifications(this.authToken, this.limit,this.endIndex, this.searchQuery);
}
  }
}
