import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLoomComponent } from './ngx-loom.component';

describe('NgxLoomComponent', () => {
  let component: NgxLoomComponent;
  let fixture: ComponentFixture<NgxLoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxLoomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxLoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
