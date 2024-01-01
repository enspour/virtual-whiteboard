import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { AppService } from "@shared/modules/app/services/app.service";

import { Point } from "@workspace/interfaces";

import { TextEditorChannel, TextEditorSettings } from "./text-editor.interface";

@Component({
  selector: "app-text-editor",
  templateUrl: "./text-editor.component.html",
  styleUrl: "./text-editor.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class TextEditorComponent implements AfterViewInit {
  @ViewChild("editor") editorRef!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) position!: Point;
  @Input({ required: true }) settings!: TextEditorSettings;
  @Input({ required: true }) channel$!: TextEditorChannel;

  @Input() text: string = "";

  constructor(private appService: AppService) {
    this.appService.escape$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.close());

    this.appService.mousedown$
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.onAppClick(event));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.editorRef.nativeElement.focus(), 0);
  }

  public onInput(event: Event) {
    const target = event.target as HTMLDivElement;
    this.text = target.innerText;
  }

  private onAppClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const element = this.editorRef.nativeElement;

    if (!element.contains(target)) {
      this.close();
    }
  }

  private close() {
    const rect = this.editorRef.nativeElement.getBoundingClientRect();

    this.channel$.next({
      type: "closing",
      text: this.text,
      width: rect.width,
      height: rect.height,
    });
  }
}
