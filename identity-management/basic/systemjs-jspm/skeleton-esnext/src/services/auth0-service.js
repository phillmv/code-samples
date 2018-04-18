import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import auth0 from 'auth0-js';
import { AuthConfig } from './auth0-config';
import { StateManager } from './state-manager';


@inject(Router, EventAggregator, StateManager)
export class Auth0Service {

  constructor(router, eventAggregator, stateManager) {
    this.router = router;
    this.eventAggregator = eventAggregator;
    this.stateManager = stateManager;
    this.returnRoute = '';
    this.userProfile;
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

  login() {
    //
    // The next call causes application's reset - the control
    // continues in handleAuthenticaton method below, invoked
    // from app.js attached() callback
    ///
    this.auth0.authorize();
  }

  logout() {
    this.stateManager.clearLocalStorage('full');
    //
    // Signal the navbar to change the name of the login route
    //
    this.eventAggregator.publish('authChannel', 'unauthenticated');

    this.router.navigate('home');
  }

  handleAuthentication() {
    let auth0Service = this.auth0Service;

    this.auth0.parseHash(window.location.hash, (err, authResult) => {
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
        this.router.navigate(returnRoute);

        //
        // tell navbar to set the "logged in state" ui
        //
        auth0Service.eventAggregator.publish('authChannel', 'authenticated');
      } else if (err) {
        //
        // TODO: better error handling
        //
        console.log(err);
      }
    });
  }

  getProfile(cb) {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0Service.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  setSession(authResult) {
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    console.log('id_token:   ' + authResult.idToken);
    console.log('access_token: ' + authResult.accessToken);
    console.log('expires_at', expiresAt);
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiration time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
