import React from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  InputGroup,
  Modal,
  OverlayTrigger,
  Panel,
  ProgressBar,
  Tooltip,
  Well,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import * as web3 from '@bitconch/bitconch-web3j';

import {Settings} from './settings';

const AIRDORP_QUOTA = 3000;

class PublicKeyInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    const length = value.length;
    if (length === 44) {
      if (value.match(/^[A-Za-z0-9]+$/)) {
        return 'success';
      }
      return 'error';
    } else if (length > 44) {
      return 'error';
    } else if (length > 0) {
      return 'warning';
    }
    return null;
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onPublicKey(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>收款人地址</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入收款人的地址"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
PublicKeyInput.propTypes = {
  onPublicKey: PropTypes.function,
};


class TokenInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    if (value.length === 0) {
      return null;
    }
    if (value.match(/^\d+$/)) {
      return 'success';
    }
    return 'error';
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onAmount(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>数量</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入交易数量"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TokenInput.propTypes = {
  onAmount: PropTypes.function,
};


class SignatureInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    const length = value.length;
    if (length === 88) {
      if (value.match(/^[A-Za-z0-9]+$/)) {
        return 'success';
      }
      return 'error';
    } else if (length > 44) {
      return 'error';
    } else if (length > 0) {
      return 'warning';
    }
    return null;
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onSignature(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>签名</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入签名"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
SignatureInput.propTypes = {
  onSignature: PropTypes.function,
};


class DismissibleErrors extends React.Component {
  render() {
    const errs = this.props.errors.map((err, index) => {
      return <Alert key={index} bsStyle="danger">
        <a href="#" onClick={() => this.props.onDismiss(index)}><Glyphicon glyph="remove-sign" /></a> &nbsp;
        {err}
      </Alert>;
    });
    return (
      <div>
        {errs}
      </div>
    );
  }
}
DismissibleErrors.propTypes = {
  errors: PropTypes.array,
  onDismiss: PropTypes.function,
};


class BusyModal extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        bsSize="small"
        aria-labelledby="contained-modal-title-sm"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-sm">{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.text}
          <br/>
          <br/>
          <ProgressBar active now={100} />
        </Modal.Body>
      </Modal>
    );
  }
}
BusyModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};


class SettingsModal extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">设置</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Settings store={this.props.store} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
SettingsModal.propTypes = {
  onHide: PropTypes.function,
  store: PropTypes.object,
};


export class Wallet extends React.Component {
  state = {
    errors: [],
    busyModal: null,
    settingsModal: false,
    balance: 0,
    recipientPublicKey: null,
    recipientAmount: null,
    confirmationSignature: null,
    transactionConfirmed: null,
  };

  constructor(props) {
    super(props);
    this.onStoreChange();
  }

  setConfirmationSignature(confirmationSignature) {
    this.setState({
      transactionConfirmed: null,
      confirmationSignature
    });
  }

  setRecipientPublicKey(recipientPublicKey) {
    this.setState({recipientPublicKey});
  }

  setRecipientAmount(recipientAmount) {
    this.setState({recipientAmount});
  }

  dismissError(index) {
    const {errors} = this.state;
    errors.splice(index, 1);
    this.setState({errors});
  }

  addError(message) {
    const {errors} = this.state;
    errors.push(message);
    this.setState({errors});
  }

  async runModal(title, text, f) {
    this.setState({
      busyModal: {title, text},
    });

    try {
      await f();
    } catch (err) {
      this.addError(err.message);
    }

    this.setState({busyModal: null});
  }

  onStoreChange = () => {
    this.web3solAccount = new web3.Account(this.props.store.accountSecretKey);
    this.web3sol = new web3.Connection(this.props.store.networkEntryPoint);
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.store.onChange(this.onStoreChange);
    this.refreshBalance();
  }

  componentWillUnmount() {
    this.props.store.removeChangeListener(this.onStoreChange);
  }


  copyPublicKey() {
    copy(this.web3solAccount.publicKey);
  }

  refreshBalance() {
    this.runModal(
      '更新账户余额',
      '请稍后...',
      async () => {
        this.setState({
          balance: await this.web3sol.getBalance(this.web3solAccount.publicKey),
        });
      }
    );
  }

