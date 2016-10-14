import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the APIService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export interface Block {
  number?: number,
  name?: string,
  lunch?: number,
  start: string,
  end: string,
  duration: number,
  userName: string
}

export interface Week {
  [index: string]: Array<Block>
}
@Injectable()
export class APIService {
  public schedule:{
    number?: number,
    name?: string,
    lunch?: number,
    start: string,
    end: string,
    duration: number,
  }[]
  constructor(public http: Http) {
    console.log('Hello from the API Service');
  }
  data: Week;
  //TODO: use observables?
  getWeek() {
    //TODO: better refresh calling (figure out when to grab)
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get('http://beartime.blakeschool.org/api/week')
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
          this.data = data;
          resolve(this.data);
        });
      });
  }
}
