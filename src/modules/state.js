let objState;

export default class State {
  constructor(data, country, type, show) {
    if (objState) return objState;
    objState = this;
    this.subscribers = new Map();
    this.data = data;
    this.country = country;
    this.type = type;
    this.show = show;
  }

  subscribe(name, fn) {
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, fn);
      fn(this.data, this.country, this.type, this.show);
    }
  }

  unsubscribe(name) {
    if (this.subscribers.has(name)) this.subscribers.delete(name);
  }

  update(data, country, type, show) {
    this.country = country;
    this.type = type;
    this.data = data;
    this.show = show;
    this.subscribers.forEach((subscriber) => subscriber(data, country, type, show));
  }

  updateWithout(name, data, country, type, show) {
    this.country = country;
    this.type = type;
    this.data = data;
    this.show = show;
    this.subscribers.forEach((subscriber, subscriberName) => {
      if (subscriberName !== name) subscriber(data, country, type, show);
    });
  }

  getType() {
    return this.type;
  }

  getShow() {
    return this.show;
  }
}
