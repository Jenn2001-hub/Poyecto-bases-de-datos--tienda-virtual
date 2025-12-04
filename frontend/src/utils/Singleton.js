class AppConfig {
  constructor() {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }

    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    this.theme = 'light';
    this.currency = 'USD';
    this.maxItemsPerPage = 10;

    AppConfig.instance = this;
  }

  setTheme(theme) {
    this.theme = theme;
  }

  setCurrency(currency) {
    this.currency = currency;
  }
}

const instance = new AppConfig();
Object.freeze(instance);

export default instance;