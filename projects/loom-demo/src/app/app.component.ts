import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoomComponent, Node, Edge, DagreLayout } from 'ngx-loom';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'loom-demo';

  nodes: Node[] = [new Node(), new Node()];
  edges: Edge[] = [];
  layout: DagreLayout = new DagreLayout();
}
