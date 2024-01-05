import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { ToolkitService } from "@workspace/services";

import {
  CursorStatus,
  ExecutableTool,
  SelectableTool,
} from "@workspace/interfaces";

import { TOOL_CURSOR } from "@workspace/constants";

import { CanvasComponent } from "../canvas/canvas.component";

@Component({
  selector: "app-canvas-cursor",
  templateUrl: "./canvas-cursor.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasCursorComponent implements OnInit {
  @Input({ required: true }) canvas!: CanvasComponent;

  private selectedTool!: SelectableTool;
  private executedTool!: ExecutableTool | null;

  private captured = false;

  constructor(private toolkitService: ToolkitService) {
    this.toolkitService.selectedTool$
      .pipe(takeUntilDestroyed())
      .subscribe((tool) => this.onSelectedToolChange(tool));

    this.toolkitService.executedTool$
      .pipe(takeUntilDestroyed())
      .subscribe((tool) => this.onExecutedToolChange(tool));
  }

  ngOnInit(): void {
    this.setSelectedToolCursor();
  }

  private onSelectedToolChange(tool: SelectableTool) {
    this.selectedTool = tool;
    this.setSelectedToolCursor();
  }

  private onExecutedToolChange(tool: ExecutableTool | null) {
    this.executedTool = tool;
    this.setExecutedToolCursor();
  }

  private setExecutedToolCursor() {
    if (this.executedTool) {
      this.captureCursor(`executed--${this.executedTool.name}`);
    } else {
      this.releaseCursor();
    }
  }

  private setSelectedToolCursor() {
    this.setCursor(this.selectedTool.name);
  }

  private releaseCursor() {
    this.captured = false;
    this.setSelectedToolCursor();
  }

  private captureCursor(status: CursorStatus) {
    this.setCursor(status);
    this.captured = true;
  }

  private setCursor(status: CursorStatus) {
    const canvas = this.canvas?.canvas?.nativeElement;

    if (!canvas || this.captured) {
      return;
    }

    canvas.style.cursor = TOOL_CURSOR[status];
  }
}
