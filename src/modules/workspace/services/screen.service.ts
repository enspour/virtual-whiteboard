import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import {
  Point,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
  WheelDirection,
} from "@workspace/interfaces";

import {
  SCREEN_SCALING_DELTA,
  SCREEN_SCALING_MAX,
  SCREEN_SCALING_MIN,
  SCREEN_SCROLLING_DELTA,
} from "@workspace/constants";

@Injectable()
export class ScreenService {
  private sizes: BehaviorSubject<ScreenSizes>;
  public sizes$: Observable<ScreenSizes>;

  private scroll: BehaviorSubject<ScreenScroll>;
  public scroll$: Observable<ScreenScroll>;

  private scale: BehaviorSubject<ScreenScale>;
  public scale$: Observable<ScreenScale>;

  constructor() {
    const sizes = {
      width: 0,
      height: 0,
    };

    this.sizes = new BehaviorSubject(sizes);
    this.sizes$ = this.sizes.asObservable();

    const scroll = {
      x: 0,
      y: 0,
    };

    this.scroll = new BehaviorSubject(scroll);
    this.scroll$ = this.scroll.asObservable();

    this.scale = new BehaviorSubject(1);
    this.scale$ = this.scale.asObservable();
  }

  get Scroll() {
    return this.scroll.getValue();
  }

  get Scale() {
    return this.scale.getValue();
  }

  get Sizes() {
    return this.sizes.getValue();
  }

  public async setSizes(sizes: ScreenSizes) {
    this.sizes.next(sizes);
  }

  public async setScale(scale: ScreenScale) {
    this.scale.next(scale);
  }

  public async setScroll(scroll: ScreenScroll) {
    this.scroll.next(scroll);
  }

  public scrollLeft() {
    const scroll = this.Scroll;
    const scale = this.Scale;

    this.setScroll({
      ...scroll,
      x: scroll.x + SCREEN_SCROLLING_DELTA / scale,
    });
  }

  public scrollRight() {
    const scroll = this.Scroll;
    const scale = this.Scale;

    this.setScroll({
      ...scroll,
      x: scroll.x - SCREEN_SCROLLING_DELTA / scale,
    });
  }

  public scrollUp() {
    const scroll = this.Scroll;
    const scale = this.Scale;

    this.setScroll({
      ...scroll,
      y: scroll.y + SCREEN_SCROLLING_DELTA / scale,
    });
  }

  public scrollDown() {
    const scroll = this.Scroll;
    const scale = this.Scale;

    this.setScroll({
      ...scroll,
      y: scroll.y - SCREEN_SCROLLING_DELTA / scale,
    });
  }

  public scaleIn(mousePosition: Point) {
    return this.scaling("forward", mousePosition);
  }

  public scaleOut(mousePosition: Point) {
    return this.scaling("back", mousePosition);
  }

  private scaling(wheelDirection: WheelDirection, mousePosition: Point) {
    const scroll = this.Scroll;
    const sizes = this.Sizes;
    const scale = this.Scale;

    const direction = (() => {
      switch (wheelDirection) {
        case "forward":
          return 1;
        case "back":
          return -1;
      }
    })();

    const nextScale = scale + direction * SCREEN_SCALING_DELTA;

    if (SCREEN_SCALING_MIN > nextScale || nextScale > SCREEN_SCALING_MAX) {
      return;
    }

    const width = (sizes.width * scale) / nextScale;
    const height = (sizes.height * scale) / nextScale;

    const diff = {
      width: Math.abs(sizes.width - width),
      height: Math.abs(sizes.height - height),
    };

    const ratioX = mousePosition.x / scale / sizes.width;
    const ratioY = mousePosition.y / scale / sizes.height;

    this.setScroll({
      x: scroll.x - direction * diff.width * ratioX,
      y: scroll.y - direction * diff.height * ratioY,
    });

    this.setScale(nextScale);
  }
}
