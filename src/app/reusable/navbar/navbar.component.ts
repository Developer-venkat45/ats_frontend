import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  pageName: any = "";
  isShown: boolean = false;

  ngOnInit() {
    const user: any = localStorage.getItem('user');
    if(user == 3){
      this.pageName = "My Indent";
      this.isShown = false;
    }else{
      this.pageName = "All Indent";
      this.isShown = true;
    }

  }
}
