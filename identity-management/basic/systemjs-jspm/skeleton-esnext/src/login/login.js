import { inject } from 'aurelia-framework';
import { Auth0Service } from '../services/auth0-service';

@inject(Auth0Service)
export class Login {

  constructor(auth0Service) {
    this.auth0Service = auth0Service;

    if (this.auth0Service.isAuthenticated()) {
      // The user just logged out (remember the Login navbar item is a toggle)
      // so the cleanout actions are all here.
      //
      this.auth0Service.logout();
    } else {
      this.auth0Service.login();
    }    
  }
}
