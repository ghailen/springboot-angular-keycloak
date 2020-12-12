import {Injectable} from '@angular/core';
import {KeycloakInstance} from 'keycloak-js';
import {HttpClient} from '@angular/common/http';

/** on utilise var car keycloak js est une libraire js **/
declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class KeycloakSecurityService {
  public Kc!: KeycloakInstance;

  constructor() {
  }
/*
  public async init() {
    console.log('security initialisation...');
    this.Kc = new Keycloak({
      url: 'http://localhost:8080/auth',
      realm: 'ecom-realm',
      clientId: 'AngularProductsApp'
    });

    await this.Kc.init({
      // onLoad:'login-required'
      onLoad: 'check-sso',
    });
    console.log(this.Kc.token);
  }

 */

  init() {
    return new Promise((resolve, reject) => {
      console.log('INIT : Service keycloak security ');
      this.Kc = new Keycloak({
        url: 'http://localhost:8080/auth',
        realm: 'ecom-realm',
        clientId: 'AngularProductsApp'
      });
      this.Kc.init({
        // onLoad: 'login-required'
        onLoad: 'check-sso'
        // promiseType: 'native'

      }).then((authenticated) => {
         //console.log('authenticated', authenticated);
        // console.log('token: ', this.Kc.token);
        resolve({auth :authenticated, token: this.Kc.token})
      }).catch(err => {
        reject(err);
      });
    });

  }


  public isManager(): boolean {// @ts-ignore
    return this.Kc.hasResourceRole('data-manager');
  }

}
