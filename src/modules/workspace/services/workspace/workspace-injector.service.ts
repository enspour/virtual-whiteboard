import { Injectable, Injector } from "@angular/core";

export let WorkspaceInjector: Injector;

@Injectable()
export class WorkspaceInjectorService {
  constructor(injector: Injector) {
    WorkspaceInjector = injector;
  }
}
