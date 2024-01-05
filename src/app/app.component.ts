import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import {
  AppService,
  LocalStorageService,
  SharedModule,
  ThemeService,
} from "@shared";

import { LayoutComponent } from "./components/layout/layout.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [RouterOutlet, CommonModule, SharedModule, LayoutComponent],
  providers: [AppService, LocalStorageService, ThemeService],
})
export class AppComponent {
  title = "Virtual Whiteboard";
}
