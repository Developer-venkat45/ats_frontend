import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ats_frontend';

  // isLoggedIn:boolean = false;
  // userDetails: any = {};
  // constructor(private router: Router){}

  ngOnInit() {
    // const localData: any = localStorage.getItem('access_token');
    // this.userDetails = localStorage.getItem('userDetails');
    // if (localData !== null) {
    //   this.isLoggedIn = true;
    // } else {
    //   this.isLoggedIn = false;
    // }
    //console.log(this.userDetails);
  }

  // logout(){
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('name');
  //   localStorage.removeItem('uid');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('userDetails');
    
  //   this.router.navigateByUrl('login');
  // }

}
