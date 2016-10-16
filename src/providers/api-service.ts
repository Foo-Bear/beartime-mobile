import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the APIService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
// TODO: better class binding
export class Block {
  number?: number;
  name?: string;
  lunch?: number;
  start: string;
  end: string;
  duration: number;
  userName: string;
}
export interface Day {
  [index: number]: Block
}
export interface Week {
  [index: string]: Array<Block>
}
/**
 * An API interface for the beartime backend.
 * it deals in promises and has various calls
 */
@Injectable()

export class APIService {
  constructor(public http: Http) {
    console.log('Hello from the APIIIIIIIIIIII');
  }
  data: Week;
  //TODO: use observables better
  /** Gets the current week and returns a promise */
  getWeek():Observable<Week> {
    //TODO: better refresh calling (figure out when to grab)
    return this.http.get('http://beartime.blakeschool.org/api/week')
      .map(res => res.json())
  }
}
