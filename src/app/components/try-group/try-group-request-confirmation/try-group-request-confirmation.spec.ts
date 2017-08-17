let fixture: ComponentFixture<TryGroupRequestConfirmationComponent>;
let comp: TryGroupRequestConfirmationComponent;
let mockRouter;
let route;

describe('try-group-request-confirmation.component', () => {
  beforeEach(() => {
    mockRouter = {
      url: '/small-group/1234', routerState:
      { snapshot: { url: '/small-group/1234' } }, navigate: jasmine.createSpy('navigate')
    };

    route = new ActivatedRoute();
    route.snapshot = new ActivatedRouteSnapshot();
    route.snapshot.params = { groupId: '1234' };

    TestBed.configureTestingModule({
      declarations: [
        TryGroupRequestConfirmationComponent,
      ],
      imports: [],
      providers: [
        { provide: Router, useValue: mockRouter},
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { groupId: 1234 } } }, // this passes
          // useValue: route, // this fails?
         },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TryGroupRequestConfirmationComponent);
      comp = fixture.componentInstance;
    });
  }));


  it('Submits', () => {
    const baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;
    const groupId = 12345;

    const mockBackend = $httpBackend.when('POST', `${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`).respond(200);

    $httpBackend.expectPost(`${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`, groupId);
    $httpBackend.flush();

    expect(this.router.navigate).toHaveBeenCalledWith([`/try-group-request-success/${this.groupId}`]);
  });

  it('Handles submission errors', () => {
    // 409 Error:
    const mockBackend = $httpBackend.when('POST', `${this.baseUrl}api/v1.0.0/finder/pin/tryagroup`)
    .respond(409);
    expect(comp.errorMessage).toEqual('tryGroupRequestAlreadyRequestedFailureMessage');

    // Other Error:
    mockBackend.respond(400);
    expect(comp.errorMessage).toEqual('tryGroupRequestGeneralFailureMessage');
  });

  it('Navigates "back" when close ("x") is clicked', () => {
    comp.onClose();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('Navigates "back" when cancel is clicked', () => {
    comp.onCancel();
    expect(window.history.back).toHaveBeenCalled();
  });
});
