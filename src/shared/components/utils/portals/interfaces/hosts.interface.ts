import { WritableSignal } from "@angular/core";

import { Portal } from "./portal.interface";

export type Hosts = Map<string, WritableSignal<Portal[]>>;
