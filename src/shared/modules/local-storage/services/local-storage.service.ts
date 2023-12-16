import { Injectable } from "@angular/core";

import { LocalStorageKey, LocalStoragePairs } from "../interfaces";

import { LS_DEFAULTS } from "../constants";

@Injectable()
export class LocalStorageService {
  constructor() {}

  public get<K extends LocalStorageKey>(key: K): LocalStoragePairs[K] {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return LS_DEFAULTS[key];
  }

  public set<K extends LocalStorageKey>(key: K, value: LocalStoragePairs[K]) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public update<K extends LocalStorageKey>(
    key: K,
    action: (current: LocalStoragePairs[K]) => LocalStoragePairs[K]
  ) {
    let current = this.get(key);

    if (current === null) {
      current = LS_DEFAULTS[key];
    }

    this.set(key, action(current));
  }

  public remove<K extends LocalStorageKey>(key: K) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
