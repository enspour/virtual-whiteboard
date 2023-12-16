import { InjectionToken } from "@angular/core";

import { ThemePalette } from "../interfaces";

export const ThemePaletteToken = new InjectionToken<ThemePalette>(
  "__theme-palette",
  {
    factory: () => "primary",
  }
);
