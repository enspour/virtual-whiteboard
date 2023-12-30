import { Injector, TemplateRef, Type } from "@angular/core";

export interface TemplatePortal<C> {
  type: "template";
  templateRef: TemplateRef<C>;
  templateContext?: C;
}

export interface ComponentPortal<C> {
  type: "component";
  componentType: Type<C>;
  componentInputs?: C;
  componentInjector?: Injector;
  // eslint-disable-next-line
  componentContent?: any[][];
}

// eslint-disable-next-line
export type Portal<C = any> = TemplatePortal<C> | ComponentPortal<C>;
