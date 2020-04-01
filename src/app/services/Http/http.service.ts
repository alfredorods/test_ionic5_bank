import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from "rxjs"
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {Router, ActivatedRoute} from "@angular/router";
@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(private router:Router, public httpClient: HttpClient) { }

  getHttp(url_parameter: string){
    
    let promise = new Promise((resolve, reject) => {
      this.httpClient.get(url_parameter)
      .subscribe(response => {
          console.log(response);
          resolve({data: response});
      })
    });

    return <any>promise;
  }

}
