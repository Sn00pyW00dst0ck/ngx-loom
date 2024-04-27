import * as dagre from 'dagre';
import { Node, Edge } from "../interface/loom.interface";
import { Signal, WritableSignal, signal } from '@angular/core';

/**
 * Enum for options of how Dagre can orient the graph.
 */
export enum Orientation {
    LEFT_TO_RIGHT = 'LR',
    RIGHT_TO_LEFT = 'RL',
    TOP_TO_BOTTOM = 'TB',
    BOTTOM_TO_TOM = 'BT'
};

/**
 * Enum for options of how Dagre can align the graph.
 */
export enum Alignment {
    CENTER = 'C',
    UP_LEFT = 'UL',
    UP_RIGHT = 'UR',
    DOWN_LEFT = 'DL',
    DOWN_RIGHT = 'DR'
};

/**
 * The settings Dagre should use to construct the graph. 
 */
export interface DagreSettings {
    orientation?: Orientation;
    marginX?: number;
    marginY?: number;
    edgePadding?: number;
    rankPadding?: number;
    nodePadding?: number;
    align?: Alignment;
    acyclicer?: 'greedy' | undefined;
    ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
    multigraph?: boolean;
    compound?: boolean;
};

/**
 * 
 */
export class DagreLayout {
    defaultSettings: DagreSettings = {
        orientation: Orientation.LEFT_TO_RIGHT,
        marginX: 20,
        marginY: 20,
        edgePadding: 100,
        rankPadding: 100,
        nodePadding: 50,
        multigraph: true,
        compound: true
    };
    settings: DagreSettings = {};

    private dagreNodes: any;
    private dagreEdges: any;

    public run = (nodes: Node[], edges: Edge[]): WritableSignal<{ nodes: Node[], edges: Edge[] }> => {
        const dagreGraph = this.createDagreGraph(nodes, edges) as any;
        dagre.layout(dagreGraph);

        for (const dagreNodeId in dagreGraph._nodes) {
            const dagreNode = dagreGraph._nodes[dagreNodeId];
            const node = nodes.find(n => n.id === dagreNode.id)!;
            node.position = {
                x: dagreNode.x,
                y: dagreNode.y
            };
            node.dimension = {
                w: dagreNode.width,
                h: dagreNode.height
            };
        }

        return signal({ nodes, edges });
    };

    public updateEdge = (nodes: Node[], edges: Edge[], edge: Edge): WritableSignal<{ nodes: Node[], edges: Edge[] }> => {
        const sourceNode = nodes.find(n => n.id === edge.source)!;
        const targetNode = nodes.find(n => n.id === edge.target)!;

        // determine new arrow position
        const dir = sourceNode.position.y <= targetNode.position.y ? -1 : 1;
        const startingPoint = {
            x: sourceNode.position.x,
            y: sourceNode.position.y - dir * (sourceNode.dimension.h / 2)
        };
        const endingPoint = {
            x: targetNode.position.x,
            y: targetNode.position.y + dir * (targetNode.dimension.h / 2)
        };

        // generate new points
        edge.points = [startingPoint, endingPoint];
        return signal({ nodes, edges });
    };

    private createDagreGraph = (nodes: Node[], edges: Edge[]) => {
        const settings = Object.assign({}, this.defaultSettings, this.settings);
        const dagreGraph = new dagre.graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph }) as any;

        // Apply the settings
        dagreGraph.setGraph({
            rankdir: settings.orientation,
            marginx: settings.marginX,
            marginy: settings.marginY,
            edgesep: settings.edgePadding,
            ranksep: settings.rankPadding,
            nodesep: settings.nodePadding,
            align: settings.align,
            acyclicer: settings.acyclicer,
            ranker: settings.ranker,
            multigraph: settings.multigraph,
            compound: settings.compound
        });

        dagreGraph.setDefaultEdgeLabel(() => { });

        // update all dagre nodes
        this.dagreNodes = nodes.map(n => {
            const node: any = Object.assign({}, n);
            node.width = n.dimension.w || 20;
            node.height = n.dimension.h || 20;
            node.x = n.position.x;
            node.y = n.position.y;
            return node;
        });
        this.dagreNodes.forEach((n: any) => dagreGraph.setNode(n.id, n));

        // update all dagre edges
        this.dagreEdges = edges;
        this.dagreEdges.forEach((e: any) => {
            const args = settings.multigraph ? [e.source, e.target, e, e.id] : [e.source, e.target];
            dagreGraph.setEdge(...args);
        });

        return dagreGraph;
    }
};