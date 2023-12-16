import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

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
export class ToolkitComponent {
  public icons = TOOL_ICONS;

  public toolkit$ = this.toolkitService.toolkit$;
  public selectedTool$ = this.toolkitService.selectedTool$;

  constructor(private toolkitService: ToolkitService) {}

  handleToolClick(name: Tool["name"]) {
    this.toolkitService.setSelectedTool(name);
  }

  handleSwapItems(indexes: SortableListItemsSwap) {
    this.toolkitService.swapToolkit(indexes);
  }
}
