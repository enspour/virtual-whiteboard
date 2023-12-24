import {
  Component,
  ElementRef,
  Inject,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import {
  Portal,
  PortalsController,
  portalsControllerToken,
} from "@shared/components/utils/portals";

import { AppService } from "@shared/modules/app/services/app.service";

@Component({
  selector: "app-popup",
  templateUrl: "./popup.component.html",
  standalone: true,
})
export class PopupComponent {
  @ViewChild("template") templateRef!: TemplateRef<object>;
  @ViewChild("content") contentRef!: ElementRef<HTMLDivElement>;

  private isOpen = false;
  private portal?: Portal;

  constructor(
    @Inject(portalsControllerToken)
    private portalsController: PortalsController,

    private elementRef: ElementRef<HTMLElement>,
    private appService: AppService
  ) {
    this.appService.mousedown$
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.clickOutside(event));
  }

  public open(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.portal = {
      templateRef: this.templateRef,
      x: rect.x,
      y: rect.y + rect.height,
    };

    this.portalsController.openPortal("popups", this.portal);
  }

  public close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;

    this.portalsController.closePortal("popups", this.portal!);
  }

  public toggle(): void {
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
}
