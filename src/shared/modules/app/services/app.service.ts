import { Injectable } from "@angular/core";

import { Subject } from "rxjs";

@Injectable()
export class AppService {
  private mousedown = new Subject<MouseEvent>();
  public mousedown$ = this.mousedown.asObservable();

  public emitMouseDown(event: MouseEvent) {
    this.mousedown.next(event);
  }
}
