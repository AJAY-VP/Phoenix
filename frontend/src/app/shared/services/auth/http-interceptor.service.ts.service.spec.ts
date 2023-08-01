import { TestBed } from '@angular/core/testing';

import { HttpInterceptorService } from './http-interceptor.service.ts.service';

describe('HttpInterceptorServiceTsService', () => {
  let service: HttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
