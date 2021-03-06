import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponentComponent } from "./home-component/home-component.component";
import { AboutComponentComponent } from "./about-component/about-component.component";
import { ContactComponentComponent } from "./contact-component/contact-component.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
const routes = [
    { path: "about", component: AboutComponentComponent },
    { path: "contact", component: ContactComponentComponent, data: { title: 'Contact' } },
    { path: "home", component: HomeComponentComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map