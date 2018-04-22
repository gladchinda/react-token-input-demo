import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import TokenInput from './TokenInput';

const getBoundedNumber = (number, max, min = 0) => Math.max(min, Math.min(number, max))

class VerificationToken extends Component {

  constructor(props) {
    super(props);

    const { tokenLength = null } = props;

    if (typeof tokenLength === 'number') {
      this.tokenLength = getBoundedNumber(tokenLength, tokenLength, 1);
    }

    this.tokenFields = [];

    this.state = { values: [], currentValue: '' };
  }

  updateToken = () => {
    const { values, currentValue: oldValue } = this.state;
    const { onTokenChanged = f => f } = this.props;

    const currentValue = values.filter(value => /^\d+$/.test(value)).join('');

    if (oldValue !== currentValue) {
      this.setState({ currentValue }, () => onTokenChanged(currentValue));
    }
  }

  getForwardIndex = index => getBoundedNumber(index + 1, this.tokenFields.length - 1);

  getBackwardIndex = index => getBoundedNumber(index - 1, this.tokenFields.length - 1);

  focusInput = (next = f => f, skip = f => f) => {
    const focusFn = (index, fn) => {
      const totalFields = this.tokenFields.length;
      const fieldIndex = getBoundedNumber(index, totalFields - 1);
      const nextFieldIndex = next(fieldIndex);
      const currentField = this.tokenFields[fieldIndex];

      if (skip(currentField) && fieldIndex !== nextFieldIndex) {
        return focusFn(nextFieldIndex, fn);
      }

      (typeof fn === 'function') && fn(currentField, fieldIndex);

      currentField.inputField.focus();
    };

    return focusFn.bind(this);
  }

  forwardFocusInput = this.focusInput(this.getForwardIndex, input => input.inputIsFilled());

  backwardFocusInput = this.focusInput(this.getBackwardIndex, input => input.inputIsEmpty());

  onShiftLeft = index =>
    () => this.focusInput(this.getBackwardIndex, currentInput => false)(index - 1);

  onShiftRight = index =>
    () => this.focusInput(this.getForwardIndex, currentInput => false)(index + 1);

  onInputChanged = index => value => this.updateToken();

  onInputFilled = index => value => {
    this.forwardFocusInput(index + 1);

    this.setState(prevState => {
      let [...values] = prevState.values;
      values[index] = value;
      return { values };
    });
  }

  onInputEmptied = index => () => {
    this.backwardFocusInput(index - 1);

    this.setState(prevState => {
      let [...values] = prevState.values;
      values[index] = null;
      return { values };
    });
  }

  onEmptyBackspace = index => () => {
    const backspaceFn = (input, index) => {
      const value = input.inputField.value;
      const newValue = value.substr(0, value.length - 1);

      input.inputField.value = newValue;
      input.changeInputValue(newValue);
    };

    this.backwardFocusInput(index - 1, backspaceFn);
  }

  onInputAfterFilled = index => (value, input = '') => {
    const nextInputFn = nextInput => {
      if (!nextInput.inputIsFilled()) {
        const value = nextInput.inputField.value;
        const newValue = `${value}${input[0]}`;

        nextInput.inputField.value = newValue;
        nextInput.changeInputValue(newValue);
      }
    };

    this.forwardFocusInput(index + 1, nextInputFn);
  }

  buildInputFields = () => {

    const getHandlerProps = index => {
      const handlers = [
        'onInputChanged', 'onInputFilled', 'onInputEmptied', 'onEmptyBackspace', 'onInputAfterFilled', 'onShiftLeft', 'onShiftRight'
      ];

      return handlers.reduce((props, handler) => ({ ...props, [handler]: this[handler](index) }), {});
    }

    const range = (min, max, step = 1) => {
      let i = min;
      const range = [];

      while (i <= max) {
        range.push(i);
        i += step;
      }

      return range;
    }

    return range(1, this.tokenLength).map((field, index) => {
      const { inputClass = '' } = this.props;

      const inputClasses = ['token-input-field', typeof inputClass === 'string' ? inputClass : ''].join(' ').trim();

      const handlerProps = getHandlerProps(index);

      return <TokenInput key={index} ref={elem => this.tokenFields[index] = elem} className={inputClasses} maxLength={1} {...handlerProps} />
    });

  }

  render() {
    return ( this.tokenLength ? <Fragment>{ this.buildInputFields() }</Fragment> : null );
  }

}

VerificationToken.propTypes = {
  tokenLength: PropTypes.number.isRequired,
  inputClass: PropTypes.string,
  onTokenChanged: PropTypes.func
};

export default VerificationToken;
