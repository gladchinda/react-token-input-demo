import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TokenInput extends Component {

  constructor(props) {
    super(props);
    const { maxLength = 1 } = props;

    this.maxLength = typeof maxLength === 'number' ? Math.max(1, maxLength) : 1;

    const handlers = [
      'onInputChanged', 'onInputFilled', 'onInputEmptied', 'onEmptyBackspace', 'onInputAfterFilled', 'onShiftLeft', 'onShiftRight'
    ];

    handlers.forEach(handler => this[handler] = this.resolveInputHandler(handler));

    this.state = { value: '' };
  }

  resolveInputHandler = handler => {
    const { [handler]: handlerFn = f => f } = this.props;
    return typeof handlerFn === 'function' ? handlerFn : f => f;
  }

  shouldComponentUpdate(prevState, nextState) {
    return prevState.value !== nextState.value;
  }

  inputIsEmpty = () => this.state.value.length === 0;

  inputIsFilled = () => this.state.value.length === this.maxLength;

  changeInputValue = newValue => {
    const maxlength = this.maxLength;
    const value = newValue.replace(/[^0-9]/ig, '');

    if (value.length <= maxlength) {
      this.setState({ value }, () => this.onInputChanged(value));

      if (value.length === 0) return this.onInputEmptied();
      if (value.length === maxlength) return this.onInputFilled(value);
    }

    return this.onInputAfterFilled(value.substr(0, maxlength), value.substr(maxlength));
  }

  handleKeyUp = evt => {
    evt.persist();
    const value = evt.target.value.replace(/[^0-9]/ig, '');
		const cursorPosition = evt.target.selectionStart;
		const keycode = evt.keyCode;

    const isLeft = keycode === 37;
    const isRight = keycode === 39;
    const isEmpty = value.length === 0;
		const isBackspace = keycode === 8;

    if (isEmpty && isBackspace) return this.onEmptyBackspace();

    if ((isEmpty || cursorPosition === 0) && isLeft) return this.onShiftLeft();

		if ((isEmpty || cursorPosition === value.length) && isRight) return this.onShiftRight();
  }

  handleChange = evt => this.changeInputValue(evt.target.value);

  handleFocus = evt => {
    const value = evt.target.value;
    this.setState({ value: '' }, () => this.setState({ value }));
  }

  render() {
    const { type, value, onChange, onFocus, onKeyUp, placeholder, autoComplete, maxLength, onInputChanged, onInputFilled, onInputEmptied, onEmptyBackspace, onInputAfterFilled, onShiftLeft, onShiftRight, ...restProps } = this.props;

    return (
      <div className="token-input-container">
        <input type="text" ref={elem => this.inputField = elem} value={this.state.value} onChange={this.handleChange} onFocus={this.handleFocus} onKeyUp={this.handleKeyUp} autoComplete="off" {...restProps} />
      </div>
    );
  }

}

TokenInput.propTypes = {
  maxLength: PropTypes.number,
  onInputChanged: PropTypes.func,
  onInputFilled: PropTypes.func,
  onInputEmptied: PropTypes.func,
  onEmptyBackspace: PropTypes.func,
  onInputAfterFilled: PropTypes.func,
  onShiftLeft: PropTypes.func,
  onShiftRight: PropTypes.func
};

export default TokenInput;
