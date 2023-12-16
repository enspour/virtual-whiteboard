import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";

import { EventsService } from "@workspace/services/events.service";

import { CanvasComponent } from "../canvas/canvas.component";

@Component({
  selector: "app-canvas-events",
  templateUrl: "./canvas-events.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasEventsComponent implements OnInit {
  @Input({ required: true }) canvas!: CanvasComponent;

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    const canvas = this.canvas.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    this.eventsService.setCanvas(canvas);
  }
}
