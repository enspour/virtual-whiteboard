import { TemplateRef } from "@angular/core";

export interface Portal {
  templateRef: TemplateRef<object>;
  x: number;
  y: number;
}
