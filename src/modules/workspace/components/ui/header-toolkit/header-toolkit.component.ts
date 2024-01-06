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

import { SharedModule, ThemePalette, ThemePaletteToken } from "@shared";
import { SortableListItemsSwap } from "@shared/components/utils/sortable-list";

import { DestroyService, ToolsService } from "@workspace/services";

import { SelectableTool } from "@workspace/interfaces";

import { TOOL_ICONS, TOOL_TIP } from "@workspace/constants";

@Component({
  selector: "app-header-toolkit",
  templateUrl: "./header-toolkit.component.html",
  styleUrl: "./header-toolkit.component.scss",
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderToolkitComponent implements OnInit {
  public icons = TOOL_ICONS;
  public tips = TOOL_TIP;

  public toolkit$ = this.toolsService.toolkit$;
  public selectedTool$ = this.toolsService.selectedTool$;

  public disabled = false;

  private destroy$ = inject(DestroyService);

  constructor(
    @Inject(ThemePaletteToken) palette: ThemePalette,
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private toolsService: ToolsService
  ) {
    const bg = `var(--theme-${palette}-bg)`;
    const bgHover = `var(--theme-${palette}-bg--hover)`;

    this.elementRef.nativeElement.style.setProperty("--bg", bg);
    this.elementRef.nativeElement.style.setProperty("--bg--hover", bgHover);
  }

  ngOnInit(): void {
    this.toolsService.executedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => {
        this.disabled = !!tool;
        this.cdRef.detectChanges();
      });
  }

  handleToolClick(name: SelectableTool["name"]) {
    this.toolsService.setSelectedTool(name);
  }

  handleSwapItems(indexes: SortableListItemsSwap) {
    this.toolsService.swapToolkit(indexes);
  }
}
