import { Inject, Injectable, Injector } from "@angular/core";

import { ReplaySubject } from "rxjs";

import { nanoid } from "nanoid";

import {
  Portal,
  PortalsController,
  portalsControllerToken,
} from "@shared/components/utils/portals";

import { TextEditorComponent } from "./text-editor.component";
import {
  TextEditorChannel,
  TextEditorOptions,
  TextEditorPosition,
} from "./text-editor.interface";

@Injectable()
export class TextEditorService {
  constructor(
    @Inject(portalsControllerToken)
    private portalsController: PortalsController,
    private injector: Injector
  ) {}

  open(text: string, position: TextEditorPosition, options: TextEditorOptions) {
    const channel$: TextEditorChannel = new ReplaySubject();

    const portal: Portal = {
      id: nanoid(6),
      type: "component",
      componentType: TextEditorComponent,
      componentInjector: this.injector,
      componentInputs: {
        text,
        position,
        options,
        channel$,
      },
    };

    this.portalsController.openPortal("text-editor", portal);

    return {
      channel$,
      close: () => this.close(portal),
    };
  }

  private close(portal: Portal) {
    this.portalsController.closePortal("text-editor", portal);
  }
}
