# CrdsConnect

## Development server

Run `npm run start` (`npm start` or `npm run serve`) for a dev server. The app will automatically reload if you change any of the source files.

## Environment Variables

Copy the `.env.example` file to `.env` and adjust the environment variables to suit your environment.

You can also set the matching keyname values in your OS environment variables if you prefer.

## Build

Run the following commands for your environment. The build artifacts will be stored in the `dist/` directory.

- Build Dev: `npm run build-dev` (locally build for compile testing)
- Build for INT: `npm run build-int` (special NON-ugglified [but still cache busted] config for INT builds)
- Build for PROD: `npm run build` (ugglified & cache busted)

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Parameters

Query parameters are used to define the several initial values.  
* `theme` - string - optional [light, dark] Will load the specified theme. If none specified, light theme is automatically used.

An example `http://localhost:8080?type=payment&min_payment=123&invoice_id=1234&total_cost=1234`

## Apache configuration

For additional apache configurations, please modify the `apache_site.conf` file in the root of this repository.