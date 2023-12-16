import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { Tool } from "@workspace/interfaces";

import {
  LS_SELECTED_TOOL,
  LS_TOOLKIT,
  LocalStorageService,
} from "@local-storage";

@Injectable()
export class ToolkitService {
  private toolkit: BehaviorSubject<Tool[]>;
  public toolkit$: Observable<Tool[]>;

  private selectedTool: BehaviorSubject<Tool>;
  public selectedTool$: Observable<Tool>;

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

  public setToolkit(toolkit: Tool[]) {
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

  public setSelectedTool(name: Tool["name"]) {
    const toolkit = this.toolkit.value;

    const index = toolkit.findIndex((tool) => tool.name === name);

    if (index !== -1) {
      this.localStorageService.set(LS_SELECTED_TOOL, name);
      this.selectedTool.next(toolkit[index]);
    }
  }
}
