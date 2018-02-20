class EventBus {
    constructor() {
        this._events = {};
    }

    on(eventName, callback) {
        if (!eventName) {
            return;
        }

        this._events[eventName] = this._events[eventName] || [];
        this._events[eventName].push(callback);
    }
    emit(eventName, data) {
        if (!this._events[eventName]) {
            return;
        }

        this._events[eventName].forEach(callback => callback(data));
    }
}

module.exports = EventBus;
