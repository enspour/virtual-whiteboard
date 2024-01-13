import { CommonModule, DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { Subject, takeUntil } from "rxjs";

import { AppService } from "@shared";

import { ScreenService } from "@workspace/services";

import {
  Point,
  TextEditorChannel,
  TextEditorOptions,
} from "@workspace/interfaces";

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
    @Inject(DOCUMENT) private document: Document,
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

    this.editorRef.nativeElement.innerText = this.text;

    this.selectAllText();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.code === "Tab") {
      event.preventDefault();
      this.onTabClick();
    }
  }

  private onAppClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const element = this.editorRef.nativeElement;

    if (!element.contains(target)) {
      this.close();
    }
  }

  private onTabClick() {
    const selection = this.document.defaultView?.getSelection();

    if (selection) {
      const range = selection.getRangeAt(0);

      const tab = "\u00a0\u00a0\u00a0\u00a0";
      const tabNode = this.document.createTextNode(tab);

      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  private selectAllText() {
    const editor = this.editorRef.nativeElement;

    const range = this.document.createRange();
    range.selectNodeContents(editor);

    const selection = this.document.defaultView?.getSelection();

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  private close() {
    const editor = this.editorRef.nativeElement;

    editor.innerHTML = editor.innerHTML
      .replace(/<div><br><\/div>/g, "<br>")
      .replace(/<div>/g, "<br>")
      .replace(/<\/div>/g, "")
      .replace(/<br>/g, "<br>");

    const text = editor.innerText.trim();

    editor.innerText = text;

    const rect = editor.getBoundingClientRect();

    this.channel$.next({
      type: "closing",
      text,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    });
  }
}
