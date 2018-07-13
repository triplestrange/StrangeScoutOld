import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PitData } from '../pit-data';
import * as $ from 'jquery';

@Component({
  selector: 'app-pit-form',
  templateUrl: './pit-form.component.html',
  styleUrls: ['./pit-form.component.css']
})
export class PitFormComponent implements OnInit {

  startPos = [];
  mechanisms = [];

  // ngModel for match data
  pitModel = new PitData('', '', '', '', 'unknown', '', false, false, false, false, false, false, false, false, false, false, false, false, false, '', '');

  // convert model to JSON string
  get pitPayload() {
    // get timestamp
    var dt = new Date();
    var year = dt.getUTCFullYear();
    var month = dt.getUTCMonth() + 1;
    var day = dt.getUTCDate();
    var hour = dt.getUTCHours();
    var minute = dt.getUTCMinutes();
    var second = dt.getUTCSeconds();
    this.pitModel.Timestamp = String(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
    // return JSON string
    // NOTE: Converting TeamNumber string to int automatically for some reason?
    //       Could potentially break things later
    return JSON.stringify(this.pitModel);
  }

  // define change event
  changeEvent = new Event('change');

  // submit function
  onSubmit() {
    var xhr = new XMLHttpRequest();

    // POST to /api/submitmatch asynchronously
    xhr.open("POST", '/api/submitpit', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "text/plain");

    xhr.onreadystatechange = function() {
      //Call a function when the state changes.
      if (xhr.readyState == XMLHttpRequest.DONE && (xhr.status <= 299 || xhr.status == 409)) {
        // Clear form. Data is either recorded or duplicate.
        (<HTMLFormElement>document.getElementById("matchForm")).reset();
        alert(`Message from server: ${xhr.status} ${xhr.statusText} -- ${xhr.responseText}`);
      } else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 300) {
        // Don't clear form. 
        alert(`Message from server: ${xhr.status} ${xhr.statusText} -- ${xhr.responseText}`);
      }
    }
    // send POST request
    xhr.send(this.pitPayload);
    // debugging alerts
    //		alert(this.pitPayload);
    //		alert(xhr.responseText);
  }

  plusbutton(id: string) {
    // increase a specific element by 1 and trigger a change event for it
    (<HTMLInputElement>document.getElementById(id)).stepUp();
    (<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
  }

  minusbutton(id: string) {
    // decrease a specific element by 1 and trigger a change event for it
    (<HTMLInputElement>document.getElementById(id)).stepDown();
    (<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
  }

  constructor() { }
  ngOnInit() { }
}
