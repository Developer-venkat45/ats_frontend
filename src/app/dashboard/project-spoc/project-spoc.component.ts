import { Component, OnInit } from '@angular/core';
import { RouterModule} from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-project-spoc',
  standalone: true,
  imports: [RouterModule,NgxSkeletonLoaderModule],
  templateUrl: './project-spoc.component.html',
  styleUrl: './project-spoc.component.css'
})
export class ProjectSPOCComponent implements OnInit{
  
  loader: boolean = true;


  ngOnInit(): void {
  
  setTimeout(() => {
    if (this.loader === true) {
      this.loader = false;
    }
  }, 5000);

  }

}
