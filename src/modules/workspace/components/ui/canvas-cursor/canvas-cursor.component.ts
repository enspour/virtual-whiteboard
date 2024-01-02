import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";

import { Cursor, CursorName, ExecutableTool } from "@workspace/interfaces";

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

  private selectedTool!: ExecutableTool;
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
    this.setCursorByName(this.selectedTool.name);
  }

  private onSelectedToolChange(tool: ExecutableTool) {
    this.selectedTool = tool;
    this.setSelectedToolCursor();
  }

  private onExecutedToolChange(tool: ExecutableTool | null) {
    this.executedTool = tool;
    this.setExecutedToolCursor();
  }

  private setExecutedToolCursor() {
    if (this.executedTool) {
      this.captureCursorByName(`executed--${this.executedTool.name}`);
    } else {
      this.releaseCursor();
    }
  }

  private setSelectedToolCursor() {
    this.setCursorByName(this.selectedTool.name);
  }

  private releaseCursor() {
    this.captured = false;
    this.setSelectedToolCursor();
  }

  private captureCursorByName(name: CursorName) {
    this.setCursorByName(name);
    this.captured = true;
  }

  private captureCursor(cursor: Cursor) {
    this.setCursor(cursor);
    this.captured = true;
  }

  private setCursorByName(name: CursorName) {
    this.setCursor(TOOL_CURSOR[name]);
  }

  private setCursor(cursor: Cursor) {
    const canvas = this.canvas?.canvas?.nativeElement;

    if (!canvas || this.captured) {
      return;
    }

    canvas.style.cursor = cursor;
  }
}
