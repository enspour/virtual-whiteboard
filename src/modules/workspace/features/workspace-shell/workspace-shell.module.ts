import { NgModule } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./workspace-shell.routes";

@NgModule({
  providers: [provideRouter(routes)],
})
export class WorkspaceShellModule {}
