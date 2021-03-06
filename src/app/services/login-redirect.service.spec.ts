import { LoginRedirectService } from './login-redirect.service';
import { Router } from '@angular/router';

describe('LoginRedirectService', () => {
  let fixture: LoginRedirectService;
  let router: Router;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('router', ['navigate', 'navigateByUrl']);
    fixture = new LoginRedirectService(router);
  });

  describe('#redirectToLogin', () => {
    it('should store a default target and navigate to login page', () => {
      fixture.redirectToLogin();
      expect(fixture['originalTarget']).toEqual('');
      expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    });

    it('should store the specified target and navigate to login page', () => {
      fixture.redirectToLogin('/some/protected/page');
      expect(fixture['originalTarget']).toEqual('/some/protected/page');
      expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });

  describe('#redirectToTarget', () => {
    it('should navigate to original target if there is one', () => {
      fixture['originalTarget'] = '/some/protected/page';
      fixture.redirectToTarget('/dont/go/here');
      expect(router.navigate).toHaveBeenCalledWith(['/some/protected/page'], { replaceUrl: true });
    });

    it('should navigate to default if no original target or specified target', () => {
      fixture['originalTarget'] = undefined;
      fixture.redirectToTarget();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('should navigate to specified target if no original target', () => {
      fixture['originalTarget'] = undefined;
      fixture.redirectToTarget('/go/here');
      expect(router.navigate).toHaveBeenCalledWith(['/go/here']);
    });

    it('should navigate to origin target if redirect cancelled', () => {
      fixture['origin'] = '/hi/there';
      fixture.cancelRedirect();
      expect(router.navigate).toHaveBeenCalledWith(['/hi/there']);
    });

    it('should navigate to default authenticated route if redirect is cancelled and origin is not set', () => {
      fixture['DefaultAuthenticatedRoute'] = 'woo';
      fixture.cancelRedirect();
      expect(router.navigate).toHaveBeenCalledWith(['woo']);
    });


  });
});
