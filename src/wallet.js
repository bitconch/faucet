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
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import * as web3 from '@solana/web3.js';

import {Settings} from './settings';

const AIRDORP_QUOTA = 3000;

class SourceTokenAccountPubKeyInput extends React.Component {
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
    this.props.onSourceTokenAccountPubKey(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Source token account PublicKey</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入发送人Token地址"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}

SourceTokenAccountPubKeyInput.propTypes = {
  onSourceTokenAccountPubKey: PropTypes.function,
};

class DestinationTokenAccountPubKeyInput extends React.Component {
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
    this.props.onDestinationTokenAccountPubKey(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Destination token account PublicKey</ControlLabel>
          <FormControl
            type="text"
            id="desttokenaccountpubkey"
            value={this.state.value}
            placeholder="请输入接收人Token地址"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}

DestinationTokenAccountPubKeyInput.propTypes = {
  onDestinationTokenAccountPubKey: PropTypes.function,
};

class SercetkeyInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    var array = value.split(',');
    if (array.length === 64) {
      return 'success';
    }else if (array.length <= 64){
      return 'warning';
    }else if (array.length > 64){
      return 'error';
    }else{
      return null;
    }
  }
  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onSercetkey(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup validationState={this.state.validationState}>
          <ControlLabel>导入密钥</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入您的密钥"
            onChange={e => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
SercetkeyInput.propTypes = {
  onSercetkey: PropTypes.function,
};

class TransferTokenNumberInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    const length = value.length;
    if (length === 0) {
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
    this.props.onTransferTokenNumber(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Number of tokens to transfer</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入转账Token数量"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TransferTokenNumberInput.propTypes = {
  onTransferTokenNumber: PropTypes.function,
};

class TokenSupplyInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    const length = value.length;
    if (length === 0) {
      return null;
    }
    if (value.match(/^\d+$/)) {
      if (value > 18446744073709551616) {
        return 'error';
      }
      return 'success';
    }
    return 'error';
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onTokenSupply(validationState === 'success' ? new web3.TokenAmount(value) : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>创建数量</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入创建Token的数量"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TokenSupplyInput.propTypes = {
  onTokenSupply: PropTypes.function,
};

class TokenDecimalInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };

  getValidationState(value) {
    if (value.length === 0) {
      return null;
    }
    if (value.match(/^\d+$/)) {
      if (value > 255) {
        return 'error';
      }
      return 'success';
    }
    return 'error';
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onTokenDecimal(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Decimal</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入token decimal"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TokenDecimalInput.propTypes = {
  onTokenDecimal: PropTypes.function,
};

class TokenNameInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };
  getValidationState(value) {
    const length = value.length;
    if (length === 0) {
      return 'bitconch';
    }
    if (value.match(/^[A-Za-z0-9]+$/)) {
      return 'success';
    }
    if (length > 44) {
      return 'error';
    }
    return null;
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onTokenName(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Token名称</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入token名称"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TokenNameInput.propTypes = {
  onTokenName: PropTypes.function,
};

class TokenSymbolInput extends React.Component {
  state = {
    value: '',
    validationState: null,
  };
  getValidationState(value) {
    const length = value.length;
    if (length > 0) {
      if (value.match(/^[A-Za-z0-9]+$/)) {
        return 'success';
      }
      return 'error';
    } else if (length > 44) {
      return 'error';
    }
    return null;
  }

  handleChange(e) {
    const {value} = e.target;
    const validationState = this.getValidationState(value);
    this.setState({value, validationState});
    this.props.onTokenSymbol(validationState === 'success' ? value : null);
  }

  render() {
    return (
      <form>
        <FormGroup
          validationState={this.state.validationState}
        >
          <ControlLabel>Token符号</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="请输入token符号"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TokenSymbolInput.propTypes = {
  onTokenSymbol: PropTypes.function,
};

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
        <FormGroup validationState={this.state.validationState}>
          <ControlLabel>收款人地址</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{backgroundColor: '#337ab7'}}><Glyphicon glyph="user" style={{color: '#FFF'}}/></InputGroup.Addon>
            <FormControl type="text" value={this.state.value} placeholder="请输入收款人的地址" onChange={(e) => this.handleChange(e)}/>
            <FormControl.Feedback />
          </InputGroup>
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
        <FormGroup validationState={this.state.validationState}>
          <ControlLabel>数量</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{backgroundColor: '#337ab7'}}><Glyphicon glyph="align-left" style={{color: '#FFF'}}/></InputGroup.Addon>
            <FormControl type="text" value={this.state.value} placeholder="请输入交易数量" onChange={(e) => this.handleChange(e)}/>
            <FormControl.Feedback />
          </InputGroup>
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
        <FormGroup validationState={this.state.validationState}>
          <ControlLabel>签名</ControlLabel>
          <FormControl type="text" value={this.state.value} placeholder="请输入签名" onChange={(e) => this.handleChange(e)}/>
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

class ExportSercetModal extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">切换账户</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Panel>
              <Panel.Heading></Panel.Heading>
              <Panel.Body>
                <FormGroup>
                  <InputGroup>
                    <SercetkeyInput
                      onSercetkey={key => this.props.exsecretkey(key)}
                    />
                    <Button
                      onClick={() => this.props.updateaccount()}
                    >
                      <Glyphicon glyph="export" />
                      导入
                    </Button>
                  </InputGroup>
                </FormGroup>
              </Panel.Body>
            </Panel>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>关闭</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ExportSercetModal.propTypes = {
  exsecretkey: PropTypes.function,
  onHide: PropTypes.function,
  updateaccount:PropTypes.function,

};

class SettingsModal extends React.Component {
  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">设置</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding:'0px'}}>
          <Settings store={this.props.store} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>关闭</Button>
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
    exportSercetModal:false,
    mysecretKey:null,
    balance: 0,
    recipientPublicKey: null,
    recipientAmount: null,
    confirmationSignature: null,
    transactionConfirmed: null,
    tokenSupply: new web3.TokenAmount(100),
    tokenName: 'bitconch',
    tokenSymbol: 'w',
    tokenDecimal: 2,
    tokenAmount: 0,
    newTokenAcountAddr: null,
    sourceTokenAccountPublicKey: null,
    destTokenAccountPublicKey: null,
    transferTokenAmount: 0,
    sourceTokenAccountTokenAmount: 0,
    destTokenAccountTokenAmount: 0,
    tokenObj: null,
    newTokenAccountPublicKey: null,
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

  setSourceTokenAccountPublicKey(sourceTokenAccountPublicKey) {
    this.setState({sourceTokenAccountPublicKey});
  }

  setDestTokenAccountPublicKey(destTokenAccountPublicKey) {
    this.setState({destTokenAccountPublicKey});
  }

  setTransferTokenAmount(transferTokenAmount) {
    this.setState({transferTokenAmount});
  }

  setTokenSupply(tokenSupply) {
    this.setState({tokenSupply});
  }
  setTokenName(tokenName) {
    this.setState({tokenName});
  }

  setTokenSymbol(tokenSymbol) {
    this.setState({tokenSymbol});
  }

  setTokenDecimal(tokenDecimal) {
    this.setState({tokenDecimal});
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
  setMySerectkey(mysecretKey){
    this.setState({mysecretKey});
  }
  async getAcount(){
    let str = this.state.mysecretKey;
    var array = str.split(',');
    if (array.length === 64) {
      var typedArray = new Uint8Array(array);
      await this.props.store.exportAccount(typedArray);
      this.refreshBalance();
      this.setState({exportSercetModal:false});
    }
  }
  copyPublicKey() {
    copy(this.web3solAccount.publicKey);
  }

  copyTokenAccountPublicKey() {
    copy(this.state.newTokenAcountAddr);
  }

  copyNewTokenAccountPublicKey() {
    copy(this.state.newTokenAccountPublicKey);
  }

  createNewTokenAccount() {
    this.runModal(
      '创建Token账户',
      '请稍后...',
      async () => {
        var newtokenaccpubkey = await this.state.tokenObj.newAccount(this.web3solAccount);
        this.setState({
          newTokenAccountPublicKey: newtokenaccpubkey.toString(),
        });
      }
    );
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

  transferToken() {
    this.runModal(
      '发送Token',
      '请稍后...',
      async () => {
        var sourcetokenacc = await this.state.tokenObj.accountInfo(new web3.PublicKey(this.state.sourceTokenAccountPublicKey));
        if (new Number(sourcetokenacc.amount) < new Number(this.state.transferTokenAmount)) {
          alert('token数量不足，无法完成交易! 当前账户Token数量：' + sourcetokenacc.amount);
          return;
        }

        const sig = await this.state.tokenObj.transfer(
          this.web3solAccount,
          new web3.PublicKey(this.state.sourceTokenAccountPublicKey),
          new web3.PublicKey(this.state.destTokenAccountPublicKey),
          this.state.transferTokenAmount
        );
        await this.web3sol.confirmTransaction(sig);
        sourcetokenacc = await this.state.tokenObj.accountInfo(new web3.PublicKey(this.state.sourceTokenAccountPublicKey));
        var desttokenacc = await this.state.tokenObj.accountInfo(new web3.PublicKey(this.state.destTokenAccountPublicKey));
        this.setState({
          sourceTokenAccountTokenAmount: sourcetokenacc.amount.toString(),
          destTokenAccountTokenAmount: desttokenacc.amount.toString(),
        });
      }
    );
  }

  createNewToken() {
    this.runModal(
      '创建NewToken',
      '请稍后...',
      async () => {
        const b = await this.web3sol.getBalance(this.web3solAccount.publicKey);
        if (b <= 0) {
          alert('账户余额不足，无法发送交易！');
          return;
        }

        const [token, pubkey] = await web3.Token.createNewToken(
          this.web3sol,
          this.web3solAccount,
          this.state.tokenSupply,
          this.state.tokenName,
          this.state.tokenSymbol,
          this.state.tokenDecimal,
        );
        this.setState({
          tokenObj: token,
        });
        const newTokenAccountInfo = await token.accountInfo(pubkey);
        var tokenAmount = newTokenAccountInfo.amount;
        this.setState({
          tokenAmount: tokenAmount.toString(),
          newTokenAcountAddr: pubkey.toString(),
        });
      }
    );
  }

  resetAccount() {
    this.runModal(
      '申请新账户',
      '请稍后...',
      async () => {
        await this.props.store.createAccount();
      }
    );
  }

  exportPrivateKey() {
    copy(this.web3solAccount.secretKey);
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
    const exportTooltip = (
      <Tooltip id="exportprivate">
        导出密钥(复制到剪贴板)
      </Tooltip>
    );
    const changeTooltip = (
      <Tooltip id="importprivate">
        切换账户(导入密钥)
      </Tooltip>
    );
    const createNewTokenAccounttip = (
      <Tooltip id="newtokenaccount">
        申请Token账户
      </Tooltip>
    );

    const busyModal = this.state.busyModal ?
      <BusyModal show title={this.state.busyModal.title} text={this.state.busyModal.text} /> : null;
    const exportSercetModal = this.state.exportSercetModal ? (
      <ExportSercetModal
        show
        onHide={() => this.setState({exportSercetModal: false})}
        updateaccount={() => this.getAcount()}
        exsecretkey={key => this.setMySerectkey(key)}
      />
    ) : null;
    const settingsModal = this.state.settingsModal ?
      <SettingsModal show store={this.props.store} onHide={() => this.setState({settingsModal: false})}/> : null;

    const sendDisabled = this.state.recipientPublicKey === null || this.state.recipientAmount === null;
    const createDisabled = this.state.tokenSupply === 0 || this.state.tokenDecimal === 0 || this.state.tokenName === null || this.state.tokenSymbol ===null;
    const airdropDisabled = this.state.balance !== 0;
    const transferDisabled = this.state.SourceTokenAccountPubKeyInput === null || this.state.destTokenAccountPublicKey === null || this.state.transferTokenAmount === 0 || this.state.tokenObj === null;
    const createNewTokenAccountDisabled = this.state.tokenObj === null;

    return (
      <div>
        {busyModal}
        {settingsModal}
        {exportSercetModal}
        <DismissibleErrors errors={this.state.errors} onDismiss={(index) => this.dismissError(index)}/>
        <Panel>
          <Panel.Heading>
            账户信息
            <Button onClick={() => this.setState({settingsModal: true})} bsSize="small" bsStyle="primary" style={{float: 'right',marginTop:'-5px'}}>
              <Glyphicon glyph="cog"/>
            </Button>
          </Panel.Heading>
          <Panel.Body>
            <div>
              账户地址:
            </div>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon style={{backgroundColor: '#337ab7'}}><Glyphicon glyph="user" style={{color: '#FFF'}}/></InputGroup.Addon>
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
            <OverlayTrigger placement="top" overlay={refreshBalanceTooltip}>
              <Button onClick={() => this.refreshBalance()}>
                <Glyphicon glyph="refresh" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={airdropTooltip}>
              <Button disabled={airdropDisabled} onClick={() => this.requestAirdrop()}>
                <Glyphicon glyph="arrow-down" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={resetTooltip}>
              <Button bsStyle="danger" onClick={() => this.resetAccount()}>
                <Glyphicon glyph="repeat" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={exportTooltip}>
              <Button  onClick={() => this.exportPrivateKey()} style={{float: 'right'}}>
                <Glyphicon glyph="export" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={changeTooltip}>
              <Button  onClick={() => this.setState({exportSercetModal: true})} style={{float: 'right'}}>
                <Glyphicon glyph="import" />
              </Button>
            </OverlayTrigger>
          </Panel.Body>
        </Panel>
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
        <Panel>
          <Panel.Heading>创建NewToken</Panel.Heading>
          <Panel.Body>
            <TokenSupplyInput onTokenSupply={(supply) => this.setTokenSupply(supply)}/>
            <TokenNameInput onTokenName={(name) => this.setTokenName(name)}/>
            <TokenSymbolInput onTokenSymbol={(symbol) => this.setTokenSymbol(symbol)}/>
            <TokenDecimalInput onTokenDecimal={(decimal) => this.setTokenSymbol(decimal)}/>
            <p/>
            NewToken存放账户地址:
            <FormGroup>
              <InputGroup>
                <FormControl readOnly type="text" size="21" value={this.state.newTokenAcountAddr}/>
                <InputGroup.Button>
                  <OverlayTrigger placement="bottom" overlay={copyTooltip}>
                    <Button onClick={() => this.copyTokenAccountPublicKey()}>
                      <Glyphicon glyph="copy" />
                    </Button>
                  </OverlayTrigger>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            <p/>
            Token数量: {this.state.tokenAmount}&nbsp;
            <p/>
            <div className="text-center">
              <Button disabled={createDisabled} onClick={() => this.createNewToken()}>创建</Button>
            </div>
          </Panel.Body>
        </Panel>
        <p/>
        <Panel>
          <Panel.Heading>
            Transfer Token
          </Panel.Heading>
          <Panel.Body>
            <SourceTokenAccountPubKeyInput onSourceTokenAccountPubKey={(sourcekey) => this.setSourceTokenAccountPublicKey(sourcekey)}/>
            <DestinationTokenAccountPubKeyInput onDestinationTokenAccountPubKey={(destkey) => this.setDestTokenAccountPublicKey(destkey)}/>
            <TransferTokenNumberInput onTransferTokenNumber={(num) => this.setTransferTokenAmount(num)}/>
            <p/>
            发送人剩余Token数量:&nbsp; {this.state.sourceTokenAccountTokenAmount}&nbsp;
            <p/>
            接收人剩余Token数量:&nbsp; {this.state.destTokenAccountTokenAmount}&nbsp;
            <p/>
            新建Token账户地址:
            <FormGroup>
              <InputGroup>
                <FormControl readOnly type="text" size="21" value={this.state.newTokenAccountPublicKey}/>
                <InputGroup.Button>
                  <OverlayTrigger placement="bottom" overlay={copyTooltip}>
                    <Button onClick={() => this.copyNewTokenAccountPublicKey()}>
                      <Glyphicon glyph="copy" />
                    </Button>
                  </OverlayTrigger>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            <p/>

            <OverlayTrigger placement="bottom" overlay={createNewTokenAccounttip}>
              <Button disabled={createNewTokenAccountDisabled}  bsStyle="danger" onClick={() => this.createNewTokenAccount()}>
                <Glyphicon glyph="info-sign" />
              </Button>
            </OverlayTrigger>
            <div className="text-center">
              <Button disabled={transferDisabled} onClick={() => this.transferToken()}>Transfer</Button>
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

