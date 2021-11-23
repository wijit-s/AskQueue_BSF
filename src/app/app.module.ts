import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/component/login/login.component';
import { HeaderComponent } from './core/component/header/header.component';
import { FooterComponent } from './core/component/footer/footer.component';
import { SidebarComponent } from './core/component/sidebar/sidebar.component';

import { MainboardComponent } from './core/component/mainboard/mainboard.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { FardashboardComponent } from './core/component/fardashboard/fardashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MainboardComponent,
    SidebarComponent,
    FardashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    BarcodeScannerLivestreamModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }