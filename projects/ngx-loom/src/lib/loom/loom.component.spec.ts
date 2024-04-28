import { TestBed } from '@angular/core/testing';
import { LoomComponent } from './loom.component';
import { Node, Edge } from "../interface/loom.interface";
import { DagreLayout } from '../layouts/dagre.layout';

const testNodes: Node[] = [new Node(), new Node(), new Node()];
const testEdges: Edge[] = (() => {
    let edges = [new Edge(), new Edge()];
    edges[0].source = testNodes[0].id;
    edges[0].target = testNodes[1].id;
    edges[1].source = testNodes[1].id;
    edges[1].target = testNodes[2].id;
    return edges;
})();

describe('LoomComponent', () => {
    let component: LoomComponent;
    let fixture: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoomComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoomComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('DOMDimensions', { w: 500, h: 500 });
        fixture.componentRef.setInput('nodes', testNodes);
        fixture.componentRef.setInput('edges', testEdges);
        fixture.componentRef.setInput('layout', new DagreLayout());
        fixture.detectChanges();
    })

    it('should create the LoomComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should recalculate the graph layout when key inputs change', () => {
        // Using 'as any' to bypass method's private restriction
        spyOn(component as any, 'recalculateGraphLayout');
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(0);

        fixture.componentRef.setInput('DOMDimensions', { w: 600, h: 600 });
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(1);

        fixture.componentRef.setInput('nodes', [...testNodes, new Node()]);
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(2);

        fixture.componentRef.setInput('edges', [...testEdges]);
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(3);

        fixture.componentRef.setInput('layout', new DagreLayout());
        fixture.detectChanges();
        expect((component as any).recalculateGraphLayout).toHaveBeenCalledTimes(4);
    });

    it('should emit the correct node when clicked', () => {
        spyOn(component.nodeClicked, 'emit');
        fixture.detectChanges()

        const expectedNode = (component as any).graphUpdate().nodes[1];

        fixture.whenStable().then(() => {
            const DOMElement = fixture.nativeElement.querySelector(`#${expectedNode.id}`);
            expect(DOMElement).toBeTruthy();
            DOMElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(component.nodeClicked.emit).toHaveBeenCalledWith({ event: jasmine.any(MouseEvent), node: expectedNode });
        });
    });

    it('should emit the correct edge when clicked', () => {
        spyOn(component.edgeClicked, 'emit');
        fixture.detectChanges()

        const expectedEdge = (component as any).graphUpdate().edges[0];

        fixture.whenStable().then(() => {
            const DOMElement = fixture.nativeElement.querySelector(`#${expectedEdge.id}`);
            expect(DOMElement).toBeTruthy();
            DOMElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(component.edgeClicked.emit).toHaveBeenCalledWith({ event: jasmine.any(MouseEvent), edge: expectedEdge });
        });
    });
});
