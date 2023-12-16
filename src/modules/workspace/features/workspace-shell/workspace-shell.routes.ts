import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "online",
    loadComponent: () =>
      import("../workspace-online/workspace-online.component").then(
        (m) => m.WorkspaceOnlineComponent
      ),
  },
];
