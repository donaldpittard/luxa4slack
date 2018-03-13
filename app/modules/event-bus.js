/**
 * This class manages events for the application. The user may
 * subscribe to events and emit events using this class.
 */
class EventBus {
    constructor() {
        this._events = {};
    }

    /**
     * This method allows the user to subscribe to an event and set a callback
     * to perform when the event is emitted.
     * @param string eventName
     * @param function callback
     */
    on(eventName, callback) {
        if (!eventName) {
            return;
        }

        this._events[eventName] = this._events[eventName] || [];
        this._events[eventName].push(callback);
    }

    /**
     * This method allows you to unsubscribe from an event.
     * @param string eventName
     * @param function fn
     */
     off(eventName, fn) {
         console.log("disabled eventName", eventName);

        if (this._events[eventName]) {
            console.log("Found event name");
            for (var i = 0; i < this._events[eventName].length; i++) {
                console.log(this._events[eventName]);
                if (this._events[eventName][i] === fn) {
                    this._events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    }

    /**
     * This event allows the user to publish an event. Once the event is
     * published, this function will run all of the associated callbacks
     * with the event.
     * @param string eventName
     * @param {*} data
     */
    emit(eventName, data) {
        if (!this._events[eventName]) {
            return;
        }

        this._events[eventName].forEach(callback => callback(data));
    }
}

module.exports = EventBus;
