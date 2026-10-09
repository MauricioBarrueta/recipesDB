import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator'
import { provideAnimations } from '@angular/platform-browser/animations';


@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        PagesModule,
        MatPaginatorModule,
        BrowserModule], providers: [
        provideClientHydration(),
        provideAnimations() // Angular Material Animations
        ,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
