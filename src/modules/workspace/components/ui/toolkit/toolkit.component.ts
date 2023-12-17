import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  inject,
} from "@angular/core";

import { takeUntil } from "rxjs";

import { SharedModule } from "@shared/shared.module";

import { SortableListItemsSwap } from "@shared/components/utils/sortable-list";

import { DestroyService } from "@workspace/services/destroy.service";
import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";

import { Tool } from "modules/workspace/interfaces";

import { TOOL_ICONS } from "@workspace/constants";

import { ThemePalette, ThemePaletteToken } from "@theme";

@Component({
  selector: "app-toolkit",
  templateUrl: "./toolkit.component.html",
  styleUrl: "./toolkit.component.scss",
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolkitComponent implements OnInit {
  public icons = TOOL_ICONS;

  public toolkit$ = this.toolkitService.toolkit$;
  public selectedTool$ = this.toolkitService.selectedTool$;

  public disabled = false;

  private destroy$ = inject(DestroyService);

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private toolkitService: ToolkitService
  ) {
    const bg = `var(--theme-${palette}-bg)`;
    const bgHover = `var(--theme-${palette}-bg--hover)`;

    this.elementRef.nativeElement.style.setProperty("--bg", bg);
    this.elementRef.nativeElement.style.setProperty("--bg--hover", bgHover);
  }

  ngOnInit(): void {
    this.toolkitService.executedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => {
        this.disabled = !!tool;
        this.cdRef.detectChanges();
      });
  }

  handleToolClick(name: Tool["name"]) {
    this.toolkitService.setSelectedTool(name);
  }

  handleSwapItems(indexes: SortableListItemsSwap) {
    this.toolkitService.swapToolkit(indexes);
  }
}
