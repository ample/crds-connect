import { LoginRedirectService } from './login-redirect.service';
import { Router } from '@angular/router';

describe('LoginRedirectService', () => {
  let fixture: LoginRedirectService;
  let router: Router;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    fixture = new LoginRedirectService(router);
  });

  describe('#redirectToLogin', () => {
    it('should store a default target and navigate to login page', () => {
      fixture.redirectToLogin();
      expect(fixture['originalTarget']).toEqual('/host-signup');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/signin');
    });

    it('should store the specified target and navigate to login page', () => {
      fixture.redirectToLogin('/some/protected/page');
      expect(fixture['originalTarget']).toEqual('/some/protected/page');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/signin');
    });
  });

  describe('#redirectToTarget', () => {
    it('should navigate to original target if there is one', () => {
      fixture['originalTarget'] = '/some/protected/page';
      fixture.redirectToTarget('/dont/go/here');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/some/protected/page', { skipLocationChange: true });
    });

    it('should navigate to default if no original target or specified target', () => {
      fixture['originalTarget'] = undefined;
      fixture.redirectToTarget();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/host-signup');
    });

    it('should navigate to specified target if no original target', () => {
      fixture['originalTarget'] = undefined;
      fixture.redirectToTarget('/go/here');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/go/here');
    });

  });
});
