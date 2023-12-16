import { ChangeDetectionStrategy, Component } from "@angular/core";

import { WorkspaceLayoutComponent } from "@workspace/components/layouts/workspace-layout/workspace-layout.component";
import { CanvasComponent } from "@workspace/components/ui/canvas/canvas.component";

import { ScreenService } from "@workspace/services/screen.service";
import { LocalScreenStorageService } from "@workspace/services/storages/local-screen-storage.service";

import { ScreenStorageToken } from "@workspace/tokens";

@Component({
  selector: "app-workspace-online",
  templateUrl: "./workspace-online.component.html",
  styleUrl: "./workspace-online.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WorkspaceLayoutComponent, CanvasComponent],
  providers: [
    {
      provide: ScreenStorageToken,
      useClass: LocalScreenStorageService,
    },

    ScreenService,
  ],
})
export class WorkspaceOnlineComponent {}
