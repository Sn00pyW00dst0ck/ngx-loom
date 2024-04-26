import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, Output, computed, input, signal } from "@angular/core";
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

    /**
     * The dimensions of the graph within the loom. Necessary because the graph will not be the same size as the DOM container.
     */
    private graphDimensions: { w: number, h: number } = { w: 0, h: 0 };


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
            // CALL PANNING FUNCTION
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

    //#endregion


    //#region Zooming

    //#endregion
}