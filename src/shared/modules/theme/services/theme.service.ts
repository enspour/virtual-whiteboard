import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

import { LS_THEME, LocalStorageService } from "@shared";

import { Theme } from "../interfaces";

import dark from "@assets/themes/dark.theme.json";
import light from "@assets/themes/light.theme.json";

@Injectable()
export class ThemeService {
  private theme!: Theme;
  private properties!: Record<string, string>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localStorageService: LocalStorageService
  ) {
    const theme = this.localStorageService.get(LS_THEME);
    this.setTheme(theme);
  }

  public get Theme() {
    return this.theme;
  }

  public get Properties() {
    return this.properties;
  }

  public setTheme(theme: Theme) {
    this.properties = this.getProperties(theme);
    this.setProperties(this.properties);

    this.localStorageService.set(LS_THEME, theme);
    this.theme = theme;
  }

  public toggle() {
    switch (this.theme) {
      case "light":
        return this.setTheme("dark");
      case "dark":
        return this.setTheme("light");
    }
  }

  private getProperties(theme: Theme) {
    switch (theme) {
      case "light":
        return light;
      case "dark":
        return dark;
    }
  }

  private setProperties(properties: Record<string, string>) {
    for (const property in properties) {
      this.document.body.style.setProperty(property, properties[property]);
    }
  }
}
