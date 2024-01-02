import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";

import { PainterService } from "@workspace/services/painters/painter.service";

import { CanvasComponent } from "../canvas/canvas.component";

@Component({
  selector: "app-canvas-painter",
  templateUrl: "./canvas-painter.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasPainterComponent implements OnInit {
  @Input({ required: true }) canvas!: CanvasComponent;

  constructor(private painterService: PainterService) {}

  ngOnInit(): void {
    const canvas = this.canvas.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    this.painterService.setContext(context);
  }
}
