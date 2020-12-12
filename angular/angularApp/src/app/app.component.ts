import {Component, OnInit} from '@angular/core';
import {KeycloakSecurityService} from './services/keycloak-security.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(public securityService:KeycloakSecurityService) {
  }

profileName : any ;
  title = 'angularApp';

  ngOnInit(): void {
    this.profileName = this.securityService.Kc.tokenParsed;
  }

  onLogout(){
    this.securityService.Kc.logout();
  }

  onLogin()
  {
    this.securityService.Kc.login();
  }

  onChangePassword(){
    this.securityService.Kc.accountManagement() }

  isAppManager(){
   return this.securityService.Kc.hasRealmRole('app-manager');
  }
}
