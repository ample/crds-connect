import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LeaderResourcesUrl, GroupResourcesUrl } from '../../shared/constants';
import { ResourcesRedirectComponent } from './resources-redirect.component';
import { WindowService } from '../../services/window.service';

class windowServiceStub {
  public nativeWindow = { location: {href: ''} }
}

describe('Gathering component redirect error', () => {
  let fixture: ComponentFixture<ResourcesRedirectComponent>;
  let comp: ResourcesRedirectComponent;
  let mockWindowService = new windowServiceStub();
  let mockActivatedRoute = {
    snapshot: {
      params: { resourceType: 'leader' }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcesRedirectComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: WindowService, useValue: mockWindowService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ResourcesRedirectComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should redirect to leader resources', () => {
    comp.ngOnInit();
    expect(mockWindowService.nativeWindow.location.href).toBe(LeaderResourcesUrl)
  });

  it('should redirect to group resources', () => {
    mockActivatedRoute.snapshot.params.resourceType = 'group'
    comp.ngOnInit();
    expect(mockWindowService.nativeWindow.location.href).toBe(LeaderResourcesUrl)
  });
});
