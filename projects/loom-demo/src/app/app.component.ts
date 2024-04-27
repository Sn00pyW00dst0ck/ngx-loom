import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoomComponent, Node, Edge, DagreLayout, Orientation } from 'ngx-loom';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'loom-demo';

  nodes: Node[] = [new Node(), new Node(), new Node(), new Node()];
  edges: Edge[] = (() => {
    let es = [];
    es.push(new Edge());
    es[0].source = this.nodes[0].id;
    es[0].target = this.nodes[1].id;
    es.push(new Edge());
    es[1].source = this.nodes[0].id;
    es[1].target = this.nodes[1].id;
    es.push(new Edge());
    es[2].source = this.nodes[1].id;
    es[2].target = this.nodes[2].id;
    es.push(new Edge());
    es[3].source = this.nodes[2].id;
    es[3].target = this.nodes[3].id;
    return es;
  })();
  layout: DagreLayout = new DagreLayout();

  constructor() {
    this.layout.settings = {
      orientation: Orientation.LEFT_TO_RIGHT,
      marginX: 20,
      marginY: 20,
      edgePadding: 100,
      rankPadding: 200,
      nodePadding: 50,
      multigraph: true,
      compound: true
    };
  };

}
