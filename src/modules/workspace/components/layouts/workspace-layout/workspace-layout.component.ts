import { ChangeDetectionStrategy, Component } from "@angular/core";

import { SharedModule } from "@shared/shared.module";

import { SizesObserverChange } from "@shared/components/utils/sizes-observer/sizes-observer.interface";

import { ScreenService } from "@workspace/services/screen.service";

@Component({
  selector: "app-workspace-layout",
  templateUrl: "./workspace-layout.component.html",
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceLayoutComponent {
  constructor(private screenService: ScreenService) {}

  onSizesChange(sizes: SizesObserverChange) {
    this.screenService.setSizes(sizes);
  }
}
