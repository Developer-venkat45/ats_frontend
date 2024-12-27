export interface ClientResponse {
  id: string
  _id: string
  name: string
  short_name: string
  logo: string
  website: string
  description: string
  address: string
  state: string
  city: string
  industry: string[]
  sector: string[]
  spoc: Spoc[]
  tmi_spoc: TmiSpoc
  location_taxonomy: string[]
  status: number
  indentCount: number
}

export interface Spoc {
  name: string
  email: string
  mobile: string
}

export interface TmiSpoc {
  name: string
  email: string
  mobile: string
}

export interface formList {
  id: number
  label_name: string
  placeholder: string
  input_type: string
}

export interface Forms{
  _id: Id
  form_name:string
  form_data:formList
  status:number
  created_at:string
  modified_at:string
}


export interface JobDetailsResponse {
  _id: Id
  job_title: string
  company: string
  experience: string
  salary: string
  location: string
  description: string
  skills: string[]
  posted: string
  stages: Stages
  status: number
  category: string
  project: Project
}

export interface Id {
  $oid: string
}

export interface Stages {
  Hire: number
  Interview: number
  Offer: number
  Screening: number
}

export interface Project {
  $oid: string
}

export interface total_record {
  total_record: number
}





  

  export interface singleJobDetails {
    id: string
    job_title: string;
    company: string;
    experience: string;
    salary: string;
    location: string;
    description: string;
    skills: string[];
    posted: string;
    stages: Stages;
    status: string;
  }


  export interface Stages {
    Screening: number;
    Interview: number;
    Offer: number;
    Hire: number;
  }

  export interface Recoom_candidate {
    id: string
    name: string
    experience: string
  }

  export interface category {
    id: string
    name: string
  }

  export interface Indent_type {
    indent_types: string[][]
  }

  // export interface Candidate {
  //   id: string
  //   name: string
  //   experience: string
  //   location?: string;
  // }


  export interface Candidate {
    _id: string
    candidates_bulk: string
    project: string
    file_path: string
    name: string
    highest_qualification: string
    dob: any
    total_experience: string
    latest_company: string
    role_in_latest_company: string
    joining_date_of_latest_company: string
    nism_certified: any
    email: string
    mobile: string
    highest_qualification_category: string
    status: boolean
    created_by: number
    created_at: string
    candidate_summary: string
    score: number
    strengths: string[]
    jobtitle: string
    assessmentId: string
    stageing: Stageing
  }



  export interface Stageing {
    screening: Screening
    interview: Interview
    offer: Offer
    hire: Hire
  }
  
  export interface Screening {
    scored: boolean
    EandIDone: boolean
    onlineAssessment: boolean
    offlineAssessment: boolean
    calToAction: boolean
    selected: boolean
    rejected: boolean
    hold: boolean
    shortList: boolean
    approvedShortList: boolean
    rejectedShortList: boolean
  }
  
  export interface Interview {
    scheduledCreated: boolean
    candidatesScheduled: boolean
    interviewAttende: boolean
    interviewSelected: boolean
    interviewRejected: boolean
    interviewHold: boolean
    candidateRescheduled: boolean
    candidateDropped: boolean
  }
  
  export interface Offer {
    documentsSubmitted: boolean
    partialDocumentsSubmitted: boolean
    documentsNotSubmitted: boolean
    offerReleased: boolean
    offerAcceptance: boolean
    offerRejected: boolean
    offerHold: boolean
  }
  
  export interface Hire {
    joinedYet: boolean
    joinedLeft: boolean
    joinedCompleted: boolean
  }

  
  
  

  export interface APIResponseModel{
    status: string
    message: boolean
    result: any;
  }

  export interface APIResponseModelGrid{
    status: string
    message: boolean
    result: any
    total_record: number;
  }


  export interface QuestionResponse {
    id: string
    question: string
    type: string
  }
  

  export interface Assessment {
    id: string
    title: string
  }


  export interface AssessmentCategory {
    name: Name[]
  }
  
  export interface Name {
    name: string
  }





export interface JobDetailsResponse2 {
  _id: Id
  indentStep1: IndentStep1
  indentStep2: IndentStep2
  indentStep3: IndentStep3
  indentStep4: IndentStep4
  status: number
  created_at: CreatedAt
  client: Client[]
}

export interface Id {
  $oid: string
}

export interface IndentStep1 {
  jobtitle: string
  jobcode: string
  jobclient: string
  indentProject: string
  jobtype: string
  hidefromjobseekers: boolean
  department: string
  primarylocation: string
  businessunit: string
  joblevel: string
  jobfunction: string
  jobsector: string
  jobindustry: string
  recruiterList: RecruiterList[]
}

