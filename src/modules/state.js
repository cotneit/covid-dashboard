let objState;

export default class State {
  constructor(data, country, type) {
    if (objState) return objState;
    objState = this;
    this.subscribers = new Map();
    this.country = country;
    this.type = type;
    this.data = data;
  }

  subscribe(fn) {
    if (!this.subscribers.has(fn)) {
      this.subscribers.set(fn, fn);
      fn(this.data, this.country, this.type);
    }
  }

  unsubscribe(fn) {
    if (this.subscribers.has(fn)) this.delete(fn);
    // this.subscribers = this.subscribers.filter((subscriber) => subscriber !== fn);
  }

  update(data, country, type) {
    this.country = country;
    this.type = type;
    this.data = data;
    this.subscribers.forEach((subscriber) => subscriber(data, country, type));
  }
}
