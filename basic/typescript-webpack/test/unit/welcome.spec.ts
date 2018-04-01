import {bootstrap} from 'aurelia-bootstrapper';
import {StageComponent} from 'aurelia-testing';
import {PLATFORM} from 'aurelia-pal';

describe('WelcomeComponent', () => {
  let component;

  beforeEach(async () => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('welcome'))
      .inView('<welcome></welcome>');
    await component.create(bootstrap);
  });

  it('should render first name', () => {
    const nameElement = document.querySelector('#fn') as HTMLInputElement;
    expect(nameElement.value).toBe('John');
  });

  afterEach(() => {
    component.dispose();
  });
});
