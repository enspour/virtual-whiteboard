import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { IconButtonComponent } from "./components/ui/icon-button/icon-button.component";
import { IconComponent } from "./components/ui/icon/icon.component";
import { SizesObserverComponent } from "./components/utils/sizes-observer/sizes-observer.component";
import { SortableListModule } from "./components/utils/sortable-list/sortable-list.module";

import { ThemePrimaryDirective } from "./modules/theme/directives";

@NgModule({
  imports: [
    CommonModule,

    SortableListModule,
    SizesObserverComponent,
    IconComponent,
    IconButtonComponent,

    ThemePrimaryDirective,
  ],
  exports: [
    SortableListModule,
    SizesObserverComponent,
    IconComponent,
    IconButtonComponent,

    ThemePrimaryDirective,
  ],
})
export class SharedModule {}
