"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const status_container_1 = require("./status_container");
class ChildStatusContainer extends status_container_1.StatusContainer {
    constructor(strings, parent, _childStatus) {
        super(strings, {});
        this.parent = parent;
        this._childStatus = _childStatus;
    }
    get childStatus() {
        return this._childStatus || {};
    }
    getStatus() {
        return Object.assign({}, this.parent.getStatus(), this.childStatus);
    }
    setStatus(partial) {
        Object.keys(partial).forEach(feature => {
            if (feature in partial &&
                feature in this.childStatus &&
                this.childStatus[feature] !== partial[feature]) {
                this.childStatus[feature] = partial[feature];
            }
            else {
                this.parent.setStatus({
                    [feature]: partial[feature]
                });
            }
        });
    }
    subscribe(listener) {
        const handle = super.subscribe(listener);
        const parentHandle = this.parent.subscribe(() => {
            listener(this.getStatus());
        });
        return {
            unsubscribe: () => {
                handle.unsubscribe();
                parentHandle.unsubscribe();
            }
        };
    }
    updateSubscribers(feature) {
        if (!(feature in this.childStatus)) {
            this.parent.updateSubscribers(feature);
        }
        super.updateSubscribers(feature);
    }
}
exports.ChildStatusContainer = ChildStatusContainer;
//# sourceMappingURL=child_status_container.js.map