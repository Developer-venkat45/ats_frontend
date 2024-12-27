import { Component,inject } from '@angular/core';
import { AddindentComponent } from '../addindent/addindent.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IndentComponent } from '../../reusable/indent/indent.component';
import { AddformComponent } from '../../reusable/addform/addform.component';
import { DashboardService } from '../../core/service/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminusers',
  standalone: true,
  imports: [AddindentComponent,FormsModule,CommonModule,IndentComponent,AddformComponent],
  templateUrl: './adminusers.component.html',
  styleUrl: './adminusers.component.css'
})
export class AdminusersComponent {
  usertype:any=0;
  selectedoption:any=8;
  indentService = inject(DashboardService);
  authToken:any="";
  formList:any;
  constructor(private router: Router){
    this.usertype = localStorage.getItem('user');
    if(this.usertype==1){

    }
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.getAllForms(this.authToken);
  }

  getAllForms(authToken: string): void {
    this.indentService.getAllForms(authToken).subscribe(
      (res: any) => {
        this.formList = res;        
      }
    );
  }

  async viewform(oid:any){
    console.log(oid.$oid);
    await this.router.navigate(['/forms/',oid.$oid]);

  }

  async selectoption(option:any){
    this.selectedoption=option;
  }
}
