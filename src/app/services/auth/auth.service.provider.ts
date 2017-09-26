import ReactiveAuth from 'crds-reactive-auth/src';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

const authServiceFactory = () => {
  const reactiveAuth = new ReactiveAuth(`${environment.crdsEnv}sessionId`);
  return new AuthService(reactiveAuth);
};

export default authServiceFactory;
