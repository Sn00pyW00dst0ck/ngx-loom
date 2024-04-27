import { CommonModule } from "@angular/common";
import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Output, QueryList, TemplateRef, ViewChildren, computed, effect, input, signal, untracked } from "@angular/core";
import { Node, Edge, Matrix, Layout } from "../interface/loom.interface";
import { identity, scale, smoothMatrix, toSVG, transform, translate } from 'transformation-matrix';
import { constrain } from "../utils";
import { MouseWheelDirective } from "../mousewheel.directive";


/**
 * The loom component.
 */
@Component({
    selector: 'loom',
    standalone: true,
    imports: [CommonModule, MouseWheelDirective],
    templateUrl: './loom.component.html',
    styleUrl: './loom.component.sass',
})
export class LoomComponent {
    /**
     * The DOM dimensions for the loom component.
     */
    public DOMDimensions = input.required<{ w: number, h: number }>();

    /**
     * The nodes for the loom to display.
     */
    public nodes = input.required<Node[]>();
    /**
     * The edges for the loom to display.
     */
    public edges = input.required<Edge[]>();
    /**
     * The layout to use to render the graph.
     */
    public layout = input.required<Layout>();

    /**
     * The transformation matrix stores pan and zoom information.
     */
    private transformationMatrix = signal<Matrix>(identity());
    /**
     * The 'transform' computed signal translates the transformationMatrix into CSS useable format.
     */
    public readonly transform = computed(() => toSVG(smoothMatrix(this.transformationMatrix(), 100)));

    /**
     * Tracks if the graph has been initialized or not.
     */
    protected initialized: boolean = false;

    /**
     * Tracks if the graph is being panned or not. 
     */
    protected isPanning: boolean = false;


    protected zoomEnabled = signal<boolean>(true);
    protected zoomLevel = signal<number>(1);
    protected minZoomLevel = signal<number>(1);
    protected maxZoomLevel = signal<number>(10);
    protected zoomSpeed = signal<number>(0.1);
    protected panOnZoom = signal<boolean>(true);


    /**
     * The dimensions of the graph within the loom. Necessary because the graph will not be the same size as the DOM container.
     */
    private graphDimensions: { w: number, h: number } = { w: 0, h: 0 };
    /**
     * 
     */
    private graphUpdate = signal<{ nodes: Node[], edges: Edge[] } | null>(null);

    @ContentChild('nodeTemplate') nodeTemplate!: TemplateRef<any>;
    @ContentChild('edgeTemplate') edgeTemplate!: TemplateRef<any>;
    @ContentChild('clusterTemplate') clusterTemplate!: TemplateRef<any>;
    @ContentChild('defsTemplate') defsTemplate!: TemplateRef<any>;

    @ViewChildren('nodeElement') nodeElements!: QueryList<ElementRef>;
    @ViewChildren('edgeElement') edgeElements!: QueryList<ElementRef>;

    /**
     * 
     */
    @Output() nodeClicked = new EventEmitter<{ event: MouseEvent, node: Node }>();
    /**
     * 
     */
    @Output() edgeClicked = new EventEmitter<{ event: MouseEvent, edge: Edge }>();


    /**
     * 
     */
    constructor(private el: ElementRef) {
        // TODO: Setup a bunch of effects here...

        // Setup an effect to regenerate the graph when key things update. 
        effect(() => {
            this.DOMDimensions();
            this.nodes();
            this.edges();

            untracked(() => requestAnimationFrame(() => this.recalculateGraphLayout()));
        });

        // Setup the effect to draw the graph when necessary
        effect(() => {
            if (this.graphUpdate() !== null) {
                this.tick();
            }
        });

        this.initialized = true;
    }

    //#region DOM Interaction

    /**
     * A function which fires on each mouse movement. Needed to allow panning to occur.
     *
     * @param {MouseEvent} $event the event which triggered this function call
     */
    @HostListener('document:mousemove', ['$event'])
    private onMouseMove = ($event: MouseEvent): void => {
        if (this.isPanning) {
            this.pan($event.movementX, $event.movementY);
        }
    }

    /**
     * A function which fires on each mouse up event. Needed to allow panning to end.
     *
     * @param { MouseEvent } $event the event which triggered this function call
     */
    @HostListener('document:mouseup', ['$event'])
    private onMouseUp = ($event: MouseEvent): void => { this.isPanning = false };

