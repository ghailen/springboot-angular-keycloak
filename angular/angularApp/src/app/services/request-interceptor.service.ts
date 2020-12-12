import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {KeycloakSecurityService} from './keycloak-security.service';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor {

  constructor(private securityService: KeycloakSecurityService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request Http interceptor');
    if (!this.securityService.Kc.authenticated) {
      return next.handle(req);
    }
    let request = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.securityService.Kc.token
      }
    });
    return next.handle(request);
  }
}
