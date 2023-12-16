import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { LocalStorageService } from "@local-storage";
import { ThemeService } from "@theme";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [LocalStorageService, ThemeService],
})
export class AppComponent {
  title = "miro-clone";
}
