import { ReplaySubject } from "rxjs";

export type TextEditorClosingEvent = {
  type: "closing";
  text: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type TextEditorChannelEvent = TextEditorClosingEvent;

export type TextEditorChannel = ReplaySubject<TextEditorChannelEvent>;
