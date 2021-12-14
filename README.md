additional component UI library {

    https://www.primefaces.org/primeng/#/calendar
}

charts {
    https://valor-software.com/ng2-charts/#/LineChart

    https://stackblitz.com/edit/ng2-charts-pie-template
    https://stackblitz.com/edit/ng2-charts-bar-template
    https://stackblitz.com/edit/ng2-charts-doughnut-template
    https://stackblitz.com/edit/ng2-charts-doughnut-centertext


    https://stackblitz.com/edit/ng2-charts-line-template?file=src%2Fapp%2Fapp.component.ts  lineTension: 0, fill
}



https://spring.io/guides/tutorials/spring-security-and-angular-js/


https://www.npmjs.com/package/angular-osm
https://www.npmjs.com/package/ol

https://openlayers.org/en/v5.3.0/examples/
https://openlayers.org/en/latest/examples/feature-move-animation.html


ng serve --host 0.0.0.0 --proxy-config proxy.conf.json
ng generate module components/partner --route partner --module app.module

# GdUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.19.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

npm run build:ssr - build the project

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


{
TODO create with another outlet
    another outlet example

    put 
<a value="click to activate aux route" type="button" 
        [routerLink]="[{outlets: {'right-bottom-section':  ['customer-area']}}]">
    check!
</a>
    in partner.component.html

    put 
{
  path: 'customer-area',
  outlet: 'right-bottom-section',
  component: CustomerAreaComponent
}
    in partner-routing.module.ts

    put in partner.component.html
<router-outlet name="right-bottom-section"></router-outlet>
}
