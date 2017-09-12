import { TestBed, inject } from '@angular/core/testing';
import { MiscellaneousService } from './miscellaneous-service';

describe('Service: MiscellaneousService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MiscellaneousService
      ]
    });
  });

  it('should create a service instance', inject([MiscellaneousService], (service: any) => {
    expect(service).toBeTruthy();
  }));

});
