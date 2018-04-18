export class StateManager {

  public isPageProtected(): Boolean {
    let s = localStorage.getItem('secure');
    if (s === null || s === undefined ) {
      return false;
    } else {
      return (s === 'secure');
    }
  }

  public setPageProtected(): void {
    localStorage.setItem('secure', 'secure');
  }

  public clearLocalStorage(mode: string): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    if (mode === 'full') {
      localStorage.removeItem('secure');
      localStorage.removeItem('returnRoute');
    }
  }
}
