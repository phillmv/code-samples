import { autoinject } from 'aurelia-framework';
import { Auth0Service } from './services/auth0-service';

@autoinject
export class Callback {
  private authService: Auth0Service;

  constructor(auth0Service: Auth0Service) {
    this.authService = auth0Service;

    this.authService.handleAuthentication();
  }
}
