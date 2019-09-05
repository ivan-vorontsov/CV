import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponentComponent } from "./home-component/home-component.component";
import { AboutComponentComponent } from "./about-component/about-component.component";
import { ContactComponentComponent } from "./contact-component/contact-component.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

const routes: Routes = [
    { path: "about", component: AboutComponentComponent },
    { path: "contact", component: ContactComponentComponent, data: { title: 'Contact' } },
    { path: "home", component: HomeComponentComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
