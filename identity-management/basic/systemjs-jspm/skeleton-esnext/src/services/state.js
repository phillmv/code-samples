import { inject } from 'aurelia-framework';
import { Auth0Service } from './auth0-service';

@inject(Auth0Service)
export class State {

  constructor(auth0Service) {
    this.authService = auth0Service;
    this.showState();
  }

  showState() {
    console.log('Authenticated: ' + this.authService.isAuthenticated());
    console.log('access_token: ' + localStorage.getItem('access_token'));
    console.log('id_token: ' + localStorage.getItem('expires_at'));
    console.log('return route: ', localStorage.getItem('returnRoute'));
    console.log('secure page: ', localStorage.getItem('secure'));
  }  
}
