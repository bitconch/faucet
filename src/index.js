import React from 'react';
import ReactDOM from 'react-dom';

import {Wallet} from './appwallet';
import {Store} from './store';

class App extends React.Component {
  state = {
    store: new Store(),
    initialized: false,
  }

  async componentDidMount() {
    await this.state.store.init();
    this.setState({initialized: true});
  }

  render() {
    if (!this.state.initialized) {
      return <div />; // TODO: Loading screen?
    }
    return <Wallet store={this.state.store} />;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
module.hot.accept();
