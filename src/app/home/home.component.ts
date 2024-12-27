import { Component } from '@angular/core';
import { JobComponent } from '../job/job.component';
import { IndentComponent } from '../reusable/indent/indent.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JobComponent, IndentComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor() { 
    localStorage.setItem('prevoius', 'home');
  }
}
