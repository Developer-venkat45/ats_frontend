import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../reusable/navbar/navbar.component';
import { DashboardService } from '../../core/service/dashboard.service';
import { APIResponseModelGrid} from '../../core/model/model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { constant } from '../../core/constant/constant';

interface SelectedAnswer {
  questionId: string;
  correctAnswer: string;
  selectedAnswer: string;
  weightage: number;
}

@Component({
  selector: 'app-assessmentquestions',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './assessmentquestions.component.html',
  styleUrl: './assessmentquestions.component.css'
})
export class AssessmentquestionsComponent implements OnInit{
  clientService = inject(DashboardService);
  apiMessage:any="";
  authToken:any="";
  assessmentList: any [] = [];
  assessmentId: any ="";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.assessmentId = this.route.snapshot.paramMap.get('id')!;
    this.authToken = localStorage.getItem('access_token');
    this.getAllAssessmentSingle(this.authToken, this.assessmentId);
  }


  getAllAssessmentSingle(authToken: string, assessmentId: string): void {
    this.clientService.getAllAssessmentSingle(authToken,assessmentId).subscribe(
      (res: APIResponseModelGrid) => {
        this.assessmentList = res.result;
        console.log(this.assessmentList)
      },
      error => {
        // Handle error
      }
    );
  }

  score: number = 0;
  selectedAnswers: SelectedAnswer[] = [];

  onAnswerSelect(questionId: string, correctAnswer: string, selectedAnswer: string, weightage: number) {
    const existingAnswerIndex = this.selectedAnswers.findIndex(answer => answer.questionId === questionId);

    if (existingAnswerIndex > -1) {
      if (this.selectedAnswers[existingAnswerIndex].correctAnswer === selectedAnswer) {
        this.score += this.selectedAnswers[existingAnswerIndex].weightage;
      }else{
        this.score -= this.selectedAnswers[existingAnswerIndex].weightage; 
      }
      this.selectedAnswers[existingAnswerIndex] = { questionId, correctAnswer, selectedAnswer, weightage };
    } else {
      this.selectedAnswers.push({ questionId, correctAnswer, selectedAnswer, weightage });
    }
    if (correctAnswer === selectedAnswer) {
      this.score += weightage;
    }

    console.log('Selected Answers:', this.selectedAnswers);
    console.log('Current Score:', this.score);
  }


  submitAssessment() {
    const payload = {
      selectedAnswers: this.selectedAnswers,
      score: this.score,
      assessmentId: this.assessmentId,
      candiate:this.assessmentId,
      indentid:this.assessmentId
    };

    fetch(environment.apiURL+'Assessment/submit_assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

}
