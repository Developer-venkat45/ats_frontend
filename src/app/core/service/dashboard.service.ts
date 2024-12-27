import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { APIResponseModel, APIResponseModelGrid, JobDetailsResponse, Recoom_candidate, category, Indent_type } from '../model/model';
import { Project } from '../model/project_model';
import { environment } from '../../../environments/environment.development';
import { constant } from '../constant/constant';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isRefreshing = false;


  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {
  }


  getRefreshToken(): Observable<any> {
    let loginUserData: any;
    const localData = localStorage.getItem('userDetails');
    if (localData != null) {
      loginUserData = JSON.parse(localData);
    }

    const data = {
      token: loginUserData.refresh_token,
    };

    return this.http.post(`${this.apiURL}${constant.apiEndPoint.GENACCESSTOKEN}`, data).pipe(
      tap((response: any) => {
        const newToken = response.result;
        localStorage.setItem('access_token', newToken);
        this.refreshTokenSubject.next(newToken);
      })
    );
  }

  refreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getRefreshToken().subscribe(
        (response: any) => {
          resolve(response.result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  getAllClient(authToken: string, name: string = '', sector: string = '', industry: string = '', status: string = '', limit: string = '', skip: number = 0): Observable<APIResponseModelGrid> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}${constant.apiEndPoint.GETCLIENT}?name=${name}&sector=${sector}&industry=${industry}&status=${status}&limit=${limit}&skip=${skip}`, requestOptions);
  }



  getAllIndent(authToken: string, limit: string, category: string, searchQuery: string, searchLocationData: string, clientId: string | null | undefined, timePeriod: string, indentType: string, recruiterId: string, candidateId: string, partnerId: string, skip: number): Observable<APIResponseModelGrid> {
    const client_id = clientId ?? '';
    const top = limit ?? 10;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}indent/get_all_indents?limit=${top}&category=${category}&search=${searchQuery}&location=${searchLocationData}&clientId=${client_id}&filterByTime=${timePeriod}&indent_type=${indentType}&recruiter_id=${recruiterId}&candidate_id=${candidateId}&partner_id=${partnerId}&skip=${skip}`, requestOptions);
  }

  getAllForms(authToken: string): Observable<APIResponseModelGrid> {


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}getforms`, requestOptions);
  }


  getFormdata(authToken: string, id: string): Observable<APIResponseModelGrid> {


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}forms_data/${id}`, requestOptions);
  }

  getMastersdata(authToken: any): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}master/getmasters`, requestOptions);
  }

  insertMasterData(authToken: any, data: any): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post<APIResponseModelGrid>(`${this.apiURL}master/insert_master_data`, data, requestOptions);
  }

  insertCityData(authToken: any, cityData: any): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'  // 
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post<APIResponseModelGrid>(`${this.apiURL}master/insert_city_data`, cityData, requestOptions);
  }

  insertStateData(authToken: any, stateData: any): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'  // 
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post<APIResponseModelGrid>(`${this.apiURL}master/insert_state_data`, stateData, requestOptions);
  }

  insertAssessmentData(authToken: any, assessmentData: any): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'  // 
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post<APIResponseModelGrid>(`${this.apiURL}master/insert_assessment_data`, assessmentData, requestOptions);
  }

  deleteMasterData(authToken: any, type: string, serial_number: string)
    : Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    const requestOptions = {
      headers: headers
    };
    return this.http.delete<APIResponseModelGrid>(`${this.apiURL}master/delete_master_data?master_type=${type}&serial_number=${serial_number}`, requestOptions);
  }

  updateMasterData(authToken: any, updateData: any)
    : Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    const requestOptions = {
      headers: headers
    };
    return this.http.put<APIResponseModelGrid>(`${this.apiURL}master/update_master_data`, updateData, requestOptions);
  }



  getSingleIndent(authToken: string, id: string, candidateId: string = ''): Observable<APIResponseModelGrid> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}indent/get_indent_details?indent_id=${id}&candidate_id=${candidateId}`, requestOptions);
  }

  getcollectiondata(authToken: BigIntToLocaleStringOptions): Observable<APIResponseModelGrid> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}getcollections/`, requestOptions);
  }

  getRecommCandidate(authToken: string, id: string): Observable<APIResponseModel> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}candidate/recommended_candidates?skip=0&limit=10`, requestOptions);
  }


  getAllCategory(authToken: string): Observable<category> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<category>(`${this.apiURL}master/get_category?skip=0&limit=10`, requestOptions);
  }


  getIndentType(authToken: string): Observable<Indent_type> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<Indent_type>(`${this.apiURL}master/get_indent_type`, requestOptions);
  }



  getAllCandidate(authToken: string, id: string, limit: string, name: string, mobile: string, education: string, canStage: string, ragTag: string, partnerId: string, location: string, skip: number, canSubstage: string, canSource: string): Observable<APIResponseModelGrid> {
    const project_id = id ?? '';
    const top = limit ?? 10;
    const canname = name ?? '';
    const canmobile = mobile ?? '';
    const caneducation = education ?? '';
    const stage = canStage ?? '';
    const substage = canSubstage ?? '';
    const source = canSource ?? '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}candidate/get_indent_candidate?limit=${top}&indentId=${project_id}&name=${canname}&mobile=${canmobile}&highest_qualification=${caneducation}&stage=${stage}&ragTag=${ragTag}&partner_id=${partnerId}&location=${location}&skip=${skip}&substage=${substage}&source=${source}`, requestOptions);
  }

  getSingleClient(authToken: string, id: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}client/get_client_details/${id}`, requestOptions);
  }

  getSingleCandidate(authToken: string, id: string, indentId: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}candidate/fetch_single_candidate/${id}/${indentId}`, requestOptions);
  }


  getAllProject(authToken: string, limit: string, clientId: string | null | undefined): Observable<Project> {

    const sanitizedClientId = clientId ?? '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<Project>(`${this.apiURL}project/get_all_projects?skip=0&top=10&id=${sanitizedClientId}`, requestOptions);
  }


  updateIndentStatus(authToken: string, indentId: string, status: number): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.put<any>(`${this.apiURL}indent/update_indent_status/${indentId}/${status}`, requestOptions);
  }



  getAllQusetion(authToken: string): Observable<APIResponseModelGrid> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}Question/get_all_clients`, requestOptions);
  }

  getAllAssessment(authToken: string, id: string | null | undefined, title: string, category: string, limit: string = '', skip: number = 0): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}Assessment/get_all_assessment_questions?id=${id}&title=${title}&category=${category}&limit=${limit}&skip=${skip}`, requestOptions);
  }

  getAlleandi(authToken: string, id: string | null | undefined, title: string, category: string, limit: string = '', skip: number = 0): Observable<APIResponseModelGrid> {
    // if(id){
    //   var eand_id = '?id='+id;
    // }else{
    //   var eand_id = '';
    // }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}eandi/get_all_eandi_questions?id=${id}&title=${title}&category=${category}&limit=${limit}&skip=${skip}`, requestOptions);
  }

  getSingleEandi(authToken: string, id: string | null | undefined): Observable<APIResponseModelGrid> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}eandi/get_single_eandiquestion?id=${id}`, requestOptions);
  }



  getSingleAssessment(authToken: string, id: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}Assessment/get_single_assessment/${id}`, requestOptions);
  }

  getAllAssessmentCategory(authToken: string): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}master/assessment_category`, requestOptions);
  }

  getAllAssessmentSingle(authToken: string, assessmentId: string): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}Assessment/get_all_assessment_questions?id=${assessmentId}`, requestOptions);
  }

  getAllMasterData(authToken: string, master: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/master/${master}`, requestOptions);
  }

  getAllLocation(authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/get_location`, requestOptions);
  }


  getAllAssessmentName(authToken: string): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}Assessment/get_all_assessment`, requestOptions);
  }

  checkAssessment(authToken: string, indentId: string, assessmentId: string, candidateId: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}Assessment/check_assessment/${indentId}/${assessmentId}/${candidateId}`, requestOptions);
  }

  checkEandi(authToken: string, indentId: string, enadiId: string, candidateId: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}eandi/check_eandi/${indentId}/${enadiId}/${candidateId}`, requestOptions);
  }

  getCandidateAssessmentScore(authToken: string, candidateId: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}candidate/get_candidate_assessment_score?candidateId=${candidateId}`, requestOptions);
  }


  getCandidateEandi(authToken: string, indentId: string, eandiId: string, candidateId: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}eandi/get_eandi_question/${indentId}/${eandiId}/${candidateId}`, requestOptions);
  }


  getCandidateAssessment(authToken: string, indentId: string, assessmentId: string, candidateId: string): Observable<APIResponseModel> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModel>(`${this.apiURL}Assessment/get_assessment_question/${indentId}/${assessmentId}/${candidateId}`, requestOptions);
  }


  getProfileData(authToken: string, id: string): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}User_router/get_user?id=${id}`, requestOptions);
  }


  getAllUsers(authToken: string, role: string, status: string, limit: string = '', skip: number = 0): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}User_router/get_user?role_text=${role}&status=${status}&excluded_role_id=9`, requestOptions);
  }

  getAllUsers2(authToken: string, id: string): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}User_router/get_user?id=${id}`, requestOptions);
  }


  getAllNotifications(authToken: string): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}notification/get_all_notification`, requestOptions);
  }


  updateUserStatus(authToken: string, id: string, status: number): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.put<any>(`${this.apiURL}User_router/change__status?id=${id}&status=${status}`, requestOptions);
  }


  updateClientStatus(authToken: string, id: string, status: number): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.put<any>(`${this.apiURL}client/update_client_status?client_id=${id}&status=${status}`, requestOptions);
  }


  updatePartnerStatus(authToken: string, id: string, status: number): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.put<any>(`${this.apiURL}partner/update_partner_status?partner_id=${id}&status=${status}`, requestOptions);
  }


  updatePartnerApproveStatus(authToken: string, id: string, approve: boolean): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.put<any>(`${this.apiURL}partner/update_partner_aproval?partner_id=${id}&approve=${approve}`, requestOptions);
  }


  getAllPartner(authToken: string, id: string = '', name: string | null = null, firmName: string | null = null, limit: string = '10', skip: number = 0, approve: string = "", accStatus: string = "", industry: string = "", location: string = "", partnerType: string = ""): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}${constant.apiEndPoint.GETPARTNER}?name=${name}&firmName=${firmName}&id=${id}&limit=${limit}&skip=${skip}&approve=${approve}&accStatus=${accStatus}&industry=${industry}&location=${location}&partnerType=${partnerType}`, requestOptions);
  }

  getSinglePartner(authToken: string, id: string = ''): Observable<APIResponseModelGrid> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}${constant.apiEndPoint.GETSINGLEPARTNER}?id=${id}`, requestOptions);
  }

  getAllRegisterPartner(authToken: string, id: string): Observable<APIResponseModelGrid> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include the headers in the request options
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}${constant.apiEndPoint.GETPARTNER}?id=${id}&skip=0&top=10`, requestOptions);
  }

  getAllPartnerDataDownload(authToken: string, fileType: string) {
    const url = `http://devats.tminetwork.com/partner/partner_data_download?file_type=${fileType}`;
    const headers = { Authorization: `Bearer ${authToken}` }; // Add auth headers if required

    return this.http.get(url, {
      headers,
      responseType: 'blob', // Set response type to blob
      observe: 'response' // Optional: use 'response' to get full HTTPResponse object if needed
    });
  }



  getUserCandidateData(authToken: string, id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}${constant.apiEndPoint.GETUSERCANDIDATE}?userId=${id}`, requestOptions);
  }




  getAllCandidates(authToken: string, name: string = '', mobile: string = '', limit: string = '', education: string = '', gender: string = '', state: string = '', city: string = '', skip: number = 0, indentId: string = '', partnerId: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}candidate/get_all_candidates_new?name=${name}&mobile=${mobile}&skip=0&limit=${limit}&eduction=${education}&gender=${gender}&state=${state}&city=${city}&skip=${skip}&indent_id=${indentId}&partner_id=${partnerId}`, requestOptions);
  }


  getSingleCandidateDetails(authToken: string, id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}candidate/get_candidate_details/${id}`, requestOptions);
  }



  getAppliedIndent(authToken: string, limit: string, category: string, searchQuery: string, searchLocationData: string, clientId: string | null | undefined, timePeriod: string, indentType: string, candidateId: string): Observable<APIResponseModelGrid> {
    const client_id = clientId ?? '';
    const top = limit ?? 10;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}candidate/get_indents_by_candidate_id?skip=0&limit=${top}&candidate_id=${candidateId}&category=${category}&search=${searchQuery}&location=${searchLocationData}&clientId=${client_id}&filterByTime=${timePeriod}&indent_type=${indentType}`, requestOptions);
  }


  getZone(authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/get_zone`, requestOptions);
  }

  getState(authToken: string, zoneId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/get_state?zone_id=${zoneId}`, requestOptions);
  }


  getCity(authToken: string, stateId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/get_city?state_id=${stateId}`, requestOptions);
  }

  getAllProcessData(authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}getprocess`, requestOptions);
  }


  updateTemplateStatus(id: string, status: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiURL}notification/change__status?id=${id}&status=${status}`, {});
  }


  getNamesForZoneIds(authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/get_names_for_zone_id`, requestOptions);
  }

  getNamesForStateIds(authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/get_names_for_state_id`, requestOptions);
  }

  checkDupEntry(authToken: string, type: string, name: string, state: string, zone: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}master/check_dup_entry?type=${type}&name=${name}&state=${state}&zone=${zone}`, requestOptions);
  }


  getAllClientList(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}${constant.apiEndPoint.CLIENTLIST}`, {});
  }

  getAllRecruiterList(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}${constant.apiEndPoint.RECRUITERLIST}`, {});
  }

  getAllPartnerList(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}${constant.apiEndPoint.PARTNERLIST}`, {});
  }


  getAllCandidateCount(authToken: string, id: string, partnerId: string, location: string, stage: string, child_stage_filter: string, source: string): Observable<APIResponseModelGrid> {
    const project_id = id ?? '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<APIResponseModelGrid>(`${this.apiURL}candidate/get_indent_candidates_stage?indent_id=${project_id}&partner_id=${partnerId}&location=${location}&stage=${stage}&child_stage_filter=${child_stage_filter}&source=${source}`, requestOptions);
  }


  getJobCode(shortName: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}${constant.apiEndPoint.GETJOBCODE}?short_name=${shortName}`, {});
  }

  getIndentLocationStatus(indentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}${constant.apiEndPoint.GETLOCATION}?indent_id=${indentId}`, {})
  }

  createMasterObjRoute(authToken: any, masterData: any): Observable<APIResponseModelGrid> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    const requestOptions = {
      headers: headers
    };

    return this.http.post<APIResponseModelGrid>(`${this.apiURL}master/create_master_object`, masterData, requestOptions);
  }

  getAllNotification(authToken: string, id: string, limit: string, skip: number = 0): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}web_notifications/get_notification?id=${id}&limit=${limit}&skip=${skip}`, requestOptions);
  }

  updateNotificationStatus(authToken: string, id: string, status: boolean): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.put<any>(`${this.apiURL}web_notifications/upadate_notification_status?id=${id}&status=${status}`, requestOptions);
  }

  getAllConfigMasterData(master: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}master/configmaster/${master}`, {});
  }

  getNotificationType(authToken: string, type: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}notification/bulk-notifications?type=${type}`, requestOptions);
  }

  getBulkNotificationLog(authToken: string, limit: string, skip: number = 0, search: string = ""): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers: headers
    };
    return this.http.get<any>(`${this.apiURL}notification/log_bulk_notifications?limit=${limit}&skip=${skip}&search=${search}`, requestOptions);
  }

  getSingleIndentDetails(indentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}${constant.apiEndPoint.SINGLEINDENT}?indent_id=${indentId}`, {})
  }

  getLogNotifications(authToken:string,limit:string,skip:number=0,search:string=""): Observable<any>{
    const headers =new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const requestOptions = {
      headers:headers
    };
    return this.http.get<any>(`${this.apiURL}notification/log_notifications?limit=${limit}&skip=${skip}&search=${search}`,requestOptions);
  }


}
