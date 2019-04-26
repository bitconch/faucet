import React from 'react';
import {
  Button,
  DropdownButton,
  HelpBlock,
  MenuItem,
  FormControl,
  FormGroup,
  InputGroup,
  Panel,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as web3 from '@solana/web3.js';

export class Settings extends React.Component {
  forceUpdate = () => {
    super.forceUpdate();
    this.checkNetwork();
  }

  state = {
    validationState: null,
    validationHelpBlock: null,
    checkNetworkCount: 0,
  };

  componentDidMount() {
    this.props.store.onChange(this.forceUpdate);
    this.checkNetwork();
  }

  componentWillUnmount() {
    this.props.store.removeChangeListener(this.forceUpdate);
  }

  setNetworkEntryPoint(url) {
    console.log('update', url);
    this.props.store.setNetworkEntryPoint(url);
  }

  async checkNetwork() {
    console.log(
      '检查网络:',
      this.props.store.networkEntryPoint
    );

    const connection = new web3.Connection(this.props.store.networkEntryPoint);

    const checkNetworkCount = this.state.checkNetworkCount + 1;
    this.setState({
      validationState: 'warning',
      validationHelpBlock: '连接到网络...',
      checkNetworkCount,
    });

    try {
      const lastId = await connection.getLastId();
      console.log('lastId:', lastId);
      if (this.state.checkNetworkCount <= checkNetworkCount) {
        this.setState({
          validationState: 'success',
          validationHelpBlock: '连接成功',
        });
      }
    } catch (err) {
      console.log('checkNetwork error:', err);
      if (this.state.checkNetworkCount <= checkNetworkCount) {
        this.setState({
          validationState: 'error',
          validationHelpBlock: '连接失败',
        });
      }
    }
  }

  async resetAccount() {
    await this.props.store.createAccount();
    this.setState({
      balance: await this.web3sol.getBalance(this.web3solAccount.publicKey),
    });
  }

  render() {
    return (
      <div>
        <p/>
        <Panel>
          <Panel.Heading>网络设置</Panel.Heading>
          <Panel.Body>
            <FormGroup validationState={this.state.validationState}>
              <InputGroup>
                <DropdownButton
                  componentClass={InputGroup.Button}
                  title="网络"
                  onSelect={::this.setNetworkEntryPoint}
                >
                  {
                    [
                      'https://api.bitconch.io',
                      'http://47.91.255.38:8899'
                    ].map((url, index) => <MenuItem key={index} eventKey={url}>{url}</MenuItem>)
                  }
                </DropdownButton>
                <FormControl
                  type="text"
                  value={this.props.store.networkEntryPoint}
                  placeholder="输入网络URI"
                  onChange={(e) => this.setNetworkEntryPoint(e.target.value)}
                />
                <FormControl.Feedback />
              </InputGroup>
              <HelpBlock>{this.state.validationHelpBlock}</HelpBlock>
            </FormGroup>
          </Panel.Body>
        </Panel>
        <p/>
        <Panel>
          <Panel.Heading>账户设置</Panel.Heading>
          <Panel.Body>
            <Button bsStyle="danger" onClick={() => this.resetAccount()}>重置账户</Button>
            <p />
            <HelpBlock>
              重置后，当前账户相关的信息将会丢失
            </HelpBlock>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}
Settings.propTypes = {
  store: PropTypes.object,
};

