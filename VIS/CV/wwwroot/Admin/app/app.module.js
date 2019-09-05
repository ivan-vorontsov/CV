import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
import { ModelModule } from "./models/model.module";
import { HomeComponentComponent } from './home-component/home-component.component';
import { AboutComponentComponent } from './about-component/about-component.component';
import { ContactComponentComponent } from './contact-component/contact-component.component';
import { NavigationComponent } from './navigation/navigation.component';
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    NgModule({
        declarations: [
            AppComponent,
            HomeComponentComponent,
            AboutComponentComponent,
            ContactComponentComponent,
            NavigationComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            ModelModule
        ],
        providers: [{ provide: APP_BASE_HREF, useValue: '/Home/Admin' }],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map