// export interface RecruiterList {
//   item_id: ItemId
//   item_text: string
// }

export interface ItemId {
  $oid: string
}

export interface IndentStep2 {
  advLocation: string[]
  minSalary: string
  maxSalary: string
  salaryUnit: string
  hidefromjobseekers: boolean
  negotiable: boolean
  vacancies: string
  skilsList: string[]
  experienceYear: string
  experienceMonth: string
  jobDescription: string
  clientDescription: string
}

// export interface IndentStep3 {
//   assessmentType: number
//   assessmentId: AssessmentId
// }

export interface AssessmentId {
  $oid: string
}

export interface IndentStep4 {
  stages: Stages
}

export interface Stages {
  Hire: number
  Interview: number
  Offer: number
  Screening: number
}
  
export interface CreatedAt {
  $date: string
}


// export interface Client {
//   _id: Id2
//   name: string
//   short_name: string
//   logo: string
//   address: string
//   state: string
//   city: string
//   website: string
// }

export interface Id2 {
  $oid: string
}




export interface CandidateAssessmentScore {
  _id: string
  assessment_data: AssessmentDaum[]
  score: number
  assessmentId: string
  candiate: string
  status: number
  created_at: string
  modified_at: string
  assessmenttitle: string
  jobtitle: string
}

export interface AssessmentDaum {
  questionId: string
  correctAnswer: string
  selectedAnswer: string
  weightage: number
}












export interface JobDetailsResponse3 {
  indentId: string
  indentStep1: IndentStep1
  indentStep2: IndentStep2
  indentStep3: IndentStep3
  indentStep4: IndentStep4
  status: number
  created_at: string
  client: Client[]
  stages: Stages2
  posted_on: string
}

export interface IndentStep1 {
  jobtitle: string
  jobcode: string
  jobclient: string
  jobtype: string
  hidefromjobseekers: boolean
  department: string
  primarylocation: string
  businessunit: string
  joblevel: string
  jobfunction: string
  jobsector: string
  jobindustry: string
  recruiterList: RecruiterList[]
  category: string
}

export interface RecruiterList {
  item_id: string
  item_text: string
}

export interface IndentStep2 {
  advLocation: string[]
  minSalary: string
  maxSalary: string
  salaryUnit: string
  hidefromjobseekers: boolean
  negotiable: boolean
  vacancies: string
  skilsList: string[]
  experienceYear: string
  experienceMonth: string
  jobDescription: string
  clientDescription: string
}

export interface IndentStep3 {
  assessmentType: number
  assessmentId: string
  assessmentCutScore: number
}

export interface IndentStep4 {
  stages: Stages
}

export interface Stages {
  Hire: number
  Interview: number
  Offer: number
  Screening: number
}

export interface Client {
  _id: string
  name: string
  short_name: string
  logo: string
  description: string
  address: string
  state: string
  city: string
  industry: string[]
  sector: string[]
  spoc: Spoc[]
  tmi_spoc: TmiSpoc
  location_taxonomy: string[]
  website: string
}

export interface Spoc {
  name: string
  email: string
  mobile: string
}

export interface TmiSpoc {
  name: string
  email: string
  mobile: string
}

export interface Stages2 {
  Screening: number
  Hire: number
  Interview: number
  Offer: number
}



export interface usersDetails {
  partner_id: string | null | undefined
  _id: string
  name: string
  username: string
  email: string
  role_id: number
  role_text: string
  client_id: string
  client_name: string
  created_by: string
  password: string
  image: any
  mobile: any
  company: any
  department: any
  designation: any
  gender: any
  zone: any
  state: any
  city: any
  pincode: any
  address: any
  created_on: string
  failed_login_count: number
  status: number
  last_login: string
  last_login_ip: string
  auth_key: any
  otp: any
  otp_time: any
}









export interface ClientResponse2 {
  _id: string
  name: string
  shortName: string
  firmName: string
  description: string
  address: string
  state: string
  city: string
  industry: string[]
  sector: string[]
  clientLogo: string
  location: string[]
  pancard: string
  pancardImage: any
  gstin: string
  gistinNumber: string
  gstinImage: any
  indentCount: number
  status: number
}


export interface recruiter {
  _id: string
  name: string
}


export interface MasterData {
  _id: {
    $oid: string;
  };
  indent_type: string[] | null;
  emp_type: string[] | null;
  type: string;
  data: string[] | null;
  placeholder_type: string[] | null;
}