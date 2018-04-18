import { inject } from 'aurelia-framework';
import { RedirectToRoute } from 'aurelia-router';
import { Auth0Service } from './services/auth0-service';

@inject(Auth0Service)
export class App {

  constructor(auth0Service) {
    this.authService = auth0Service;
  }

  configureRouter(config, router) {
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
      nav: true,
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

  attached() {
    let mode = 'full';
    //
    // At this point, the application is completely loaded (after the reset) 
    // so getting the results of the authenication is meaningful
    //
    if (this.authService.isAuthenticated()) {
      //
      // This is the case where the user clicked on the protected page and
      // the app was reloaded (knowing that it is indeed authenticated already)
      //
      this.authService.eventAggregator.publish('authChannel', 'authenticated');
    } else {
      //
      // Making the decision which of the persistence flags need to be still preserved
      //
      let securePage = this.authService.stateManager.isPageProtected();
      if (securePage) {
        mode = 'partial';
      }
      this.authService.stateManager.clearLocalStorage(mode);
      this.authService.handleAuthentication();
    }
  }
}

class AuthorizeStep {
  constructor(auth0Service) {
    this.service = auth0Service;
  }

  run(navigationInstruction, next) {
    let allInstructions = navigationInstruction.getAllInstructions();
    for (let value of allInstructions) {
      if (value.config.settings) {
        if (value.config.settings.auth) {
          if (!this.service.isAuthenticated()) {
            //
            // Mark this route as secure (page needs authentication to be accessed)
            // and persist the route name across application reload
            ///
            localStorage.setItem('secure', 'secure');
            localStorage.setItem('returnRoute', navigationInstruction.config.name);
            return next.cancel(new RedirectToRoute('login'));
          }
        }
      }
    }

    return next();
  }

}
