// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  crdsEnv: 'local',
  CRDS_GATEWAY_CLIENT_ENDPOINT: 'https://gatewayint.crossroads.net/gateway/',
  CRDS_ENV: 'local',
  CRDS_COOKIE_DOMAIN: 'localhost',
  apiEndpoint: 'https://gatewayint.crossroads.net/gateway/',
  crdsEndpoint: 'https://contentint.crossroads.net/',
  googleApiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs',
  crossroadsApiKey: '',
  CRDS_SERVICES_CLIENT_ENDPOINT: 'https://gatewayint.crossroads.net/',
  CRDS_CMS_CLIENT_ENDPOINT: 'https://contentint.crossroads.net/'
};
