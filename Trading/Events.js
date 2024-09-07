// @ts-check

class EventListener{
  /**
   * @param {(args: Object) => void} func 
   */
  constructor(func) {
    this.func = func;
  }

  /**
   * @param {Object[]} args 
   */
  notify(args) {
    this.func(args);
  }
}

class EventEmitter{
  /** @type {EventListener[]} */
  #listeners;
  constructor() {
    this.#listeners = [];
  }

  /**
   * @param {EventListener} newListener 
   */
  registerListener(newListener) {
    this.#listeners.push(newListener);
  } 

  /**
   * @param {Object} args 
   */
  notify(args){
    for (const listener of this.#listeners) {
      try{
      listener.notify(args);
      } catch(err) {
        console.error("Failed notifying listener.", err.message);
      }
    }
  }
}

export { EventEmitter, EventListener };