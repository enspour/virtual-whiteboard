import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from "@angular/core";

import { Observable, takeUntil } from "rxjs";

import { CursorService, DestroyService } from "@workspace/services";

import { Cursor } from "@workspace/interfaces";

import { CanvasComponent } from "../canvas/canvas.component";

@Component({
  selector: "app-canvas-cursor",
  templateUrl: "./canvas-cursor.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasCursorComponent implements OnInit {
  @Input({ required: true }) canvas!: CanvasComponent;

  private destroy$: Observable<void> = inject(DestroyService);

  constructor(private cursorService: CursorService) {}

  ngOnInit(): void {
    this.cursorService.cursor$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cursor) => this.setCursor(cursor));
  }

  private setCursor(cursor: Cursor) {
    const canvas = this.canvas?.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    canvas.style.cursor = cursor;
  }
}
