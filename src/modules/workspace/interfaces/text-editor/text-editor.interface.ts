import { Point } from "@workspace/interfaces";

export type TextEditorText = string;

export type TextEditorPosition = Point;

export type TextEditorOptions = {
  textColor: string;
  textSize: number;
  textFamily: string;
  lineHeight: number;
};
