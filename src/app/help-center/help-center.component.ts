import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.css'
})
export class HelpCenterComponent implements OnInit {
  isShowing1:boolean=true;
  videoTitle: any = [];
  videoLink: any = [];
  currentItem: number = 0;
  activeTitle: string = 'How to Login & Forgot Password.';
  activeLink: string = 'http://uatats.tminetwork.com/assets/guides/TMI-RTS-How-to-login-&-Forgot-Password.mp4';

  ngOnInit(): void {
    this.videoTitle[0] = "How to Login & Forgot Password.";
    this.videoTitle[1] = "How to View the Jobs & Filter the required Job.";
    this.videoTitle[2] = "How to upload candidates for a job."
    this.videoTitle[3] = "How to Change the Status of the Candidate for the Job."
    
    this.videoLink[0] = "http://uatats.tminetwork.com/assets/guides/TMI-RTS-How-to-login-&-Forgot-Password.mp4";
    this.videoLink[1] = "http://uatats.tminetwork.com/assets/guides/TMI-RTS-How-to-view-the-Jobs-&-Filter-the-required-Job.mp4";
    this.videoLink[2] = "http://uatats.tminetwork.com/assets/guides/TMI-RTS-How-to-upload-candidates-for-a-job.mp4";
    this.videoLink[3] = "http://uatats.tminetwork.com/assets/guides/TMI-RTS-How-to-change-the-status-of-the-candidate-for-the-job.mp4";
  }
  onShowClick(id: any){
    this.isShowing1 = true;
    this.activeTitle = this.videoTitle[id];
    this.activeLink = this.videoLink[id];
    this.currentItem = id;
  }
}
