"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const status_container_1 = require("./status_container");
const child_status_container_1 = require("./child_status_container");
const decorators_1 = require("./decorators");
const complete_logic_1 = require("./complete_logic");
exports.LayerReactContext = React.createContext({});
class ContainerLayer extends React.Component {
    get status() {
        return this.container.getStatus();
    }
    get actions() {
        return this.container.getActions(this.getLogic());
    }
    get utilities() {
        return this.getLogic().utilities;
    }
    extractLogic() {
        return {};
    }
    getLogic() {
        const strings = this.getAllStrings();
        const layers = this.getAllLogicLayers();
        const partialLogic = decorators_1.extractLogic(layers, this);
        return new complete_logic_1.CompleteLogic(strings, partialLogic);
    }
    getAllLogicLayers() {
        const { context, logic } = this;
        let layers = [...logic, this];
        if (context.layers) {
            layers = [...context.layers, ...layers];
        }
        return layers;
    }
    getAllStrings() {
        const { context, strings } = this;
        let allStrings = strings;
        if (context.strings) {
            allStrings = Object.assign({}, context.strings, allStrings);
        }
        return allStrings;
    }
    componentWillMount() {
        this.initialize();
    }
    initialize() {
        const strings = this.getAllStrings();
        if (this.context.container) {
            this.container = new child_status_container_1.ChildStatusContainer(strings, this.context.container, this.defaultStatus);
        }
        else {
            this.container = new status_container_1.StatusContainer(strings, this.defaultStatus);
        }
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.container.subscribe(() => {
            this.forceUpdate();
        });
    }
    render() {
        return (React.createElement(MappingLayer, { container: this.container, layers: this.getAllLogicLayers(), strings: this.getAllStrings() }, this.display()));
    }
}
ContainerLayer.contextType = exports.LayerReactContext;
exports.ContainerLayer = ContainerLayer;
function MappingLayer(props) {
    return (React.createElement(exports.LayerReactContext.Consumer, null, context => (React.createElement(exports.LayerReactContext.Provider, { value: {
            container: props.container,
            layers: props.layers,
            strings: props.strings
        } }, props.children))));
}
//# sourceMappingURL=container_layer.js.map