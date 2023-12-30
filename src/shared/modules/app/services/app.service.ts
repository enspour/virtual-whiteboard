import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, Subject } from "rxjs";

import { AppSizes } from "../interfaces";

@Injectable()
export class AppService {
  private sizes: BehaviorSubject<AppSizes>;
  public sizes$: Observable<AppSizes>;

  private mousedown = new Subject<MouseEvent>();
  public mousedown$ = this.mousedown.asObservable();

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

  public async setSizes(sizes: AppSizes) {
    this.sizes.next(sizes);
  }

  public emitMouseDown(event: MouseEvent) {
    this.mousedown.next(event);
  }
}
