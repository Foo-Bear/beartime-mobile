import { Component } from '@angular/core';
import moment from 'moment';
import { APIService, Block } from '../../providers/api-service';
import { NavController, LoadingController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import _ from 'lodash'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [APIService]
})
/* TODO: refactor for weeklong view*/

export class HomePage {
  userSchedule: Object = {}; //This is a filtered version for lunches.
  userScheduleKeys: string[] = []; // we need the keys to iterate.
  lunch: Object = {};
  //TODO: multilunch.

  constructor(public navCtrl: NavController, api: APIService, public loadingCtrl: LoadingController) {
    //define our loader and present it.
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    })
    loader.present()
    //get data from the service and process it
    api.getWeek().then(data => {
      this.userSchedule = this.retrieveCustomNames(data);
      this.userScheduleKeys = Object.keys(this.userSchedule)
      this.initLunchObject(this.userScheduleKeys)
      loader.dismissAll()
    })
    
  }
  // Get custom class names for everything.
  retrieveCustomNames(schedule: Object):Object {
    if (!schedule) {
      return
    }
    //first we load up all the custom classes and store them in an array
    let classNameArray: string[] = [];
    for (let blockNumber of _.range(1,8)) {
      classNameArray.push(window.localStorage.getItem(`class:${blockNumber}`))
    }
    //now we iterate over every block and add the userName property.
    for (let day in schedule) {
      // we have an array day
      for (let block of schedule[day]) {
        if (block.number) {
          block.userName = classNameArray[parseInt(block.number) - 1]
        }
      }
    }
    return schedule
  }
  //Load up initial lunch state
  initLunchObject(days: string[]) {
    if (!days) {
      return
    }
    for (let day of days) {
      //day is a string YYYY mm dd
      this.lunch[day] = window.localStorage.getItem('lunch:' + moment(day, 'YYYY-MM-DD').format('dddd')) || 0
    }
  }
  //Toggle lunch to a different state and store it.
  updateLunch(name: string, day: string) {
    if (name == "Lunch") {
      let dayOfTheWeek = moment(day, 'YYYY-MM-DD').format('dddd')
      window.localStorage.setItem(`lunch:${dayOfTheWeek}`, (1 - this.lunch[dayOfTheWeek]).toString())
      this.lunch[dayOfTheWeek] = 1 - this.lunch[dayOfTheWeek] //neat little toggler
    }
  }


  //change a class name
  updateName(number: number, name: string) {
    window.localStorage.setItem(`class:${number}`, name);
    this.userSchedule = this.retrieveCustomNames(db)
  }
  //Push the settings page onto the current stack.
  goToSettings() {
    this.navCtrl.push(SettingsPage)
  }
  //TODO: animate things.
}
