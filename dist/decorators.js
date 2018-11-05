"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createExtractLogicDecorator(update) {
    return () => (target, methodName) => {
        const last = target.extractLogic;
        target.extractLogic = function (seed) {
            const thisArg = Object.create(this);
            Object.defineProperties(thisArg, {
                status: {
                    get: () => seed.status
                },
                actions: {
                    get: () => seed.actions
                },
                utilities: {
                    get: () => seed.utilities
                }
            });
            const base = (last && last.call(this, seed)) || {};
            return update(target[methodName].bind(thisArg), base);
        };
    };
}
function createFeatureScaffold(strings, feature) {
    return {
        observe: createExtractLogicDecorator((method, base) => {
            base.observers = base.observers || {};
            return Object.assign({}, base, { observers: Object.assign({}, base.observers, { [feature]: method }) });
        }),
        on: strings[feature].actions.reduce((acc, action) => (Object.assign({}, acc, { [action]: createActionScaffold(strings, feature, action) })), {}),
        provides: strings[feature].utilities.reduce((acc, utility) => (Object.assign({}, acc, { [utility]: createUtilityScaffold(strings, feature, utility) })), {})
    };
}
function createActionScaffold(strings, feature, action) {
    return {
        observe: createExtractLogicDecorator((method, base) => {
            base.actions = base.actions || {};
            base.actions[feature] = base.actions[feature] || {};
            return Object.assign({}, base, { actions: Object.assign({}, base.actions, { [feature]: Object.assign({}, base.actions[feature], { [action]: method }) }) });
        }),
        update: strings[feature].state.reduce((acc, state) => (Object.assign({}, acc, { [state]: createReducerScaffold(strings, feature, action, state) })), {})
    };
}
function createUtilityScaffold(strings, feature, utility) {
    return createExtractLogicDecorator((method, base) => {
        base.utilities = base.utilities || {};
        base.utilities[feature] = base.utilities[feature] || {};
        return Object.assign({}, base, { utilities: Object.assign({}, base.utilities, { [feature]: Object.assign({}, base.utilities[feature], { [utility]: method }) }) });
    });
}
function createReducerScaffold(strings, feature, action, state) {
    return createExtractLogicDecorator((method, base) => {
        base.reducers = base.reducers || {};
        base.reducers[feature] = base.reducers[feature] || {};
        base.reducers[feature][action] =
            base.reducers[feature][action] || {};
        return Object.assign({}, base, { reducers: {
                [feature]: Object.assign({}, base.reducers[feature], { [action]: Object.assign({}, base.reducers[feature][action], { [state]: method }) })
            } });
    });
}
function createLogicDecorators(strings) {
    return Object.keys(strings).reduce((acc, feature) => (Object.assign({}, acc, { [feature]: createFeatureScaffold(strings, feature) })), {});
}
exports.createLogicDecorators = createLogicDecorators;
function extractLogic(layers, seed) {
    return layers.map(layer => layer.extractLogic(seed));
}
exports.extractLogic = extractLogic;
//# sourceMappingURL=decorators.js.map