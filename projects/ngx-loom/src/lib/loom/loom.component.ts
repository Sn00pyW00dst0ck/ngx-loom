import { CommonModule } from "@angular/common";
import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Output, QueryList, TemplateRef, ViewChildren, computed, input, signal } from "@angular/core";
import { Node, Edge, Matrix } from "../interface/loom.interface";
import { identity, scale, smoothMatrix, toSVG, transform, translate } from 'transformation-matrix';


/**
 * The loom component.
 */
@Component({
    selector: 'loom',
    standalone: true,
    imports: [CommonModule],
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


    protected zoomLevel = signal<number>(1);


    /**
     * The dimensions of the graph within the loom. Necessary because the graph will not be the same size as the DOM container.
     */
    private graphDimensions: { w: number, h: number } = { w: 0, h: 0 };

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
    @Output() graphPanned = new EventEmitter<void>();
    /**
     * 
     */
    @Output() graphZoomed = new EventEmitter<void>();


    /**
     * 
     */
    constructor() {
        // TODO: Setup a bunch of effects here...
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
     * 
     * @param factor 
     */
    private zoom = (factor: number): void => {

    }

    /**
     * 
     * @param level 
     */
    private zoomTo = (level: number): void => {

    }

    /**
     * 
     */
    private zoomToFit = (): void => {

    }

    //#endregion
}