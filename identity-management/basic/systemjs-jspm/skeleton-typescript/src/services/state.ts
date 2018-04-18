import { autoinject } from 'aurelia-framework';
import { Auth0Service } from './auth0-service';

@autoinject
export class State {
  private authService: Auth0Service;

  constructor(authService: Auth0Service) {
    this.authService = authService;
    this.showState();
  }

  public showState(): void {
    console.log('Authenticated: ' + this.authService.isAuthenticated());
    console.log('access_token: ' + localStorage.getItem('access_token'));
    console.log('id_token: ' + localStorage.getItem('expires_at'));
    console.log('return route: ', localStorage.getItem('returnRoute'));
    console.log('secure page: ', localStorage.getItem('secure'));
  }
}
