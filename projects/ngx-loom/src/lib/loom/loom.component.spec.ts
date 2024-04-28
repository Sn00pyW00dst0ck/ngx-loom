import { TestBed } from '@angular/core/testing';
import { LoomComponent } from './loom.component';

describe('LoomComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoomComponent],
        }).compileComponents();
    });

    it('should create the LoomComponent', () => {
        const fixture = TestBed.createComponent(LoomComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

});
