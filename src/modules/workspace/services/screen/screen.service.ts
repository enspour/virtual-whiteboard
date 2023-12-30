import { Inject, Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import {
  Point,
  ScreenScale,
  ScreenScroll,
  ScreenSizes,
  ScreenStorage,
} from "@workspace/interfaces";

import {
  SCREEN_SCALING_DELTA,
  SCREEN_SCALING_MAX,
  SCREEN_SCALING_MIN,
  SCREEN_SCROLLING_DELTA,
} from "@workspace/constants";

import { ScreenStorageToken } from "@workspace/tokens";

@Injectable()
export class ScreenService {
  private sizes: BehaviorSubject<ScreenSizes>;
  public sizes$: Observable<ScreenSizes>;

  private scroll: BehaviorSubject<ScreenScroll>;
  public scroll$: Observable<ScreenScroll>;

  private scale: BehaviorSubject<ScreenScale>;
  public scale$: Observable<ScreenScale>;

  constructor(
    @Inject(ScreenStorageToken) private screenStorage: ScreenStorage
  ) {
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

  async restore() {
    const { scroll, scale } = await this.screenStorage.restore();

    this.scroll.next(scroll);
    this.scale.next(scale);
  }

  public async setSizes(sizes: ScreenSizes) {
    this.sizes.next(sizes);
  }

  public async setScale(scale: ScreenScale) {
    this.scale.next(scale);
    this.screenStorage.setScale(scale);
  }

  public async setScroll(scroll: ScreenScroll) {
    this.scroll.next(scroll);
    this.screenStorage.setScroll(scroll);
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
    const direction = 1;
    const scale = this.Scale;

    const nextScale = scale + direction * SCREEN_SCALING_DELTA;

    return this.scaling(nextScale, direction, mousePosition);
  }

  public scaleOut(mousePosition: Point) {
    const direction = -1;
    const scale = this.Scale;

    const nextScale = scale + direction * SCREEN_SCALING_DELTA;

    return this.scaling(nextScale, direction, mousePosition);
  }

  public scaleTo(nextScale: number) {
    const sizes = this.Sizes;
    const scale = this.Scale;

    const mousePosition = {
      x: sizes.width / 2,
      y: sizes.height / 2,
    };

    if (scale > nextScale) {
      const direction = -1;
      return this.scaling(nextScale, direction, mousePosition);
    } else {
      const direction = 1;
      return this.scaling(nextScale, direction, mousePosition);
    }
  }

  private scaling(nextScale: number, direction: 1 | -1, mousePosition: Point) {
    const scroll = this.Scroll;
    const sizes = this.Sizes;
    const scale = this.Scale;

    if (SCREEN_SCALING_MIN > nextScale) {
      nextScale = SCREEN_SCALING_MIN;
    }

    if (SCREEN_SCALING_MAX < nextScale) {
      nextScale = SCREEN_SCALING_MAX;
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
