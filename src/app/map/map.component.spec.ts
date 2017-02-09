import { MapComponent } from './map.component';

describe('Component: Map', () => {

  let fixture: MapComponent;

  beforeEach(() => {

    fixture = new MapComponent();
    fixture.ngOnInit();

  });

  describe('#ngOnInit', () => {
    it('should initialize the component', () => {
      expect(fixture).toBeTruthy();
    });
  });

});
