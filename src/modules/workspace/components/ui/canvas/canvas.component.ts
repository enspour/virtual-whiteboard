import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrl: "./canvas.component.scss",
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent {
  @ViewChild("canvas") canvas!: ElementRef<HTMLCanvasElement>;
}
