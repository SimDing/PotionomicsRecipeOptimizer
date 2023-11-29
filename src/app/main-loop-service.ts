import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


const TICK_INTERVAL_MS = 25;
const LONG_TICK_INTERVAL_MS = 500;

/**
 * This is the main loop to allow for pausing and visual updates instead of an infinite loop showing nothing until full completion.
 */
@Injectable({
  providedIn: 'root'
})
export class MainLoopService {

  tickSubject = new Subject<boolean>();
  longTickSubject = new Subject<boolean>();
  refreshTime = new Date().getTime();
  currentTime = new Date().getTime();
  started = false;

  start(){

    window.setInterval(() => {
      this.longTickSubject.next(true);
    }, LONG_TICK_INTERVAL_MS);

    window.setInterval(()=> {
      const newTime = new Date().getTime();
      this.currentTime = newTime;

      // If it's started and the loop has been going for less than the tick interval (currently 25ms), keep going.
      while (this.started && this.currentTime < TICK_INTERVAL_MS + newTime) {
        this.tickSubject.next(true);
        this.currentTime = new Date().getTime();
      }
    }, TICK_INTERVAL_MS
    )
  }
}
