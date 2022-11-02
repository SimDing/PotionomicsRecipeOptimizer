import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const TICK_INTERVAL_MS = 25;
const LONG_TICK_INTERVAL_MS = 500;

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
      this.currentTime = new Date().getTime();
      const newTime = new Date().getTime();

      while (this.started && this.currentTime < TICK_INTERVAL_MS + newTime) {
        this.tickSubject.next(true);
        this.currentTime = new Date().getTime();
      }
    }, TICK_INTERVAL_MS
    )
  }
}
