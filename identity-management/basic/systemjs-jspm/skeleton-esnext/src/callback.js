import { inject } from 'aurelia-framework';
import { Auth0Service } from './services/auth0-service';

@inject(Auth0Service)
export class Callback {

  constructor(auth0Service) {
    this.Service = auth0Service;
  }
}