    /**
     * A function that fires on scroll wheel events within the graph component. 
     * 
     * @param { WheelEvent } $event the mousewheel event which triggered this function call. 
     */
    protected onScroll = ($event: WheelEvent): void => {
        // check if zoom is on or not. 

        const zoomFactor = 1 + ($event.deltaY < 0 ? this.zoomSpeed() : -this.zoomSpeed());

        // Apply the actual zoom
        if (this.panOnZoom() && $event) {
            // Absolute mouse X/Y on the screen
            const mouseX = $event.clientX;
            const mouseY = $event.clientY;

            // Transform to SVG X/Y
            const svg = this.el.nativeElement.querySelector('svg');
            const svgGroup = svg.querySelector('g.content');

            // Create a SVG point
            const point = svg.createSVGPoint();
            point.x = mouseX;
            point.y = mouseY;
            const svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse());

            // Pan around SVG, zoom, then unpan
            this.pan(svgPoint.x, svgPoint.y, true);
            this.zoom(zoomFactor);
            this.pan(-svgPoint.x, -svgPoint.y, true);
        } else {
            this.zoom(zoomFactor);
        }
    }

    /**
     * Emits the proper event whenever a node element is clicked.
     * 
     * @param { MouseEvent } $event the MouseEvent which triggered the event
     * @param { Node } node the node which was clicked
     */
    protected onNodeClick = ($event: MouseEvent, node: Node): void => this.nodeClicked.emit({ event: $event, node: node });

    /**
     * Emits the proper event whenever an edge element is clicked. 
     * 
     * @param { MouseEvent } $event the MouseEvent which triggered the event
     * @param { Edge } edge the edge which was clicked
     */
    protected onEdgeClick = ($event: MouseEvent, edge: Edge): void => this.edgeClicked.emit({ event: $event, edge: edge });

    //#endregion


    //#region Graph Drawing

    private recalculateGraphLayout = (): void => {
        // Run the layout
        this.graphUpdate = this.layout().run(this.nodes(), this.edges());
        // Apply new node dimensions if applicable
        if (this.nodes().length > 0) {
            // this.applyNodeDimensions();
            // this.updateGraphDimensions();
        }
    }

    private tick = (): void => {
        // Set view options for the nodes & clusters (for animations to work)
        const oldNodes: Set<string> = new Set();
        this.nodes().map((n: any) => {
            n.transform = `translate(${n.position.x - n.dimension.w / 2}, ${n.position.y - n.dimension.h / 2})`;
            n.color ??= '#000000';
            oldNodes.add(n.id!);
        });
        setTimeout(() => { let x = oldNodes; }, 500);

        // update edges...
    }

    //#endregion


    //#region Panning

    /**
     * Pan the graph by a fixed x and y amount.
     * 
     * @param { number } x the x amount to pan by.
     * @param { number } y the y amount to pan by.
     * @param { boolean } ignoreZoomLevel whether to scale the panning by the zoom factor or no. Default is false.
     */
    private pan = (x: number, y: number, ignoreZoomLevel: boolean = false): void => {
        // Ensure proper input
        if (isNaN(x) || isNaN(y)) {
            return;
        }

        const zoomLevel = ignoreZoomLevel ? 1 : this.zoomLevel();
        this.transformationMatrix.set(transform(this.transformationMatrix(), translate(x / zoomLevel, y / zoomLevel)));
    }

    /**
     * Pan the graph so it is centered at a given position.
     * 
     * @param { number } x the x coord to pan to.
     * @param { number } y the y coord to pan to. 
     */
    private panTo = (x: number, y: number): void => {
        // Ensure proper input
        if (isNaN(x) || isNaN(y)) {
            return;
        }

        const panX = -this.transformationMatrix().e - x * this.zoomLevel() + this.DOMDimensions().w / 2;
        const panY = -this.transformationMatrix().f - y * this.zoomLevel() + this.DOMDimensions().h / 2;

        this.transformationMatrix.set(transform(
            this.transformationMatrix(),
            translate(panX / this.zoomLevel(), panY / this.zoomLevel())
        ));
    }

    /**
     * Pan the view to center on a specific node. 
     * 
     * @param { string } id the id of the Node to pan to. 
     */
    public panToNode = (id: string): void => {
        const node = this.nodes().find((node: Node) => node.id === id);
        if (!node || !node.position) { return; }
        this.panTo(node.position.x, node.position.y);
    }

    /**
     * Pan to center the graph within the DOM container. 
     */
    public panToCenter = (): void => this.panTo(this.graphDimensions.w / 2, this.graphDimensions.h / 2);

    //#endregion


    //#region Zooming

    /**
     * Zoom the graph by a factor. Used for the scroll wheel zooming. 
     * 
     * @param { number } factor the factor to zoom by. 
     */
    private zoom = (factor: number): void => this.zoomTo(transform(this.transformationMatrix(), scale(factor, factor)).a);

    /**
     * Zoom to a specific zoom level. 
     * 
     * @param { number } level the level to zoom to. 
     */
    private zoomTo = (level: number): void => {
        // Constrain the zoom amount
        const constrainedLevel = constrain(this.minZoomLevel(), level, this.maxZoomLevel());

        this.transformationMatrix.update((value) => {
            value.a = isNaN(level) ? value.a : Number(constrainedLevel);
            value.d = isNaN(level) ? value.d : Number(constrainedLevel);
            return value;
        });
        this.zoomLevel.set(this.transformationMatrix().a);
    }

    /**
     * Zoom to give the graph the best fit within the DOM dimensions.
     */
    private zoomToFit = (): void => {
        const widthZoom = this.DOMDimensions().w / this.graphDimensions.w;
        const heightZoom = this.DOMDimensions().h / this.graphDimensions.h;
        this.zoomTo(Math.min(heightZoom, widthZoom, 1));
    }

    //#endregion
}