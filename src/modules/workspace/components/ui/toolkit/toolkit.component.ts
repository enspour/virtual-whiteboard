import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";

import { Subject, takeUntil } from "rxjs";

import { SharedModule } from "@shared/shared.module";

import { SortableListItemsSwap } from "@shared/components/utils/sortable-list";

import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";

import { Tool } from "modules/workspace/interfaces";

import { TOOL_ICONS } from "@workspace/constants";

@Component({
  selector: "app-toolkit",
  templateUrl: "./toolkit.component.html",
  styleUrl: "./toolkit.component.scss",
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolkitComponent implements OnInit, OnDestroy {
  public icons = TOOL_ICONS;

  public toolkit?: Tool[];
  public selectedTool?: Tool;

  private destroy$ = new Subject<void>();

  constructor(private toolkitService: ToolkitService) {}

  ngOnInit(): void {
    this.toolkitService.toolkit$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toolkit) => (this.toolkit = toolkit));

    this.toolkitService.selectedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedTool) => (this.selectedTool = selectedTool));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleToolClick(name: Tool["name"]) {
    this.toolkitService.setSelectedTool(name);
  }

  handleSwapItems(indexes: SortableListItemsSwap) {
    this.toolkitService.swapToolkit(indexes);
  }
}
