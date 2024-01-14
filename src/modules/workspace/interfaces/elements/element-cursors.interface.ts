import { Cursor } from "../cursors.interface";
import { Element } from "./element.interface";

export type ElementCursors = Record<Element["type"], Cursor>;
