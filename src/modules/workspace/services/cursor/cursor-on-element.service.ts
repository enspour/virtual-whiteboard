import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { Element } from "@workspace/interfaces";

@Injectable()
export class CursorOnElementService {
  private element = new BehaviorSubject<Element | null>(null);
  public element$ = this.element.asObservable();

  get Element() {
    return this.element.value;
  }

  public setElement(element: Element | null) {
    this.element.next(element);
  }
}
