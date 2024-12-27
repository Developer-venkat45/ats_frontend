export interface indentDetails {
    indentId: string
    indentStep1: IndentStep1
    indentStep2: IndentStep2
    indentStep3: IndentStep3
    indentStep4: IndentStep4
    indentStep5: IndentStep5
    indentStep6: IndentStep6
    status: number
    client: Client[]
    created_at: string
    stages: Stages
    posted_on: string
    indent_status: string
  }
  
  export interface IndentStep1 {
    jobTitle: string
    jobCode: string
    jobCategory: string
    jobClient: string
    jobClientSpoc: string
    hideClient: boolean
    jobType: string
    department: string
    businessUnit: string
    jobLevel: string
    jobFunction: string
    jobSector: string
    jobIndustry: string
    recruiterList: RecruiterList[]
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
    negotiable: boolean
    vacancies: number
    skilsList: string[]
    minExperience: number
    maxExperience: number
    jobDescription: string
    clientDescription: string
  }
  
  export interface IndentStep3 {
    skills: Skills
    education: Education
    experience: Experience
    scoring: Scoring
  }
  
  export interface Skills {
    mustHaveSkills: string
    goodHaveSkills: string
  }
  
  export interface Education {
    scDegree: string
    scSpecialization: string
    scLevel: string
    scQuality: string
  }
  
  export interface Experience {
    scMinExperience: number
    scMaxExperience: number
    scPrvJobRole: string
    scJobIndustry: string
    scPreEmp: string
    scCompanyAge: string
    scCompanySize: string
  }
  
  export interface Scoring {
    scSkillWeightage: number
    scEducationWeightage: number
    scExperienceWeightage: number
  }
  
  export interface IndentStep4 {
    eandiId: string
  }
  
  export interface IndentStep5 {
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
  
  export interface IndentStep6 {
    assessmentType: number
    assessmentId: string
    assessmentCutScore: number
  }
  
  export interface Client {
    _id: string
    name: string
    shortName: string
    clientLogo: string
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
  
  export interface Stages {
    Screening: number
    Hire: number
    Interview: number
    Offer: number
  }
  