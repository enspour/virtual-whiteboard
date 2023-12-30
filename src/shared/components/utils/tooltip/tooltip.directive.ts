import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  Input,
} from "@angular/core";

import {
  Portal,
  PortalsController,
  portalsControllerToken,
} from "@shared/components/utils/portals";

import { TooltipComponent } from "./tooltip.component";

@Directive({
  selector: "[appTooltip]",
  standalone: true,
})
export class TooltipDirective {
  @Input({ required: true }) appTooltip!: string;

  private portal: Portal | null = null;

  constructor(
    @Inject(portalsControllerToken)
    private portalsController: PortalsController,

    private elementRef: ElementRef<HTMLElement>,
    private injector: Injector
  ) {}

  @HostListener("mouseenter")
  show() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.portal = {
      type: "component",
      componentType: TooltipComponent,
      componentInputs: { tooltip: this.appTooltip, rect },
      componentInjector: this.injector,
    };

    this.portalsController.openPortal("tooltips", this.portal);
  }

  @HostListener("mouseleave")
  hide() {
    if (this.portal) {
      this.portalsController.closePortal("tooltips", this.portal);
    }
  }
}
