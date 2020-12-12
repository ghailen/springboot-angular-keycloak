import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ApplicationRef, DoBootstrap, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProductsComponent} from './products/products.component';
import {SuppliersComponent} from './suppliers/suppliers.component';
import {KeycloakSecurityService} from './services/keycloak-security.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {RequestInterceptorService} from './services/request-interceptor.service';

/** 3malna provides bech i5ali service keycloack yetlanca 9bal application angular wi3ayat lel methiode init mel service keycloak
 * sous forme de promesse les prodviders c pour cela iraj3ou promesse
 * **/
/*
export function kcFactory(KcSecurity: KeycloakSecurityService) {
  return () => KcSecurity.init();

}*/

const keycloakSecurityService= new KeycloakSecurityService();
@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    SuppliersComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    {
      provide:KeycloakSecurityService, useValue: keycloakSecurityService
    },
   /* {
      provide: APP_INITIALIZER, deps: [KeycloakSecurityService], useFactory: kcFactory, multi: true
    },*/
    {
      provide: HTTP_INTERCEPTORS, useClass:RequestInterceptorService ,multi:true
    }

  ],
 // bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    keycloakSecurityService.init().then(data => {
      console.log('authenticated + token :', data);
      appRef.bootstrap(AppComponent);

    }).catch(err => {
      console.error('err', err);
    });
  }
}
