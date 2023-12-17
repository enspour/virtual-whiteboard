import { ChangeDetectionStrategy, Component } from "@angular/core";

import { WorkspaceLayoutComponent } from "@workspace/components/layouts/workspace-layout/workspace-layout.component";
import { CanvasCursorComponent } from "@workspace/components/ui/canvas-cursor/canvas-cursor.component";
import { CanvasEventsComponent } from "@workspace/components/ui/canvas-events/canvas-events.component";
import { CanvasPainterComponent } from "@workspace/components/ui/canvas-painter/canvas-painter.component";
import { CanvasComponent } from "@workspace/components/ui/canvas/canvas.component";
import { ToolkitComponent } from "@workspace/components/ui/toolkit/toolkit.component";

import { DestroyService } from "@workspace/services/destroy.service";
import { DrawingsOnScreenService } from "@workspace/services/drawings/drawings-on-screen.service";
import { DrawingsService } from "@workspace/services/drawings/drawings.service";
import { LocalDrawingStorageService } from "@workspace/services/drawings/local-drawing-storage.service";
import { EventsService } from "@workspace/services/events.service";
import { BoardPainterService } from "@workspace/services/painters/board-painter.service";
import { DrawingsPainterService } from "@workspace/services/painters/drawings-painter.service";
import { PainterService } from "@workspace/services/painters/painter.service";
import { LocalScreenStorageService } from "@workspace/services/screen/local-screen-storage.service";
import { ScreenService } from "@workspace/services/screen/screen.service";
import { ToolArrowService } from "@workspace/services/toolkit/tool-handlers/tool-arrow.service";
import { ToolBrushService } from "@workspace/services/toolkit/tool-handlers/tool-brush.service";
import { ToolEllipseService } from "@workspace/services/toolkit/tool-handlers/tool-ellipse.service";
import { ToolEraserService } from "@workspace/services/toolkit/tool-handlers/tool-eraser.service";
import { ToolHandService } from "@workspace/services/toolkit/tool-handlers/tool-hand.service";
import { ToolRectangleService } from "@workspace/services/toolkit/tool-handlers/tool-rectangle.service";
import { ToolSelectionService } from "@workspace/services/toolkit/tool-handlers/tool-selection.service";
import { ToolTextService } from "@workspace/services/toolkit/tool-handlers/tool-text.service";
import { ToolkitService } from "@workspace/services/toolkit/toolkit.service";
import { WorkspaceService } from "@workspace/services/workspace.service";

import { ScreenStorageToken } from "@workspace/tokens";
import { DrawingStorageToken } from "@workspace/tokens";

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

    {
      provide: DrawingStorageToken,
      useClass: LocalDrawingStorageService,
    },

    PainterService,
    BoardPainterService,
    DrawingsPainterService,

    ToolkitService,

    ToolHandService,
    ToolSelectionService,
    ToolBrushService,
    ToolRectangleService,
    ToolEllipseService,
    ToolTextService,
    ToolArrowService,
    ToolEraserService,

    DrawingsService,
    DrawingsOnScreenService,
  ],
})
export class WorkspaceOnlineComponent {
  constructor(private workspaceService: WorkspaceService) {
    this.workspaceService.init();
  }
}
