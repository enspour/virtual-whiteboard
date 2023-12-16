import { ChangeDetectionStrategy, Component } from "@angular/core";

import { WorkspaceLayoutComponent } from "@workspace/components/layouts/workspace-layout/workspace-layout.component";
import { CanvasCursorComponent } from "@workspace/components/ui/canvas-cursor/canvas-cursor.component";
import { CanvasEventsComponent } from "@workspace/components/ui/canvas-events/canvas-events.component";
import { CanvasPainterComponent } from "@workspace/components/ui/canvas-painter/canvas-painter.component";
import { CanvasComponent } from "@workspace/components/ui/canvas/canvas.component";
import { ToolkitComponent } from "@workspace/components/ui/toolkit/toolkit.component";

import { DestroyService } from "@workspace/services/destroy.service";
import { EventsService } from "@workspace/services/events.service";
import { BoardPainterService } from "@workspace/services/painters/board-painter.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { ScreenService } from "@workspace/services/screen.service";
import { LocalScreenStorageService } from "@workspace/services/storages/local-screen-storage.service";
import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";
import { WorkspaceService } from "@workspace/services/workspace.service";

import { ScreenStorageToken } from "@workspace/tokens";

@Component({
  selector: "app-workspace-online",
  templateUrl: "./workspace-online.component.html",
  styleUrl: "./workspace-online.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WorkspaceLayoutComponent,

    CanvasComponent,
    CanvasPainterComponent,
    CanvasEventsComponent,
    CanvasCursorComponent,

    ToolkitComponent,
  ],
  providers: [
    DestroyService,

    WorkspaceService,

    ScreenService,
    EventsService,

    {
      provide: ScreenStorageToken,
      useClass: LocalScreenStorageService,
    },

    PainterService,
    BoardPainterService,

    ToolkitService,
  ],
})
export class WorkspaceOnlineComponent {
  constructor(private workspaceService: WorkspaceService) {
    this.workspaceService.init();
  }
}
