import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {KeycloakSecurityService} from './keycloak-security.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http:HttpClient,private securityService:KeycloakSecurityService) { }

  public getSuppliers(){

    return this.http.get("http://localhost:8083/suppliers"
      /*{headers:new HttpHeaders({Authorization:'Bearer '+this.securityService.Kc.token})}*/);
  }

 /*public getSuppliers() {
    return this.http.get('http://localhost:8083/suppliers');
  }*/

}
