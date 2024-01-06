import { ChangeDetectionStrategy, Component } from "@angular/core";

import { SharedModule } from "@shared";

import { CanvasCursorComponent } from "@workspace/components/ui/canvas-cursor/canvas-cursor.component";
import { CanvasComponent } from "@workspace/components/ui/canvas/canvas.component";
import { FooterHistoryComponent } from "@workspace/components/ui/footer-history/footer-history.component";
import { FooterScaleComponent } from "@workspace/components/ui/footer-scale/footer-scale.component";
import { HeaderActionBarComponent } from "@workspace/components/ui/header-action-bar/header-action-bar.component";
import { HeaderToolkitComponent } from "@workspace/components/ui/header-toolkit/header-toolkit.component";

import {
  DestroyService,
  DrawingsOnScreenService,
  DrawingsOnSelectionService,
  DrawingsOnStashService,
  DrawingsOnTrashService,
  DrawingsService,
  HistoryRestoreService,
  HistoryService,
  LocalDrawingStorageService,
  LocalHistoryStorageService,
  LocalScreenStorageService,
  PainterBoardService,
  PainterDrawingsService,
  PainterSelectionService,
  PainterService,
  ScreenHandlerService,
  ScreenService,
  SelectionService,
  TextEditorCreateService,
  TextEditorEditService,
  TextEditorService,
  ToolArrowService,
  ToolBrushService,
  ToolEllipseService,
  ToolEraserService,
  ToolHandService,
  ToolRectangleService,
  ToolSelectionClickService,
  ToolSelectionMoveService,
  ToolSelectionSelectService,
  ToolSelectionService,
  ToolTextCreateService,
  ToolTextEditService,
  ToolTextService,
  ToolsHandlerService,
  ToolsService,
  WorkspaceEventsService,
  WorkspaceKeyboardService,
  WorkspaceService,
} from "@workspace/services";

import {
  DrawingStorageToken,
  HistoryStorageToken,
  ScreenStorageToken,
} from "@workspace/tokens";

@Component({
  selector: "app-workspace-online",
  templateUrl: "./workspace-online.component.html",
  styleUrl: "./workspace-online.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedModule,

    CanvasComponent,
    CanvasCursorComponent,

    HeaderToolkitComponent,

    HeaderActionBarComponent,

    FooterScaleComponent,
    FooterHistoryComponent,
  ],
  providers: [
    DestroyService,

    WorkspaceService,
    WorkspaceEventsService,
    WorkspaceKeyboardService,

    ScreenService,
    ScreenHandlerService,

    {
      provide: ScreenStorageToken,
      useClass: LocalScreenStorageService,
    },

    HistoryService,
    HistoryRestoreService,

    {
      provide: HistoryStorageToken,
      useClass: LocalHistoryStorageService,
    },

    PainterService,
    PainterBoardService,
    PainterDrawingsService,
    PainterSelectionService,

    ToolsService,
    ToolsHandlerService,

    ToolHandService,
    ToolSelectionService,
    ToolSelectionSelectService,
    ToolSelectionMoveService,
    ToolSelectionClickService,
    ToolBrushService,
    ToolRectangleService,
    ToolEllipseService,
    ToolTextService,
    ToolTextCreateService,
    ToolTextEditService,
    ToolArrowService,
    ToolEraserService,

    DrawingsService,
    DrawingsOnScreenService,
    DrawingsOnSelectionService,
    DrawingsOnTrashService,
    DrawingsOnStashService,

    {
      provide: DrawingStorageToken,
      useClass: LocalDrawingStorageService,
    },

    SelectionService,

    TextEditorService,
    TextEditorCreateService,
    TextEditorEditService,
  ],
})
export class WorkspaceOnlineComponent {
  constructor(private workspaceService: WorkspaceService) {
    this.workspaceService.init();
  }
}
