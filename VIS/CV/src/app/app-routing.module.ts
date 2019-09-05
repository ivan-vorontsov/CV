import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponentComponent } from "./home-component/home-component.component";
import { AboutComponentComponent } from "./about-component/about-component.component";
import { ContactComponentComponent } from "./contact-component/contact-component.component";

const routes: Routes = [
    { path: "about", component: AboutComponentComponent },
    { path: "contact", component: ContactComponentComponent },
    { path: "", component: HomeComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
