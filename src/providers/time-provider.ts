import { Injectable, Output } from '@angular/core';
import 'rxjs/add/operator/map';
import moment from 'moment';
import _ from 'lodash';
import { Block } from './api-service';
/*
  Generated class for the TimeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TimeProvider {
  @Output()
  week: Object;
  currentClass: Block;
  constructor() {
    console.log('IT IS NOW TIME FOR YOU TO DIEEEEEEEEEEE');
  }
  /** Sets the week that is used to calculate the current class 
   * @param week The week to load in memory
  */
  setWeek(week: Object) {
    this.week = week
  }
  /** Gets the current class and returns it */
  getCurrentClass(): Block {
    let day: Block[] = this.week[moment().format('YYYY-MM-DD')]
    let lunch = parseInt(window.localStorage.getItem('lunch:' + moment().format('dddd')))
    let currentClass = _.find(day, item => {
      if (!item.lunch || item.lunch - 1 == lunch) {
        return moment().isBetween(item.start, item.end)
      }
    })
    this.currentClass = currentClass
    return currentClass
  }
  /** Returns the remaning time until the given block is over.
   *  @param block A block that will be compared to.
   */
  getRemainingTime(block: Block) {
    let endtime = moment(block.end, 'hh:mma')
    let diff = moment().diff(endtime)
    return diff
  }

}
