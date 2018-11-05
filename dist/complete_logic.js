"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompleteLogic {
    constructor(strings, partials) {
        this.strings = strings;
        this.completeReducers(partials);
        this.completeActions(partials);
        this.completeObservers(partials);
        this.completeUtilities(partials);
    }
    static noop() { }
    static noopReducer(value) {
        return value;
    }
    static utilityMessage(feature, utility) {
        return `Utility ${utility} for feature ${feature} not implemented in scope`;
    }
    static createThrowsUtility(message) {
        return () => {
            throw new ReferenceError(message);
        };
    }
    completeReducers(partials) {
        this.reducers = Object.keys(this.strings).reduce((acc, feature) => (Object.assign({}, acc, { [feature]: this.strings[feature].actions.reduce((acc, action) => (Object.assign({}, acc, { [action]: this.strings[feature].state.reduce((acc, state) => (Object.assign({}, acc, { [state]: partials
                        .filter(partial => {
                        try {
                            return !!partial.reducers[feature][action][state];
                        }
                        catch (_a) {
                            return false;
                        }
                    })
                        .reduce((acc, partial) => {
                        return (v, ...a) => {
                            let next = acc(v, ...a);
                            if (next === undefined) {
                                next = v;
                            }
                            return partial.reducers[feature][action][state](next, ...a);
                        };
                    }, CompleteLogic.noopReducer) })), {}) })), {}) })), {});
    }
    completeActions(partials) {
        this.actions = Object.keys(this.strings).reduce((acc, feature) => (Object.assign({}, acc, { [feature]: this.strings[feature].actions.reduce((acc, action) => {
                return Object.assign({}, acc, { [action]: partials
                        .filter(partial => {
                        try {
                            return !!partial.actions[feature][action];
                        }
                        catch (_a) {
                            return false;
                        }
                    })
                        .reduce((acc, partial) => {
                        return (...values) => {
                            acc(...values);
                            partial.actions[feature][action](...values);
                        };
                    }, CompleteLogic.noop) });
            }, {}) })), {});
    }
    completeObservers(partials) {
        this.observers = Object.keys(this.strings).reduce((acc, feature) => (Object.assign({}, acc, { [feature]: partials
                .filter(partial => {
                try {
                    return !!partial.observers[feature];
                }
                catch (_a) {
                    return false;
                }
            })
                .reduce((acc, partial) => {
                return (s) => {
                    acc(s);
                    partial.observers[feature](s);
                };
            }, CompleteLogic.noop) })), {});
    }
    completeUtilities(partials) {
        this.utilities = Object.keys(this.strings).reduce((acc, feature) => {
            const utilityPartials = partials.filter(partial => {
                try {
                    return !!partial.utilities[feature];
                }
                catch (_a) {
                    return false;
                }
            });
            return Object.assign({}, acc, { [feature]: this.strings[feature].utilities.reduce((acc, utility) => {
                    let util;
                    try {
                        util = utilityPartials.find(partial => !!partial.utilities[feature] &&
                            !!partial.utilities[feature][utility]).utilities[feature][utility];
                        if (util === null) {
                            throw new TypeError();
                        }
                    }
                    catch (e) {
                        const message = CompleteLogic.utilityMessage(feature, utility);
                        console.warn(message);
                        util = CompleteLogic.createThrowsUtility(message);
                    }
                    return Object.assign({}, acc, { [utility]: util });
                }, {}) });
        }, {});
    }
}
exports.CompleteLogic = CompleteLogic;
//# sourceMappingURL=complete_logic.js.map