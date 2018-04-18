import { autoinject } from 'aurelia-framework';
import { RedirectToRoute } from 'aurelia-router';
import { Auth0Service } from './auth0-service';

@autoinject
export class AuthorizeStep {
  private authService: Auth0Service;

  constructor(auth0Service: Auth0Service) {
    this.authService = auth0Service;
  }

  protected run(navigationInstruction, next) {
    let allInstructions = navigationInstruction.getAllInstructions();
    for (let value of allInstructions) {
      if (value.config.settings) {
        if (value.config.settings.auth) {
          if (!this.authService.isAuthenticated()) {
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
