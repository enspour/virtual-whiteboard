import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
} from "@angular/core";

import { SortableItemComponent } from "../sortable-item/sortable-item.component";
import { SortableListItemsSwap } from "./sortable-list.interface";

@Component({
  selector: "app-sortable-list",
  templateUrl: "./sortable-list.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(dragover)": "handleDragOver($event)",
  },
})
export class SortableListComponent {
  @ContentChildren(SortableItemComponent)
  items!: QueryList<SortableItemComponent>;

  @Output() itemsSwap = new EventEmitter<SortableListItemsSwap>();

  handleDragOver(e: DragEvent) {
    const items = this.items.filter((item) => {
      if (item.isDraggable) {
        return true;
      }

      const { width, height, left, top } =
        item.ref.nativeElement.getBoundingClientRect();

      const offsetLeft = left + window.scrollY;
      const offsetTop = top + window.scrollX;

      if (
        e.clientX > offsetLeft &&
        e.clientX < offsetLeft + width &&
        e.clientY > offsetTop &&
        e.clientY < offsetTop + height
      ) {
        return true;
      }

      return false;
    });

    if (items.length === 2) {
      this.itemsSwap.emit(items.map((item) => item.index) as [number, number]);
    }
  }
}
