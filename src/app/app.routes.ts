import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ClientComponent } from './dashboard/client/client.component';
import { authGuard } from './service/auth.guard';
import { JobComponent } from './job/job.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { CandidateProfileComponent } from './dashboard/candidate-profile/candidate-profile.component';
import { CandidateComponent } from './dashboard/candidate/candidate.component';
import { RecruiteComponent } from './reusable/recruite/recruite.component';
import { AddindentComponent } from './dashboard/addindent/addindent.component';
import { AddAssessmentComponent } from './dashboard/add-assessment/add-assessment.component';
import { QuestionComponent } from './dashboard/question/question.component';
import { AssessmentComponent } from './dashboard/assessment/assessment.component';
import { AssessmentquestionsComponent } from './dashboard/assessmentquestions/assessmentquestions.component';
import { AssessmentTestComponent } from './assessment-test/assessment-test.component';
import { AdminusersComponent } from './dashboard/adminusers/adminusers.component';
import { AddformComponent } from './reusable/addform/addform.component';
import { FormsComponent } from './reusable/forms/forms.component';
import { MyaccountComponent } from './dashboard/myaccount/myaccount.component';
import { UsersComponent } from './dashboard/users/users.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ClientDetailsComponent } from './dashboard/client-details/client-details.component';
import { AddcandidateComponent } from './dashboard/addcandidate/addcandidate.component';
import { EandiComponent } from './dashboard/eandi/eandi.component';
import { RegisterComponent } from './register/register.component';
import { EanditestComponent } from './eanditest/eanditest.component';
import { PartnerComponent } from './dashboard/partner/partner.component';
import { MyapplicationComponent } from './dashboard/myapplication/myapplication.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { CandidateprofileComponent } from './dashboard/candidateprofile/candidateprofile.component';
import { RegisterpartnerComponent } from './registerpartner/registerpartner.component';
import { IndentCandidateComponent } from './dashboard/indent-candidate/indent-candidate.component';
import { PartnerDetailsComponent } from './dashboard/partner-details/partner-details.component';
import { CvuploadComponent } from './dashboard/cvupload/cvupload.component';
import { NotificationComponent } from './dashboard/notification/notification.component';
import { AddeandiQuestionComponent } from './dashboard/addeandi-question/addeandi-question.component';
import { AppliedDetailsComponent } from './dashboard/applied-details/applied-details.component';
import { MasterComponent } from './dashboard/master/master.component';
import { AddassessmentQuestionComponent } from './dashboard/addassessment-question/addassessment-question.component';
import { SendTokenComponent } from './send-token/send-token.component';
import { EditindentComponent } from './dashboard/editindent/editindent.component';
import { NotificationTemplateComponent } from './dashboard/notification-template/notification-template.component';
import { MasterDataComponent} from  './dashboard/master-data/master-data.component';
import { EditeandiQuestionComponent } from './dashboard/editeandi-question/editeandi-question.component';
import { StateMasterComponent } from './dashboard/state-master/state-master.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { UserComponent } from './dashboard/user/user.component';
import { compileClassDebugInfo } from '@angular/compiler';
import { Component } from '@angular/core';
import { UserProfileComponent } from './dashboard/user-profile/user-profile.component';
import { Header } from 'primeng/api';
import { Page404Component } from './page-404/page-404.component';
import { EnitestComponent } from './dashboard/enitest/enitest.component';
import { ProjectSPOCComponent } from './dashboard/project-spoc/project-spoc.component';
import { EditconfigComponent } from './dashboard/editconfig/editconfig.component';
import { EmailLogComponent } from './dashboard/email-log/email-log.component';
import { ReportComponent } from './dashboard/report/report.component';
import { DebugComponent } from './debug/debug.component';
import { BulkNotificationLogComponent } from './dashboard/bulk-notification-log/bulk-notification-log.component';

