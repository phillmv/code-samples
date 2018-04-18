import { NavBar } from './nav-bar';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Auth0Service } from './services/auth0-service';
import { AuthorizeStep } from './services/authorizeStep';

@autoinject
export class App {

  private authService: Auth0Service;
  private router: Router;

  constructor(auth0Service: Auth0Service) {
    this.authService = auth0Service;
  }

  public configureRouter(config, router) {

    let step = new AuthorizeStep(this.authService);
    config.addAuthorizeStep(step);

    config.title = 'Aurelia-Auth0';

    config.map([{
      route: ['', 'welcome'],
      name: 'welcome',
      moduleId: 'home/welcome',
      nav: true,
      title: 'Welcome',
      settings: { auth: false, align: 'left' }
    },

    {
      route: 'state',
      name: 'state',
      moduleId: 'services/state',
      nav: false,
      title: 'App state',
      settings: { auth: false, align: 'left' }
    },

    {
      route: 'users',
      name: 'users',
      moduleId: 'github/users',
      nav: true,
      title: 'Github Users',
      settings: { auth: true, align: 'left' }
    },

    {
      route: 'login',
      name: 'login',
      moduleId: 'login/login',
      nav: true,
      title: 'Login',
      settings: { auth: false, align: 'right' }
    },

    {
      route: 'callback',
      name: 'callback',
      moduleId: 'callback'
    }
    ]);

    config.mapUnknownRoutes('home/welcome');

    this.router = router;
  }

  public attached() {
    let mode = 'full';
    //
    // At this point, the application is completely loaded so getting the results
    // of the authenication is meaningful
    //
    if (this.authService.isAuthenticated()) {
      this.authService.eventAggregator.publish('authChannel', 'authenticated');
    } else {
      let securePage: Boolean = this.authService.stateManager.isPageProtected();
      if (securePage) {
        mode = 'partial';
      }
      this.authService.stateManager.clearLocalStorage(mode);
      this.authService.handleAuthentication();
    }
  }
}
