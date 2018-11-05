"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const complete_logic_1 = require("./complete_logic");
const decorators_1 = require("./decorators");
const container_layer_1 = require("./container_layer");
class DisplayLayer extends React.Component {
    constructor() {
        super(...arguments);
        this.getLogic = (() => {
            let lastContainer = null;
            let lastLayers = null;
            let lastLogic = null;
            return () => {
                if (this.context.layers !== lastLayers ||
                    this.container !== lastContainer) {
                    lastLayers = this.context.layers;
                    lastContainer = this.container;
                    lastLogic = new complete_logic_1.CompleteLogic(this.context.strings, decorators_1.extractLogic(this.context.layers, this));
                }
                return lastLogic;
            };
        })();
    }
    get status() {
        return this.container.getStatus();
    }
    get actions() {
        return this.container.getActions(this.getLogic());
    }
    get utilities() {
        return this.getLogic().utilities;
    }
    get container() {
        return this.context.container;
    }
    extractLogic() {
        return {};
    }
}
DisplayLayer.contextType = container_layer_1.LayerReactContext;
exports.DisplayLayer = DisplayLayer;
//# sourceMappingURL=display_layer.js.map