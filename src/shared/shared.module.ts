import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { IconButtonComponent } from "./components/ui/icon-button/icon-button.component";
import { IconComponent } from "./components/ui/icon/icon.component";
import { PopupComponent } from "./components/utils/popup/popup.component";
import { PortalHostComponent } from "./components/utils/portals/components/portal-host/portal-host.component";
import { PortalsControllerDirective } from "./components/utils/portals/directives/portals-controller.directive";
import { SizesObserverComponent } from "./components/utils/sizes-observer/sizes-observer.component";
import { SortableListModule } from "./components/utils/sortable-list/sortable-list.module";
import { TooltipDirective } from "./components/utils/tooltip/tooltip.directive";

import { ThemePrimaryDirective } from "./modules/theme/directives";

@NgModule({
  imports: [
    CommonModule,

    SortableListModule,
    SizesObserverComponent,
    IconComponent,
    IconButtonComponent,

    ThemePrimaryDirective,

    PortalHostComponent,
    PortalsControllerDirective,

    PopupComponent,

    TooltipDirective,
  ],
  exports: [
    SortableListModule,
    SizesObserverComponent,
    IconComponent,
    IconButtonComponent,

    ThemePrimaryDirective,

    PortalHostComponent,
    PortalsControllerDirective,

    PopupComponent,

    TooltipDirective,
  ],
})
export class SharedModule {}
