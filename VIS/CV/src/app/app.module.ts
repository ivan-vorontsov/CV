import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';

import { ModelModule } from "./models/model.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ModelModule
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/Home/Admin' }],
    bootstrap: [AppComponent]
})
export class AppModule { }
