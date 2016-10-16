import { Component, ViewChild, trigger, state, style, transition, animate } from '@angular/core';
import moment from 'moment';
import { APIService, Block } from '../../providers/api-service';
import { TimeProvider } from '../../providers/time-provider';
import { NavController, LoadingController, Slides } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import _ from 'lodash'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [APIService, TimeProvider],
  animations: [
    trigger('lunchState', [
      state('moveUp', style({
        transform: 'translateY(-123px)'
      })),
      state('moveDown', style({
        transform: 'translateY(123px)'
      })),
      state('static', style({
        transform: 'translateY(0)'
      })),
      transition('* => moveUp', animate('200ms ease')),
      transition('* => moveDown', animate('200ms ease')),
      transition('* => static', animate('0ms linear'))
    ]),
    trigger('lunchClassState', [
      state('moveUp', style({
        transform: 'translateY(-97px)'
      })),
      state('moveDown', style({
        transform: 'translateY(97px)'
      })),
      state('static', style({
        transform: 'translateY(0)'
      })),
      transition('* => moveUp', animate('200ms ease')),
      transition('* => moveDown', animate('200ms ease')),
      transition('* => static', animate('0ms linear'))
    ])
  ]
})
/** 
 * TODO: current class/remaining time/passing time.
 * TODO: better IOS theming? Softer accent colors
 * TODO: go to current day in slides (should be easy)
*/

/**
 * Returns the HomePage
 */
export class HomePage {
  userSchedule: Object = {}; //This is a filtered version for lunches.
  userScheduleKeys: string[] = []; // we need the keys to iterate.
  lunch: Object = {};
  lunchMoveState: string = 'static'
  lunchClassMoveState: string = 'static'
  private Oldcolors: string[] = ['#3F51B5', '#1976D2', '#039BE5', '#00BCD4', '#009688', '#43A047', '#7CB342'] // DELETE
  private colors: string[] = ['#344395', '#1561AC', '#037FBC', '#009AAE', '#007B70', '#37833B', '#669337']
  @ViewChild('mySlider') slider: Slides;

  constructor(public navCtrl: NavController, api: APIService, public loadingCtrl: LoadingController, time: TimeProvider) {
    //define our loader and present it.
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    })
    loader.present()
    //get data from the service and process it
    api.getWeek().subscribe(data => {
      time.setWeek(data)
      this.userSchedule = this.retrieveCustomNames(data);
      this.userScheduleKeys = Object.keys(this.userSchedule)
      this.initLunchObject(this.userScheduleKeys)
      loader.dismissAll()
    })

  }
  /** Gets all the custom class names and returns the input week with them injected 
   * @param schedule a week object to inject into.
  */
  retrieveCustomNames(schedule: Object): Object {
    if (!schedule) {
      return
    }
    // first we load up all the custom classes and store them in an array
    let classNameArray: string[] = [];
    for (let blockNumber of _.range(1, 8)) {
      classNameArray.push(window.localStorage.getItem(`class:${blockNumber}`))
    }
    // now we iterate over every block and add the userName property.
    for (let day in schedule) {
      for (let block of schedule[day]) {
        if (block.number) {
          block.userName = classNameArray[parseInt(block.number) - 1]
        }
      }
    }
    return schedule
  }

  /** Initialize the lunch object with the stored data 
   * @param days A set of strings in an array, YYYY-MM-DD
  */
  initLunchObject(days: string[]) {
    if (!days) {
      return
    }
    for (let day of days) {
      //day is a string YYYY mm dddd
      this.lunch[day] = window.localStorage.getItem('lunch:' + moment(day, 'YYYY-MM-DD').format('dddd')) || 0
    }
  }
  /** Change the lunch setting for a specific day. 
   * @param day The day to which the block belongs. YYYY-MM-DD
  */
  updateLunch(day: string) {
    console.log(day)
    let dayOfTheWeek = moment(day, 'YYYY-MM-DD').format('dddd')
    let lunchDirection: string = 'static'
    let lunchClassDirection: string = 'static'
    if (this.lunch[day] == 0) {
      //Lunch is first so it needs to go down
      lunchDirection = 'moveDown'
      //Class is second so it goes up
      lunchClassDirection = 'moveUp'
    } else {
      lunchDirection = 'moveUp'
      lunchClassDirection = 'moveDown'
    }
    this.lunchMoveState = lunchDirection
    this.lunchClassMoveState = lunchClassDirection
    setTimeout(() => {
      this.lunch[day] = 1 - this.lunch[day] //neat little toggler
      window.localStorage.setItem(`lunch:${dayOfTheWeek}`, (1 - this.lunch[day]).toString())
      this.lunchMoveState = 'static'
      this.lunchClassMoveState = 'static'
    }, 200)
  }

  /** Change the stored name for a class 
   * @param number The block number of the class that will be changed.
   * @param name The new name of the class to be stored.
  */
  updateName(number: number, name: string) {
    window.localStorage.setItem(`class:${number}`, name);
    this.userSchedule = this.retrieveCustomNames(this.userSchedule)
  }
  //Push the settings page onto the current stack.
  goToSettings() {
    this.navCtrl.push(SettingsPage)
  }

}
