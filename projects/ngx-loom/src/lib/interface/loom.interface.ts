import { WritableSignal } from "@angular/core";
import { nanoid } from "nanoid"

/**
 * Represents a node within the graph structure. 
 */
export class Node {
    /**
     * A unique id, generated by nanoid(), used to differentiate this node from others.
     */
    public id: string = nanoid();
    /**
     * The x and y position for this node. 
     */
    public position: { x: number, y: number } = { x: 0, y: 0 };
    /**
     * The width and height for this node. 
     */
    public dimension: { w: number, h: number } = { w: 20, h: 20 };
    /**
     * The text label for this node. 
     */
    public label: string = "";
};

/**
 * Represents a directed edge within the graph structure.
 */
export class Edge {
    /**
     * A unique id, generated by nanoid(), used to differentiate this edge from others.
     */
    public id: string = nanoid();
    /**
     * The id of the node this edge starts from.
     */
    public source: string = "";
    /**
     * The id of the node this edge ends at.
     */
    public target: string = "";
    /**
     * The text label for this edge.
     */
    public label: string = "";

    public line: any;
    public textPath: any;
    public points: { x: number, y: number }[] = [];
};

/**
 * The interface for a 'Layout' which is used by the GraphComponent to actually render the graph.
 */
export interface Layout {
    /**
     * The settings for the layout.
     */
    settings?: any;

    /**
     *
     * @param graph
     */
    run(nodes: Node[], edges: Edge[]): WritableSignal<{ nodes: Node[], edges: Edge[] }>;

    /**
     *
     * @param graph
     * @param edge
     */
    updateEdge(nodes: Node[], edges: Edge[], edge: Edge): WritableSignal<{ nodes: Node[], edges: Edge[] }>;
};


/**
 * 
 */
export interface Matrix {
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
};