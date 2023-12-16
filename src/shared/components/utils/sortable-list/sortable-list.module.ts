import { NgModule } from "@angular/core";

import { SortableItemComponent } from "./components/sortable-item/sortable-item.component";
import { SortableListComponent } from "./components/sortable-list/sortable-list.component";

@NgModule({
  imports: [SortableListComponent, SortableItemComponent],
  exports: [SortableListComponent, SortableItemComponent],
})
export class SortableListModule {}
