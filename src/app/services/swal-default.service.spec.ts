import { TestBed } from '@angular/core/testing';

import { SwalDefaultService } from './swal-default.service';

describe('SwalDefaultService', () => {
  let service: SwalDefaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwalDefaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
