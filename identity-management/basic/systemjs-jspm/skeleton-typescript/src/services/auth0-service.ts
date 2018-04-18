import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as auth0 from 'auth0-js';
import { AuthConfig } from './auth0-config';
import { StateManager } from './state-manager';

@autoinject
export class Auth0Service {

  public returnRoute: string;
  public eventAggregator: EventAggregator;
  public stateManager: StateManager;

  private router: Router;
  private auth0Service: Auth0Service;
  private auth0: auth0.WebAuth;
  private userProfile: any;
  private refreshSubscription: boolean;

  constructor(router: Router, eventAggregator: EventAggregator, stateManager: StateManager) {

    this.router = router;
    this.eventAggregator = eventAggregator;
    this.stateManager = stateManager;

    this.returnRoute = '';
    this.userProfile = null;
    this.refreshSubscription = false;

    this.auth0Service = this;

    this.auth0 = new auth0.WebAuth({
      clientID: AuthConfig.clientID,
      domain: AuthConfig.domain,
      responseType: 'token id_token',
      audience: AuthConfig.audience,
      redirectUri: AuthConfig.callbackURL
    });

  }

  public login() {
    //
    // The next call causes application's reset - the control
    // continues in handleAuthenticaton method below, invoked
    // from app.js attached() callback
    ///
    this.auth0.authorize({});
  }

  public logout() {
    this.stateManager.clearLocalStorage('full');
    //
    // Signal the navbar to change the name of the login route
    //
    this.eventAggregator.publish('authChannel', 'unauthenticated');

    this.router.navigate('home');
  }

  public handleAuthentication(): void {

    let auth0 = this.auth0;
    let auth0Service = this.auth0Service;
    let router = this.router;

    auth0.parseHash(<any> window.location.hash, (err: auth0.Auth0Error, authResult: auth0.Auth0DecodedHash) => {

      if (authResult && authResult.accessToken && authResult.idToken) {
        //
        // persist the settings we care about
        //        
        this.setSession(authResult);

        //
        // go to the page that triggered authentication
        //

        let returnRoute = localStorage.getItem('returnRoute');
        //
        // returnRoute == null indicate that it is null or undefined
        // indicating that this method is invoked by the user clicking on
        // login menubar item
        //
        if (returnRoute == null) {
          returnRoute = 'home';
        }
        localStorage.setItem('returnRoute', returnRoute);
        router.navigate(returnRoute);

        //
        // tell navbar to set the "logged in state" ui
        //        
        auth0Service.eventAggregator.publish('authChannel', 'authenticated');

      } else if (err) {
        //
        // TODO: better error handling
        //        
        // tslint:disable-next-line:no-console
        console.log(err);
      }
    });
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  public setSession(authResult): void {
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiration time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    if (expiresAt) {
      return new Date().getTime() < expiresAt;
    } else {
      return false;
    }
  }
}
