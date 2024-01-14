import { Injectable, inject } from "@angular/core";

import { BehaviorSubject, Observable, takeUntil } from "rxjs";

import {
  CursorOnElementService,
  DestroyService,
  ToolsService,
} from "@workspace/services";

import {
  Cursor,
  Element,
  ExecutableTool,
  SelectableTool,
  ToolCursor,
} from "@workspace/interfaces";

import {
  ELEMENT_CURSOR,
  RESIZER_CURSOR,
  TOOL_CURSOR,
} from "@workspace/constants";

@Injectable()
export class CursorService {
  private cursor = new BehaviorSubject<Cursor>("auto");
  public cursor$ = this.cursor.asObservable();

  private last: Cursor = "auto";

  private selectedTool!: SelectableTool;
  private executedTool!: ExecutableTool | null;

  private captured = false;

  private destroy$: Observable<void> = inject(DestroyService, { self: true });

  constructor(
    private toolsService: ToolsService,
    private cursorOnElementService: CursorOnElementService
  ) {
    this.toolsService.selectedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => this.onSelectedToolChange(tool));

    this.toolsService.executedTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tool) => this.onExecutedToolChange(tool));

    this.cursorOnElementService.element$
      .pipe(takeUntil(this.destroy$))
      .subscribe((element) => this.onElementChange(element));
  }

  private onSelectedToolChange(tool: SelectableTool) {
    this.selectedTool = tool;
    this.setCursor(TOOL_CURSOR[this.selectedTool.name]);
  }

  private onExecutedToolChange(tool: ExecutableTool | null) {
    this.executedTool = tool;

    if (this.executedTool) {
      this.captureCursor(`executed--${this.executedTool.name}`);
    } else {
      this.releaseCursor();
    }
  }

  private onElementChange(element: Element | null) {
    if (element) {
      switch (element.type) {
        case "resizer-anchor":
          this.setCursor(RESIZER_CURSOR[element.anchor.direction]);
          break;
        case "selection-border":
          this.setCursor(RESIZER_CURSOR[element.border.direction]);
          break;
        default:
          this.setCursor(ELEMENT_CURSOR[element.type]);
          break;
      }
    } else {
      this.setCursor(TOOL_CURSOR[this.selectedTool.name]);
    }
  }

  private captureCursor(name: ToolCursor) {
    this.setCursor(TOOL_CURSOR[name]);
    this.captured = true;
  }

  private releaseCursor() {
    this.captured = false;
    this.setCursor(this.last);
  }

  private setCursor(cursor: Cursor) {
    if (this.captured) {
      return;
    }

    this.cursor.next(cursor);

    setTimeout(() => !this.captured && (this.last = cursor), 0);
  }
}
