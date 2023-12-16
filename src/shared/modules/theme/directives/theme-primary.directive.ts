import { Directive } from "@angular/core";

import { ThemePaletteToken } from "../tokens";

@Directive({
  selector: "[appThemePrimary]",
  standalone: true,
  providers: [
    {
      provide: ThemePaletteToken,
      useValue: "primary",
    },
  ],
})
export class ThemePrimaryDirective {}
