export class StateManager {
  
    constructor() {}
    
    isPageProtected() {
      let s = localStorage.getItem('secure');
      if (s === null || s === undefined) {
        return false;
      } else {
        return (s === 'secure');
      }
    }
  
    setPageProtected() {
      localStorage.setItem('secure', 'secure');
    }
  
    clearLocalStorage(mode) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      if (mode === 'full') {
        localStorage.removeItem('secure');
        localStorage.removeItem('returnRoute');
      }
    }
  }
