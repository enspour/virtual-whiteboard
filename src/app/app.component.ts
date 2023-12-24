import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { SharedModule } from "@shared/shared.module";

import { LayoutComponent } from "./components/layout/layout.component";

import { AppService } from "@shared/modules/app/services/app.service";

import { LocalStorageService } from "@local-storage";
import { ThemeService } from "@theme";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, LayoutComponent],
  providers: [AppService, LocalStorageService, ThemeService],
})
export class AppComponent {
  title = "miro-clone";
}
