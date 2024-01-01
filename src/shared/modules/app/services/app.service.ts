import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, Subject } from "rxjs";

import { AppSizes } from "../interfaces";

@Injectable()
export class AppService {
  private sizes: BehaviorSubject<AppSizes>;
  public sizes$: Observable<AppSizes>;

  private mousedown = new Subject<MouseEvent>();
  public mousedown$ = this.mousedown.asObservable();

  private undo = new Subject<Event>();
  public undo$ = this.undo.asObservable();

  private redo = new Subject<Event>();
  public redo$ = this.redo.asObservable();

  private escape = new Subject<Event>();
  public escape$ = this.escape.asObservable();

  constructor() {
    const sizes = {
      width: 0,
      height: 0,
    };

    this.sizes = new BehaviorSubject(sizes);
    this.sizes$ = this.sizes.asObservable();
  }

  get Sizes() {
    return this.sizes.value;
  }

  public setSizes(sizes: AppSizes) {
    this.sizes.next(sizes);
  }

  public emitMouseDown(event: MouseEvent) {
    this.mousedown.next(event);
  }

  public emitUndo(event: Event) {
    this.undo.next(event);
  }

  public emitRedo(event: Event) {
    this.redo.next(event);
  }

  public emitEscape(event: Event) {
    this.escape.next(event);
  }
}
