// URLModel will only hold the data and basic getters/setters.
class URLModel {
    constructor() {
      this.urlDatabase = new Map();
    }
  
    getDatabase() {
      return this.urlDatabase;
    }
  }
  
  export default new URLModel();
  