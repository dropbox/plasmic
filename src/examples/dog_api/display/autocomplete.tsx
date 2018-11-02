import * as React from "react";

export type AutocompleteProps = {
  options: string[];
};

export type AutocompleteState = {
  focused: boolean;
  value: string;
};

export class Autocomplete extends React.Component<
  AutocompleteProps,
  AutocompleteState
> {
  constructor(props: AutocompleteProps) {
    super(props);
    this.state = {
      value: "",
      focused: false
    };
  }
  onFocus = () => {
    this.setState({ focused: true });
  };
  onBlur = () => {
    this.setState({ focused: false });
  };
  onChange = event => {
    this.setState({ value: event.target.value });
  };
  render() {
    const searchRegexp = new RegExp(this.state.value.toLocaleLowerCase());
    const filteredOptions = this.props.options.filter(
      option => !!option.match(searchRegexp)
    );
    if (this.state.focused) {
      return (
        <React.Fragment>
          <input
            list="autocomplete-list"
            onBlur={this.onBlur}
            onChange={this.onChange}
            value={this.state.value}
          />
          <datalist id="autocomplete-list">
            {filteredOptions.map(option => (
              <option value={option}>{option}</option>
            ))}
          </datalist>
        </React.Fragment>
      );
    } else {
      return <input value={this.state.value} onFocus={this.onFocus} />;
    }
  }
}
