import { ReplaySubject } from "rxjs";

export interface TextEditorSettings {
  textColor: string;
  textSize: number;
  textFamily: string;
  lineHeight: number;
}

export type TextEditorMessageClosing = {
  type: "closing";
  text: string;
  width: number;
  height: number;
};

export type TextEditorMessage = TextEditorMessageClosing;

export type TextEditorChannel = ReplaySubject<TextEditorMessage>;
