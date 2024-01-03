import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { ExecutableTool, SelectableTool } from "@workspace/interfaces";

import { EXECUTABLE_TOOLS } from "@workspace/constants";

import {
  LS_SELECTED_TOOL,
  LS_TOOLKIT,
  LocalStorageService,
} from "@local-storage";

@Injectable()
export class ToolkitService {
  private executableTools = EXECUTABLE_TOOLS;

  private toolkit: BehaviorSubject<SelectableTool[]>;
  public toolkit$: Observable<SelectableTool[]>;

  private selectedTool: BehaviorSubject<SelectableTool>;
  public selectedTool$: Observable<SelectableTool>;

  private executedTool = new BehaviorSubject<ExecutableTool | null>(null);
  public executedTool$ = this.executedTool.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    const toolkit = localStorageService.get(LS_TOOLKIT);

    this.toolkit = new BehaviorSubject(toolkit);
    this.toolkit$ = this.toolkit.asObservable();

    const selectedToolName = localStorageService.get(LS_SELECTED_TOOL);

    const index = toolkit.findIndex((tool) => tool.name === selectedToolName);

    const selectedTool = index !== -1 ? toolkit[index] : toolkit[0];

    this.selectedTool = new BehaviorSubject(selectedTool);
    this.selectedTool$ = this.selectedTool.asObservable();
  }

  get SelectedTool() {
    return this.selectedTool.getValue();
  }

  get ExecutedTool() {
    return this.executedTool.getValue();
  }

  public setToolkit(toolkit: SelectableTool[]) {
    this.localStorageService.set(LS_TOOLKIT, toolkit);
    this.toolkit.next(toolkit);
  }

  public swapToolkit(indexes: [number, number]) {
    const toolkit = this.toolkit.value;

    const temp = toolkit[indexes[0]];
    toolkit[indexes[0]] = toolkit[indexes[1]];
    toolkit[indexes[1]] = temp;

    this.setToolkit([...toolkit]);
  }

  public setSelectedTool(name: SelectableTool["name"]) {
    const toolkit = this.toolkit.value;

    const index = toolkit.findIndex((tool) => tool.name === name);

    if (index !== -1) {
      this.localStorageService.set(LS_SELECTED_TOOL, name);
      this.selectedTool.next(toolkit[index]);
    }
  }

  public setExecutedTool(name: ExecutableTool["name"] | "") {
    const index = this.executableTools.findIndex((tool) => tool.name === name);

    if (index !== -1) {
      this.executedTool.next(this.executableTools[index]);
    } else {
      this.executedTool.next(null);
    }
  }
}
