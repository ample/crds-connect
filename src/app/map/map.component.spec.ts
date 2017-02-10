import { LocationService } from '../services/location.service';
import { MapComponent } from './map.component';


describe('Component: Map', () => {

  let fixture: MapComponent;
  let locationService = LocationService;

  beforeEach(() => {

    fixture = new MapComponent(locationService);
    fixture.ngOnInit();

  });

  describe('#ngOnInit', () => {
    it('should initialize the component', () => {
      expect(fixture).toBeTruthy();
    });
  });

});
