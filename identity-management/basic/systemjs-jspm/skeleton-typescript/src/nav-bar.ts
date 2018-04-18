import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class NavBar {

  private router: Router;
  private eventAggregator: EventAggregator;
  private navbar: NavBar;

  constructor(eventAggregator: EventAggregator, router: Router) {
    this.eventAggregator = eventAggregator;
    this.router = router;
    this.navbar = this;

    this.startSubscriber();
  }

  public startSubscriber(): void {
    let navbar = this.navbar;

    this.eventAggregator.subscribe('authChannel', function (message) {
      let routes = navbar.router.routes;
      for (let r in routes) {
        if (routes.hasOwnProperty(r)) {
          let route = routes[r];

          //
          // Set the state defined title of the navbar's login/logout item
          //
          let itemTitle = 'Login';
          if (route.name === 'login') {
            if (message === 'authenticated') {
                itemTitle = 'Logout';
            }
            route.navModel.title = itemTitle;
          }
        }
      }
    });
  }
}
