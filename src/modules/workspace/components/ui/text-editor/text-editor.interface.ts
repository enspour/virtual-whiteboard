import { ReplaySubject } from "rxjs";

import { Point } from "@workspace/interfaces";

export type TextEditorPosition = Point;

export type TextEditorOptions = {
  textColor: string;
  textSize: number;
  textFamily: string;
  lineHeight: number;
};

export type TextEditorMessageClosing = {
  type: "closing";
  text: string;
  width: number;
  height: number;
};

export type TextEditorMessage = TextEditorMessageClosing;

export type TextEditorChannel = ReplaySubject<TextEditorMessage>;
