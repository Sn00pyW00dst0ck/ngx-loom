import { CommonModule } from "@angular/common";
import { Component, computed, input, signal } from "@angular/core";
import { Node, Edge, Matrix } from "../interface/loom.interface";
import { identity, scale, smoothMatrix, toSVG, transform, translate } from 'transformation-matrix';


/**
 * The loom component.
 */
@Component({
    selector: 'graph',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loom.component.html',
    styleUrl: './loom.component.sass',
})
export class LoomComponent {
    /**
     * The dimensions for the loom component.
     */
    public dimensions = input.required<{ w: number, h: number }>();

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
     * 
     */
    constructor() {

    }


    //#region Panning

    //#endregion


    //#region Zooming

    //#endregion
}