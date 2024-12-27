import { Component,inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { usersDetails } from '../../core/model/model';
import { DashboardService } from '../../core/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule ,DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule,DatePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{

  indedentService = inject(DashboardService);
  authToken:any="";
  apiURL: any;
  userDetailsData: usersDetails | null = null;
  userProfileId: any;
  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.apiURL= environment.apiURL;
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('access_token');
    this.userProfileId = this.route.snapshot.paramMap.get('id')!;
    this.getAllUsers2(this.authToken, this.userProfileId);
  }

  getAllUsers2(authToken: string, id: string): void {
    this.indedentService.getAllUsers2(authToken, id).subscribe(
      (res: any) => {
        this.userDetailsData = res.result[0];

        console.log('check',this.userDetailsData);
      },
      error => {
         // Handle error
      }
    );
  }

}
