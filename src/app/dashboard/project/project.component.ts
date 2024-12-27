import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/service/dashboard.service';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../core/model/project_model';


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  projectService = inject(DashboardService);

  projectList: Project [] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const clientId:any = this.route.snapshot.queryParamMap.get('id');
    const authToken:any = localStorage.getItem('access_token');
    this.getAllProject(authToken, '10', clientId);
  }

  getAllProject(authToken: string, limit: string, clientId: string): void {
    this.projectService.getAllProject(authToken, '10', clientId).subscribe(
      (res: any) => {
        this.projectList = res.result;
        console.log(this.projectList);
      },
      error => {
        // Handle error
      }
    );
  }


}
