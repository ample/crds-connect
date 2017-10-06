import { environment } from '../environments/environment';

export class FinderContentBlockConfig {
  public endpoint: string = environment.CRDS_CMS_CLIENT_ENDPOINT;
  public categories: Array<string> = ['finder', 'group tool'];
  constructor() {}
}
