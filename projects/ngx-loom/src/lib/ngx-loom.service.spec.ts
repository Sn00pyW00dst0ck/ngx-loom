import { TestBed } from '@angular/core/testing';

import { NgxLoomService } from './ngx-loom.service';

describe('NgxLoomService', () => {
  let service: NgxLoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxLoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
