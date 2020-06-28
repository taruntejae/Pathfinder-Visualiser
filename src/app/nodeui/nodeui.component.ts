import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  HostListener,
  EventEmitter,
} from '@angular/core';
import { GridNode } from '../node.model';

@Component({
  selector: 'nodeui',
  templateUrl: './nodeui.component.html',
  styleUrls: ['./nodeui.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeuiComponent implements OnInit {
  @Input('state') state: GridNode;
  el = this.element.nativeElement;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.state.isSource) {
      this.renderer.addClass(this.el, 'source');
    }
    if (this.state.isTarget) {
      this.renderer.addClass(this.el, 'target');
    }
    if (this.state.isWall) {
      this.renderer.addClass(this.el, 'wall');
    }
    if (this.state.isInPath) {
      this.renderer.addClass(this.el, 'inpath');
    }
    if (
      this.state.isVisited &&
      !this.state.isSource &&
      !this.state.isTarget &&
      !this.state.isWall &&
      !this.state.isInPath
    ) {
      this.renderer.addClass(this.el, 'visited');
    }
  }
}
