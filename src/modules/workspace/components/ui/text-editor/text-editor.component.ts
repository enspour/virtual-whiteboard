import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { Subject, takeUntil } from "rxjs";

import { AppService } from "@shared/modules/app/services/app.service";
import { ScreenService } from "@workspace/services/screen/screen.service";

import { Point } from "@workspace/interfaces";

import { TextEditorChannel, TextEditorOptions } from "./text-editor.interface";

@Component({
  selector: "app-text-editor",
  templateUrl: "./text-editor.component.html",
  styleUrl: "./text-editor.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @ViewChild("editor", { static: true }) editorRef!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) text!: string;
  @Input({ required: true }) position!: Point;
  @Input({ required: true }) options!: TextEditorOptions;
  @Input({ required: true }) channel$!: TextEditorChannel;

  public scale!: number;

  private destroy$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private appService: AppService,
    private screenService: ScreenService
  ) {
    this.appService.escape$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.close());

    this.appService.mousedown$
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.onAppClick(event));
  }

  ngOnInit(): void {
    this.screenService.scale$
      .pipe(takeUntil(this.destroy$))
      .subscribe((scale) => {
        this.scale = scale;
        this.cdRef.detectChanges();
      });

    const editor = this.editorRef.nativeElement;

    editor.innerText = this.text;

    setTimeout(() => editor.focus(), 0);

    if (this.text) {
      const range = document.createRange();
      range.selectNodeContents(editor);

      const selection = window.getSelection();

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onInput(event: Event) {
    const target = event.target as HTMLDivElement;

    this.text = target.innerHTML
      .replace(/<div><br><\/div>/g, "\n")
      .replace(/<div>/g, "\n")
      .replace(/<\/div>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  private onAppClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const element = this.editorRef.nativeElement;

    if (!element.contains(target)) {
      this.close();
    }
  }

  private close() {
    this.text = this.text.trim();

    const editor = this.editorRef.nativeElement;

    editor.innerText = this.text;

    const rect = editor.getBoundingClientRect();

    this.channel$.next({
      type: "closing",
      text: this.text,
      width: rect.width,
      height: rect.height,
    });
  }
}
