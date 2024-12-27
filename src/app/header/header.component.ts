import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterModule,OverlayPanelModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn:boolean = false;
  userDetails: any = {};
  loginedName: any = null;
  isShown: boolean = false;
  isShown2: boolean = false;
  isShown3: boolean = false;
  loginUserRole: string = '';

  partner: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute){

  }

  ngOnInit() {
    this.partner = this.route.snapshot.paramMap.get('partner')!;
    const localData: any = localStorage.getItem('access_token');
    this.userDetails = localStorage.getItem('userDetails');
    this.loginedName = localStorage.getItem('name');
    this.partner = 'partner'
    if (localData !== null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    this.route.queryParams.subscribe(params => {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          if (key.startsWith('utm_')) {
            localStorage.setItem('user_source', params[key]);
          }
        }
      }
      const source = params['platform'] || params['job_platform'];
      if(source){
        localStorage.setItem('user_source', source);
      }
    });

    const user: any = localStorage.getItem('user');
    this.loginUserRole = user;
    if(user == 'Central Recruter' || user == 'Recruiter'|| user == 'Partner SPOC - Recruiter' || user == 'Partner SPOC - Manager' || user == 'Partner Manager'){
      this.isShown = false;
      this.isShown2 = true;
      this.isShown3 = true;
    }else if (user == 'CRCM'){
      this.isShown = true;
      this.isShown2 = true;
      this.isShown3 = false;
    }else if (user == 'MIS Admin'){
      this.isShown = true;
      this.isShown2 = false;
      this.isShown3 = true;
    }else if (user == 'Candidate'){
      this.isShown = false;
      this.isShown2 = false;
      this.isShown3 = false;
    }else{
      this.isShown2 = true;
      this.isShown = true;
      this.isShown3 = true;
    }
  }


  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    localStorage.removeItem("role_id")
    localStorage.removeItem("role_name")
    localStorage.removeItem("partner_id");
    localStorage.removeItem("candidate_id");
    localStorage.removeItem('userDetails');
    this.router.navigateByUrl('login');
  }
  
}