export const routes: Routes = [
    {path:'',component:HeaderComponent,children:[{path:'',component:HomeComponent}]},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'forgot-password',component:ForgotPasswordComponent},
    {path:'send-token',component:SendTokenComponent},

    {path:'client',component:HeaderComponent,children:[{path:'',component:ClientComponent, canActivate: [authGuard]}]},
    {path:'client-details/:id',component:HeaderComponent,children:[{path:'',component:ClientDetailsComponent, canActivate: [authGuard]}]},

    {path:'job',component:HeaderComponent,children:[{path:'',component:JobComponent}]},
    {path:'job/:jobCategory',component:HeaderComponent,children:[{path:'',component:JobComponent}]},
    {path:'job/:jobCategory/:jobLocation',component:HeaderComponent,children:[{path:'',component:JobComponent}]},

    {path:'indent',component:HeaderComponent,children:[{path:'',component:JobComponent}]},
    {path:'indent/:jobCategory',component:HeaderComponent,children:[{path:'',component:JobComponent}]},
    {path:'indent/:jobCategory/:jobLocation',component:HeaderComponent,children:[{path:'',component:JobComponent}]},

    {path:'jobpopup',component:HeaderComponent,children:[{path:'',component:RecruiteComponent}]}, //Not in use
    {path:'job_details/:id',component:HeaderComponent,children:[{path:'',component:JobDetailsComponent}]},
    {path:'candidate',component:HeaderComponent,children:[{path:'',component:CandidateComponent, canActivate: [authGuard]}]},
    {path:'candidates',component:HeaderComponent,children:[{path:'',component:IndentCandidateComponent, canActivate: [authGuard]}]},
    {path:'candidate_details/:id/:indentId',component:HeaderComponent,children:[{path:'',component:CandidateProfileComponent, canActivate: [authGuard]}]},

    {path:'addcandidate',component:HeaderComponent,children:[{path:'',component:AddcandidateComponent, canActivate: [authGuard]}]},
    {path:'addindent',component:HeaderComponent,children:[{path:'',component:AddindentComponent, canActivate: [authGuard]}]},
    {path:'assessment',component:HeaderComponent,children:[{path:'',component:AssessmentComponent, canActivate: [authGuard]}]},
    {path:'addassessment',component:HeaderComponent,children:[{path:'',component:AddAssessmentComponent, canActivate: [authGuard]}]},
    {path:'assessmentquestion/:id',component:HeaderComponent,children:[{path:'',component:AssessmentquestionsComponent, canActivate: [authGuard]}]},
    {path:'assessmenttest/:indentid/:assesmentid/:candidateid',component:HeaderComponent,children:[{path:'',component:AssessmentTestComponent, canActivate: [authGuard]}]},
    {path:'addquestion/:id',component:HeaderComponent,children:[{path:'',component:QuestionComponent, canActivate: [authGuard]}]},

    {path:'adminusers',component:HeaderComponent,children:[{path:'',component:AdminusersComponent}]},
    {path:'addforms',component:HeaderComponent,children:[{path:'',component:AddformComponent}]},
    {path:'forms/:id',component:HeaderComponent,children:[{path:'',component:FormsComponent}]},
    {path:'myaccount',component:HeaderComponent,children:[{path:'',component:MyaccountComponent,canActivate: [authGuard]}]},
    {path:'users',component:HeaderComponent,children:[{path:'',component:UsersComponent,canActivate: [authGuard]}]},
    {path:'eandi',component:HeaderComponent,children:[{path:'',component:EandiComponent, canActivate: [authGuard]}]},
    {path:'enaditest/:indentid/:eandiid/:candidateid',component:HeaderComponent,children:[{path:'',component:EanditestComponent, canActivate: [authGuard]}]},
    {path:'enaditest/:indentid/:eandiid/:candidateid/:apply',component:HeaderComponent,children:[{path:'',component:EanditestComponent, canActivate: [authGuard]}]},
    {path:'partner',component:HeaderComponent,children:[{path:'',component:PartnerComponent, canActivate: [authGuard]}]},
    {path:'partner-details/:id',component:HeaderComponent,children:[{path:'',component:PartnerDetailsComponent, canActivate: [authGuard]}]},
    {path:'myapplication',component:HeaderComponent,children:[{path:'',component:MyapplicationComponent, canActivate: [authGuard]}]},
    {path:'appliedindent/:id',component:HeaderComponent,children:[{path:'',component:MyapplicationComponent, canActivate: [authGuard]}]},
    {path:'emailverification',component:EmailVerificationComponent},
    {path:'candidateprofile/:candidateId',component:HeaderComponent,children:[{path:'',component:CandidateprofileComponent, canActivate: [authGuard]}]},
    {path:'registerpartner',component:RegisterpartnerComponent},
    {path:'cvupload/:id',component:HeaderComponent,children:[{path:'',component:CvuploadComponent, canActivate: [authGuard]}]},
    {path:'template',component:HeaderComponent,children:[{path:'',component:NotificationTemplateComponent, canActivate: [authGuard]}]},
    {path:'master',component:HeaderComponent,children:[{path:'',component:MasterComponent, canActivate: [authGuard]}]},
    {path:'addeandiquestion/:id',component:HeaderComponent,children:[{path:'',component:AddeandiQuestionComponent, canActivate: [authGuard]}]},
    {path:'addassessmentquestion/:id',component:HeaderComponent,children:[{path:'',component:AddassessmentQuestionComponent, canActivate: [authGuard]}]},
    {path:'applieddetails/:id',component:HeaderComponent,children:[{path:'',component:AppliedDetailsComponent, canActivate: [authGuard]}]},
    {path:'editindent/:id',component:HeaderComponent,children:[{path:'',component:EditindentComponent, canActivate: [authGuard]}]},
    {path: 'notification', component: HeaderComponent, children: [{ path: '', component: NotificationComponent, canActivate: [authGuard] }] },
    {path:'master/:masterCategory',component:HeaderComponent,children:[{path:'',component:MasterDataComponent}]},
    {path:'editeandiquestion/:id',component:HeaderComponent,children:[{path:'',component:EditeandiQuestionComponent,canActivate:[authGuard]}]},
    {path:'statemaster',component:HeaderComponent,children:[{path:'',component:StateMasterComponent,canActivate: [authGuard]}]},
    {path:'helpcenter',component:HeaderComponent,children:[{path:'',component:HelpCenterComponent,canActivate:[authGuard]}]},
    {path:'user',component:HeaderComponent,children:[{path:'',component:UserComponent,canActivate:[authGuard]}]},
    {path:'user-profile/:id',component:HeaderComponent,children:[{path:'',component:UserProfileComponent,canActivate:[authGuard]}]},
    {path:'enitest/:indentid/:eandiid/:candidateid',component:HeaderComponent,children:[{path:'',component:EnitestComponent, canActivate: [authGuard]}]},
    {path:'projectspoc',component:HeaderComponent,children:[{path:'',component:ProjectSPOCComponent,canActivate:[authGuard]}]},
    {path:'editconfig',component:HeaderComponent,children:[{path:'',component:EditconfigComponent,canActivate: [authGuard]}]},
    {path:'emaillog',component:HeaderComponent,children:[{path:'',component:EmailLogComponent,canActivate:[authGuard]}]},
    { path: 'report/:partner', component: HeaderComponent, children: [{ path: '', component: ReportComponent, canActivate: [authGuard] }] },
    { path: 'debugroutes',component: HeaderComponent, children: [{ path: '', component: DebugComponent, canActivate: [authGuard] }]  },
    {path:'dashboard',component:HeaderComponent,children:[{path:'',component:ReportComponent,canActivate:[authGuard]}]},
    {path:'bulknotificationlog',component:HeaderComponent,children:[{path:'',component:BulkNotificationLogComponent,canActivate:[authGuard]}]},
    { path: '**', component: Page404Component },
];

