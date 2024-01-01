import {
  Component,
  ElementRef,
  Inject,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { nanoid } from "nanoid";

import {
  Portal,
  PortalsController,
  portalsControllerToken,
} from "@shared/components/utils/portals";

import { AppService } from "@shared/modules/app/services/app.service";

@Component({
  selector: "app-popup",
  templateUrl: "./popup.component.html",
  styleUrl: "./popup.component.scss",
  standalone: true,
})
export class PopupComponent {
  @ViewChild("template") templateRef!: TemplateRef<object>;
  @ViewChild("content") contentRef!: ElementRef<HTMLDivElement>;

  private isOpen = false;

  private portal?: Portal;

  private gap = 10;

  constructor(
    @Inject(portalsControllerToken)
    private portalsController: PortalsController,

    private elementRef: ElementRef<HTMLElement>,
    private appService: AppService
  ) {
    this.appService.mousedown$
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.clickOutside(event));

    this.appService.sizes$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.isOpen && this.setContentPosition());
  }

  public open() {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    this.portal = {
      id: nanoid(6),
      type: "template",
      templateRef: this.templateRef,
    };

    this.portalsController.openPortal("popups", this.portal);

    setTimeout(this.setContentPosition.bind(this), 10);
  }

  public close() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;

    this.portalsController.closePortal("popups", this.portal!);
  }

  public toggle() {
    if (!this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  private clickOutside(event: MouseEvent) {
    if (!this.isOpen) {
      return;
    }

    const target = event.target as HTMLElement;

    const element = this.elementRef.nativeElement;
    const content = this.contentRef.nativeElement;

    if (!element.contains(target) && !content.contains(target)) {
      this.close();
    }
  }

  private setContentPosition() {
    const element = this.elementRef.nativeElement;
    const content = this.contentRef.nativeElement;

    const elementRect = element.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    const sizes = this.appService.Sizes;

    content.style.left = elementRect.x + "px";

    const totalHeight =
      elementRect.y + elementRect.height + contentRect.height + 2 * this.gap;

    if (sizes.height > totalHeight) {
      content.style.top = elementRect.y + elementRect.height + this.gap + "px";
    } else {
      content.style.top = elementRect.y - contentRect.height - this.gap + "px";
    }

    content.style.visibility = "visible";
  }
}
