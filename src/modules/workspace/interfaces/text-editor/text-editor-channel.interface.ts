import { ReplaySubject } from "rxjs";

export type TextEditorChannelEventClosing = {
  type: "closing";
  text: string;
  width: number;
  height: number;
};

export type TextEditorChannelEvent = TextEditorChannelEventClosing;

export type TextEditorChannel = ReplaySubject<TextEditorChannelEvent>;
