import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "workspace",
    loadChildren: () =>
      import(
        "../modules/workspace/features/workspace-shell/workspace-shell.module"
      ).then((m) => m.WorkspaceShellModule),
  },
];
