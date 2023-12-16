import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";

import { Tool, ToolCursorName } from "@workspace/interfaces";

import { TOOL_CURSOR } from "@workspace/constants";

import { CanvasComponent } from "../canvas/canvas.component";

@Component({
  selector: "app-canvas-cursor",
  templateUrl: "./canvas-cursor.component.html",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasCursorComponent implements OnInit {
  @Input({ required: true }) canvas!: CanvasComponent;

  private selectedTool!: Tool;

  constructor(private toolkitService: ToolkitService) {
    this.toolkitService.selectedTool$
      .pipe(takeUntilDestroyed())
      .subscribe((tool) => this.onSelectedToolChange(tool));

    this.toolkitService.executedTool$
      .pipe(takeUntilDestroyed())
      .subscribe((tool) => this.onExecutedToolChange(tool));
  }

  ngOnInit(): void {
    this.updateCursor(this.selectedTool.name);
  }

  private onSelectedToolChange(tool: Tool) {
    this.selectedTool = tool;
    this.updateCursor(tool.name);
  }

  private onExecutedToolChange(tool: Tool | null) {
    if (tool) {
      this.updateCursor(`executed--${tool.name}`);
    } else {
      this.updateCursor(this.selectedTool.name);
    }
  }

  private updateCursor(name: ToolCursorName) {
    const canvas = this.canvas?.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    canvas.style.cursor = TOOL_CURSOR[name];
  }
}