  requestAirdrop() {
    this.runModal(
      '申请空投',
      '请稍后...',
      async () => {
        await this.web3sol.requestAirdrop(this.web3solAccount.publicKey, AIRDORP_QUOTA);
        this.setState({
          balance: await this.web3sol.getBalance(this.web3solAccount.publicKey),
        });
      }
    );
  }

  sendTransaction() {
    this.runModal(
      '发送交易',
      '请稍后...',
      async () => {
        const transaction = web3.SystemProgram.move(
          this.web3solAccount.publicKey,
          new web3.PublicKey(this.state.recipientPublicKey),
          this.state.recipientAmount,

        );
        const signature = await this.web3sol.sendTransaction(this.web3solAccount, transaction);

        await this.web3sol.confirmTransaction(signature);
        this.setState({
          balance: await this.web3sol.getBalance(this.web3solAccount.publicKey),
        });
      }
    );
  }

  confirmTransaction() {
    this.runModal(
      '交易确认',
      '请稍后...',
      async () => {
        const result = await this.web3sol.confirmTransaction(
          this.state.confirmationSignature,
        );
        this.setState({
          transactionConfirmed: result
        });
      }
    );
  }

  render() {
    const copyTooltip = (
      <Tooltip id="clipboard">
        复制到剪贴板
      </Tooltip>
    );
    const refreshBalanceTooltip = (
      <Tooltip id="refresh">
        更新账户余额
      </Tooltip>
    );
    const airdropTooltip = (
      <Tooltip id="airdrop">
        申请空投
      </Tooltip>
    );
    const resetTooltip = (
      <Tooltip id="resetaccount">
        申请新账户
      </Tooltip>
    );

    const busyModal = this.state.busyModal ?
      <BusyModal show title={this.state.busyModal.title} text={this.state.busyModal.text} /> : null;

    const settingsModal = this.state.settingsModal ?
      <SettingsModal
        show
        store={this.props.store}
        onHide={() => this.setState({settingsModal: false})}
      /> : null;

    const sendDisabled = this.state.recipientPublicKey === null || this.state.recipientAmount === null;
    const airdropDisabled = this.state.balance !== 0;

    return (
      <div>
        <div style={{width: '100%', textAlign: 'right'}}>
          <Button onClick={() => this.setState({settingsModal: true})}>
            <Glyphicon
              style={{backgroundColor: 'white'}}
              glyph="menu-hamburger"
            />
          </Button>
        </div>
        {busyModal}
        {settingsModal}
        <DismissibleErrors errors={this.state.errors} onDismiss={(index) => this.dismissError(index)}/>
        <Well>
          账户地址:
          <FormGroup>
            <InputGroup>
              <FormControl readOnly type="text" size="21" value={this.web3solAccount.publicKey}/>
              <InputGroup.Button>
                <OverlayTrigger placement="bottom" overlay={copyTooltip}>
                  <Button onClick={() => this.copyPublicKey()}>
                    <Glyphicon glyph="copy" />
                  </Button>
                </OverlayTrigger>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <p/>
          账户余额: {this.state.balance}&nbsp;BUS &nbsp;
          <p/>
          <OverlayTrigger placement="top" overlay={refreshBalanceTooltip}>
            <Button onClick={() => this.refreshBalance()}>
              <Glyphicon glyph="refresh" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={airdropTooltip}>
            <Button disabled={airdropDisabled} onClick={() => this.requestAirdrop()}>
              <Glyphicon glyph="send" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={resetTooltip}>
            <Button bsStyle="danger" onClick={() => this.resetAccount()}><Glyphicon glyph="info-sign" /></Button>
          </OverlayTrigger>
        </Well>
        <p/>
        <Panel>
          <Panel.Heading>交易</Panel.Heading>
          <Panel.Body>
            <PublicKeyInput onPublicKey={(publicKey) => this.setRecipientPublicKey(publicKey)}/>
            <TokenInput onAmount={(amount) => this.setRecipientAmount(amount)}/>
            <div className="text-center">
              <Button disabled={sendDisabled} onClick={() => this.sendTransaction()}>发送</Button>
            </div>
          </Panel.Body>
        </Panel>
        <p/>
      </div>
    );
  }
}
Wallet.propTypes = {
  store: PropTypes.object,
};

