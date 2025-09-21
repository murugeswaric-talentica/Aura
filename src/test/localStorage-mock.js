// Custom mock for local storage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

// Set up localStorage mock before tests
const setupLocalStorageMock = () => {
  Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
    writable: true
  });
};

export { setupLocalStorageMock, LocalStorageMock };