import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from "./token-storage.service";

export class RequestData {
  constructor(
    public data: any,
    public token?: string) { }
}


@Injectable({
  providedIn: 'root'
})


export class ApiService {
  private sendData: RequestData = new RequestData({}, "");


  constructor(
    private http: HttpClient,
    private jwtService: TokenStorageService
  ) { }


  makePostRequest(method: string, params: any) {
    return new Promise((resolve, reject) => {
      const jwToken = this.jwtService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        Authorization: `Bearer ${jwToken}`,
        "Content-Type": "application/json",
        "source": "app"
      });

      params = params || {};
      this.sendData.data = params;

      this.http
        .post(environment.api_url + method, JSON.stringify(this.sendData), { headers: httpHeaders })

        .subscribe({
          next: (data: any) => {
            if (data) {
              resolve(data.response);
            }
          },
          error: err => {
            if (err.status == 400) {
              resolve(err.error.response);
            }
            else if (err.status == 401) {
              resolve(err);
              window.location.href = "/login";
            }
            else if (err.status == 403) {
              resolve(err);
              window.location.href = "/access-denied";
            } else if ((err.status == 500 || err.status == 501)) {
              this.errorLog(err);
              resolve({ error: true, msg: 'Internal Server Error' });
            }
            else if (err.status == 503) {
              this.errorLog(err);
              resolve({ error: true, msg: 'Server Maintenance error' });
            }
            else if (err.status) {
              this.errorLog(err);
              resolve({ error: true, msg: 'Unexpected Error' });
            } else if (err.detail == 'Not Found') {
              this.errorLog(err);
              resolve({ error: true, msg: "API doesn't exist." })
            } else {
              this.errorLog(err);
              resolve({ error: true, msg: 'You failed to hit api correctly', status: 400 });
            }
          }
        })
    });
  }


  errorLog(data: any) {
    console.error(data);
  }

}
