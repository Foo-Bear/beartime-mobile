import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import moment from 'moment';
import _ from 'lodash';
import { Block } from './api-service';
/*
  Generated class for the TimeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export interface Countdown {
  number?: number // the class number if there is one
  name?: string // the name otherwise
  start: string //when the class started (hh:mma)
  end: string // same as above
  passing: boolean //if we are before a class
  remainingTime: number // ms before something changes
}
@Injectable()
export class TimeProvider {
  week: Object;
  public countdownStream = new BehaviorSubject({} as Countdown)
  public currentCountdown: Countdown
  private timer: Observable<number>
  constructor() {
    console.log('IT IS NOW TIME FOR YOU TO DIEEEEEEEEEEE');
  }
  /** Sets the week that is used to calculate the current class 
   * @param week The week to load in memory
  */
  setWeek(week: Object) {
    console.log('week set')
    this.week = week
  }
  initTimer() {
    console.log('timer initialized')
    this.timer = Observable.timer(2000,1000);
    this.timer.subscribe(this.getCompositeCountdown);
  }
  /** Gets the countdown and pushes it to the observable */
  getCompositeCountdown() {
    console.log('updating countdown')
    if (!this.week) return
    if (this.currentCountdown.remainingTime && this.currentCountdown.remainingTime > 0) {
      let newCountdown = this.currentCountdown      
      if (this.currentCountdown.passing) {
        newCountdown.remainingTime = moment().diff(moment(newCountdown.start, 'hh:mma'))
      } else {
        newCountdown.remainingTime = moment().diff(moment(newCountdown.end, 'hh:mma'))
      }
      this.currentCountdown = newCountdown
      this.countdownStream.next(this.currentCountdown)
      return
    }
    console.log('not counting down, recalculating')
    let lunch = parseInt(window.localStorage.getItem('lunch:' + moment().format('dddd')))    
    let day: Block[] = _.filter(this.week[moment().format('YYYY-MM-DD')], (item: Block) => {
      return !item.lunch || item.lunch - 1 == lunch
    }) // day is all classes today that the student has
    let nextEndClass = _.find(day, (item) => { 
      moment().isBefore(item.end, 'hh:mma')
    }) // next end is the thing that ends next
    if (!nextEndClass) {
      //School is done
      return
    }
    let isPassing: boolean = moment().isBefore(moment(nextEndClass.start, 'hh:mma'))
    let remainingTime: number // remaining time in ms to the start/end of the next class
    if (isPassing) {
      remainingTime = moment().diff(moment(nextEndClass.start, 'hh:mma'))
    } else { // we are in the middle of a class
      remainingTime = moment().diff(moment(nextEndClass.end, 'hh:mma'))      
    }
    let CompositeCountdown = {
      number: nextEndClass.number,
      name: nextEndClass.name,
      start: nextEndClass.start,
      end: nextEndClass.end,
      passing: isPassing,
      remainingTime: remainingTime
    } as Countdown
    this.currentCountdown = CompositeCountdown
    this.countdownStream.next(this.currentCountdown)
  }

}
