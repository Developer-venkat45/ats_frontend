 export interface Project {
    _id: Id
    name: string
    description: string
    client: Client
    user: User
    client_details: ClientDetail[]
    project_manager_details: ProjectManagerDetail[]
  }
  
  export interface Id {
    $oid: string
  }
  
  export interface Client {
    $oid: string
  }
  
  export interface User {
    $oid: string
  }
  
  export interface ClientDetail {
    _id: Id2
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
  
  export interface Id2 {
    $oid: string
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
  
  export interface ProjectManagerDetail {
    _id: Id3
    name: string
    phone_number: any
    email: string
    company_id: CompanyId
    status: number
    created_by: any
    created_at: CreatedAt
    modified_by: any
    modified_at: ModifiedAt
  }
  
  export interface Id3 {
    $oid: string
  }
  
  export interface CompanyId {
    $oid: string
  }
  
  export interface CreatedAt {
    $date: string
  }
  
  export interface ModifiedAt {
    $date: string
  }
  

  export interface APIResponseModelGrid{
    status: string
    message: boolean
    result: any
    total_record: number;
  }