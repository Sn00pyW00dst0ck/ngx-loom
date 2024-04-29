import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoomComponent, Node, Edge, DagreLayout, Orientation } from 'ngx-loom';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, LoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'loom-demo';

  // Properties needed to display the graph (setting some defaults so it doesn't start empty)
  protected nodes: Node[] = (() => {
    let ns = [];
    ns.push(new Node());
    ns.push(new Node());
    ns[0].label = "Hello";
    ns[1].label = "World";
    return ns;
  })();
  protected edges: Edge[] = (() => {
    let es = [];
    es.push(new Edge());
    es[0].source = this.nodes[0].id;
    es[0].target = this.nodes[1].id;
    return es;
  })();
  protected layout: DagreLayout = new DagreLayout();

  // Properties needed to create a node
  protected createNodeForm: FormGroup = this.fb.group({
    label: [null, [Validators.required, Validators.pattern('.*')]],
  });

  // Properties needed to create an edge  
  protected creatingEdge: boolean = false;
  protected sourceNode: Node | null = null;

  // Properties needed to update elements
  protected focusedElement: Node | Edge | null = null;

  constructor(private fb: FormBuilder) {
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

  //#region DOM Interaction

  protected onNodeClick = (data: { event: MouseEvent, node: Node }): void => {
    // Handle the creating edges mode
    if (this.creatingEdge && this.sourceNode === null) {
      this.sourceNode = data.node;
      return;
    }
    if (this.creatingEdge) {
      this.addEdge(this.sourceNode!, data.node);
      this.sourceNode = null;
      return;
    }

    this.focusedElement = data.node;
  }

  protected onEdgeClick = (data: { event: MouseEvent, edge: Edge }): void => {
    this.focusedElement = data.edge;
  }

  protected onCreateNodeFormSubmit = (): void => {
    if (this.createNodeForm.invalid) { return; }
    const { label } = this.createNodeForm.value;
    this.addNode(label);
    this.createNodeForm.reset();
  }

  //#endregion

  //#region Helper Methods

  protected isNode = (object: any): boolean => object instanceof Node;

  private addNode = (label: string): void => {
    const newNode = new Node();
    newNode.label = label;
    this.nodes = [...this.nodes, newNode];
  }

  private addEdge = (source: Node, target: Node) => {
    const newEdge = new Edge();
    newEdge.source = source.id;
    newEdge.target = target.id;
    this.edges = [...this.edges, newEdge];
  }

  //#endregion

}
