import { TestBed } from '@angular/core/testing';
import { LoomComponent } from './loom.component';
import { Node, Edge } from "../interface/loom.interface";
import { DagreLayout } from '../layouts/dagre.layout';

const testNodes: Node[] = [];
const testEdges: Edge[] = [];

describe('LoomComponent', () => {
    let component: LoomComponent;
    let fixture: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoomComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoomComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('DOMDimensions', { w: 500, h: 500 });
        fixture.componentRef.setInput('nodes', testNodes);
        fixture.componentRef.setInput('edges', testEdges);
        fixture.componentRef.setInput('layout', new DagreLayout());
        fixture.detectChanges();
    });

    it('should create the LoomComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should recalculate the graph layout when key inputs change', () => {
        spyOn(component as any, 'recalculateGraphLayout');
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(1);

        fixture.componentRef.setInput('DOMDimensions', { w: 600, h: 600 });
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(2);

        fixture.componentRef.setInput('nodes', [...testNodes, new Node()]);
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(3);

        fixture.componentRef.setInput('edges', [...testEdges]);
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(4);

        fixture.componentRef.setInput('layout', new DagreLayout());
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(5);
    });

    //it('', () => {
    //
    //});
});
