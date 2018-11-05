"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatusContainer {
    constructor(strings, _status) {
        this.strings = strings;
        this._status = _status;
        this.listeners = [];
    }
    getStatus() {
        return this._status;
    }
    setStatus(partial) {
        Object.keys(partial).forEach(feature => {
            if (feature in partial && this._status[feature] !== partial[feature]) {
                this._status[feature] = partial[feature];
            }
        });
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return {
            unsubscribe: () => {
                this.listeners.splice(this.listeners.indexOf(listener), 1);
            }
        };
    }
    getActions(logic) {
        return Object.keys(this.strings).reduce((acc, feature) => (Object.assign({}, acc, { [feature]: this.strings[feature].actions.reduce((acc, action) => (Object.assign({}, acc, { [action]: (...values) => {
                    const previous = Object.assign({}, this.getStatus());
                    this.setStatus({
                        [feature]: this.strings[feature].state.reduce((acc, state) => (Object.assign({}, acc, { [state]: logic.reducers[feature][action][state](this.getStatus()[feature][state], ...values) })), this.getStatus()[feature])
                    });
                    logic.actions[feature][action](previous[feature], ...values);
                    logic.observers[feature](previous[feature]);
                    this.updateSubscribers(feature);
                } })), {}) })), {});
    }
    updateSubscribers(feature) {
        this.listeners.forEach(listener => listener(this.getStatus()));
    }
}
exports.StatusContainer = StatusContainer;
//# sourceMappingURL=status_container.js.map