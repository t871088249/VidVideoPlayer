class event {
    constructor() {
        this.eventMap = {};
    }
    on(eventName, handler) {
        if (typeof handler != 'function') {
            return false;
        }
        if (!this.eventMap[eventName]) {
            this.eventMap[eventName] = []
        }
        this.eventMap[eventName].push(handler)
    }
    off(eventName, handler) {
        if (typeof handler == 'function') {
            this.eventMap[eventName] = this.eventMap[eventName].filter(fn=> fn != handler)
        }
    }
    once(eventName, fn) {
        let f = (that, ...args) => {
            fn.apply(that, args);
            this.off(eventName, f)
        }
        this.on(eventName, f)
    }
    emit(eventName, ...args) {
        if (this.eventMap[eventName]) {
            this.eventMap[eventName].forEach(fn => {
                fn.apply(this,args)
            })
        }
    }
}

export default event;