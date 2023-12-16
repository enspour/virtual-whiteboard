import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

import { LocalStorageService } from "@shared/modules/local-storage/services/local-storage.service";

import { Theme } from "../interfaces";

import dark from "@assets/themes/dark.theme.json";
import light from "@assets/themes/light.theme.json";

import { LS_THEME } from "@shared/modules/local-storage";

@Injectable()
export class ThemeService {
  private theme: Theme;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localStorageService: LocalStorageService
  ) {
    this.theme = this.localStorageService.get(LS_THEME);
    this.setTheme(this.theme);
  }

  public get Theme() {
    return this.theme;
  }

  public setTheme(theme: Theme) {
    const properties = this.getProperties(theme);
    this.setProperties(properties);

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
