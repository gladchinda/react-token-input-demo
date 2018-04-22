import React, { Component } from 'react';
import './App.css';

import VerificationToken from './components/VerificationToken';

class App extends Component {

	constructor(props) {
		super(props);
		this.tokenLength = 6;
		this.state = { token: '', filled: false };
	}

	onTokenChanged = token => {
		const { token: currentToken, filled: currentFilled } = this.state;
		const filled = token.length === this.tokenLength;

		if (!(currentToken === token && currentFilled === filled)) {
			this.setState({ token, filled });
		}
	}

  render() {
		const { filled, token } = this.state;

    return (
      <div className="container my-5">
        <div className="row d-flex flex-row py-5">
					<div className="w-100 mt-5 py-5 text-center">
            <h2 className="text-secondary">Account Verification</h2>
						<span className="d-block token-hint text-center px-1">
							Enter the <strong>{filled ? `${token.substr(0, 3)}-${token.substr(3)}` : 'XXX-XXX'}</strong> verification token you received on your phone into the input field below.
						</span>
          </div>
					<div className="mx-auto">
						<VerificationToken inputClass="font-weight-bold text-center text-secondary rounded" tokenLength={this.tokenLength} onTokenChanged={this.onTokenChanged} />
						{filled && <button type="button" className="btn btn-primary text-uppercase my-5 mx-auto px-5 py-3 d-block">Verify</button>}
					</div>
        </div>
      </div>
    );
  }

}

export default App;
