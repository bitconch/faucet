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
  // OverlayTrigger,
  ProgressBar,
  // Tooltip,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import * as web3 from '@bitconch/bitconch-web3j';

import {Settings} from './settings';
import {PropertyDetail} from './detail';
import info from '../publickey.json';
import Background from './images/account_backgroud.png';
import CopyIcon from './images/address_copy.png';
import TransferIcon from './images/main_right.png';
import AddIcon from './images/main_jia.png';
import SelectOn from './images/selecte_on.png';
import SelectOff from './images/selecte_off.png';
const AIRDORP_QUOTA = 3000;
var sectionStyle = {
  height: '250px',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  background: `url(${Background})`
};
var lineStyle = {
  height: '0.5px',
  backgroundColor: '#b8b6b6',
  marginLeft:'10px'
};

//定义一个Section子组件
class PropertyAdd extends React.Component{
  //接收父组件传递过来的item
  render(){
    return(
      <div style={{width:'100%',height:'60.5px',backgroundColor:'#f7f7f7'}}>
        <input type="text" readOnly value='资产' style={{fontSize:'18px',width:'60px',height:'60px',color:'#2b2b2b',border:'none',backgroundColor:'transparent',marginLeft:'15px'}}/>
        <Button onClick={this.props.addproperty} style={{background:`url(${AddIcon})`,backgroundSize:'30px 30px',width:'30px',height:'30px',borderStyle: 'none',marginRight:'10px',marginTop:'15px',float:'right'}}/>
        <div style={lineStyle}>
        </div>
      </div>

    );
  }
}

//
PropertyAdd.propTypes = {

  addproperty:PropTypes.function,
};
//定义一个Section子组件
class PropertySection extends React.Component{
  //接收父组件传递过来的item
  render(){
    return(
      <div style={{width:'100%',height:'80.5px'}}>
        <div style={{height:'80px',width:'100%',display: 'inline-flex'}}>
          <img src={require('./images/'+this.props.tokenLogo)} style={{float: 'left',marginTop:'20px',marginLeft:'10px',width:'40px',height:'40px',borderRadius:'50%'}}/>
          <input type="text" readOnly value={this.props.tokenName} style={{fontSize:'16px',width:'60px',height:'80px',color:'#2b2b2b',border:'none',backgroundColor:'transparent',marginLeft:'5px'}}/>
          <div style={{float: 'right',width:'100%',height:'80px',display: 'inline-flex'}}>
            <input type="text" readOnly  value={this.props.tokenAmount} style={{fontSize:'15px',color:'#2b2b2b',border:'none',backgroundColor:'transparent',width:'inherit',height:'80px',textAlign:'right',marginRight:'10px'}}/>
            <Button onClick={this.props.transferAccounts} style={{background:`url(${TransferIcon})`,backgroundSize:'25px 25px',width:'25px',height:'25px',borderStyle: 'none',marginRight:'10px',marginTop:'27.5px'}}/>
          </div>
        </div>
        <div style={lineStyle}>
        </div>
      </div>

    );
  }
}
PropertySection.propTypes = {
  tokenLogo: PropTypes.object,
  tokenName: PropTypes.object,
  tokenAmount: PropTypes.object,
  transferAccounts:PropTypes.function,
};

class PropertySelect extends React.Component{
  state = {
    imageurl: this.props.tokenselected == false? SelectOff:SelectOn
  }
  render(){
    return(
      <div style={{height:'80px',width:'100%'}}>
        <img src={require('./images/'+this.props.tokenLogo)} style={{float: 'left',marginTop:'20px',marginLeft:'10px',width:'40px',height:'40px',borderRadius:'50%'}}/>
        <input type="text" readOnly value={this.props.tokenName} style={{fontSize:'16px',width:'60px',height:'80px',color:'#2b2b2b',border:'none',backgroundColor:'transparent',marginLeft:'5px'}}/>
        <Button id={this.props.buttonId} onClick={this.props.selected} style={{background:`url(${this.state.imageurl})`,float:'right',backgroundSize:'25px 25px',width:'25px',height:'25px',borderStyle: 'none',marginRight:'10px',marginTop:'27.5px'}}/>
        <div style={lineStyle}>
        </div>
      </div>
    );
  }
}

//
PropertySelect.propTypes = {
  tokenLogo: PropTypes.object,
  tokenName: PropTypes.object,
  selected: PropTypes.function,
  switchOn: PropTypes.object,
  buttonId: PropTypes.object,
  tokenselected: PropTypes.object
};
class PropertyList extends React.Component {
  componentDidMount() {
    console.log('sssssss:',this.props.tokenNameArray);
  }
  render() {
    return (
      <div>
        {
          this.props.tokenNameArray.map((obj,index) => {
            console.log('obj======',obj);
            return(
              <PropertySection key={index} tokenLogo={obj.tokenlogo} tokenName={obj.tokenname} tokenAmount='10000.000'/>
            );
          })
        }
      </div>
    );
  }
}
PropertyList.propTypes = {
  tokenNameArray: PropTypes.object,
};
class TokenAsset extends React.Component {
  state = {
    tokenNameArray: []
  };

  constructor(props) {
    super(props);
    this.readPublicKeyFromFile();
  }
  AddTokenNameArray(){
    this.props.onTokenAsset(this.state.tokenNameArray);
    console.log('第一步:::::::',this.state.tokenNameArray);

  }
  //
  async readPublicKeyFromFile() {
    var TokensArray = this.props.publickey;
    var weekArray = await JSON.parse(localStorage.getItem(TokensArray));
    if (weekArray&&weekArray.length>0) {
      console.log('weekArray:',weekArray);
      this.setState({tokenNameArray: weekArray});
    }else{
      try {
        String.format = function(src){
          if (arguments.length == 0) return null;
          var args = Array.prototype.slice.call(arguments, 1);
          return src.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
          });
        };
        var i;
        var arrToken = [];
        for(i = 0; i < info.TokenInfos.length; i++) {
          console.log('tokenpubkey==',info.TokenInfos[i].tokenpubkey);
          var tokenpubkey = new web3.PublicKey(info.TokenInfos[i].tokenpubkey);
          //根据tokenpublickey获取token信息
          var token = new web3.Token(this.props.conn, tokenpubkey);
          var acc = await token.tokenInfo();
          var tokenname = acc.name;
          var tokensymbol = acc.symbol;
          var tokensupply = acc.supply;
          var tokendecimal = acc.decimals;
          var tokenlogo = info.TokenInfos[i].tokenlogo;
          var tokenselected = false;
          var tokenaccpubkey = '';
          var tokenamount = '10';
          var tokenpublickey = info.TokenInfos[i].tokenpubkey;

          // tem += '  代币名称: {' + i + '}  ';
          //根据tokenaccoutpublickey获取余额
          // var tokenaccpubkey = data.TokenPublicKeys[i].tokenaccountpubkey;
          // var accTokenInfo = await token.accountInfo(new web3.PublicKey(tokenaccpubkey));

          // tem += '余额: ' + accTokenInfo.amount;

          arrToken.push({
            tokenpublickey,
            tokenaccpubkey,
            tokenname,
            tokensymbol,
            tokensupply,
            tokendecimal,
            tokenlogo,
            tokenselected,
            tokenamount,
          });

          // msg += String.format(
          //   tem,
          //   acc.name
          // );
        }
        console.log('arrToken:',arrToken);
        this.setState({tokenNameArray: arrToken});

      } catch (err)
      {
        this.addError(err.message);
      }
    }
  }
  addSelectedToken(index){
    console.log('index:::::::',index);

    var tokeninfo = this.state.tokenNameArray[index];
    console.log('tokeninfo:::::::',tokeninfo);

    if (tokeninfo.tokenselected == false) {
      tokeninfo.tokenselected = true;
      document.getElementById('button'+index).style.background=`url(${SelectOn})`;
      document.getElementById('button'+index).style.backgroundSize='25px 25px';
    }else{
      tokeninfo.tokenselected = false;
      document.getElementById('button'+index).style.background=`url(${SelectOff})`;
      document.getElementById('button'+index).style.backgroundSize='25px 25px';
    }
    this.AddTokenNameArray();
  }
  render() {
    return (
      <div>
        {
          this.state.tokenNameArray.map((obj,index) => {
            return(
              <PropertySelect key={index} tokenLogo={obj.tokenlogo} tokenName={obj.tokenname} tokenselected= {obj.tokenselected} buttonId = {'button'+index} selected={()=>this.addSelectedToken(index)}/>
            );
          })
        }
      </div>
    );
  }
}

TokenAsset.propTypes = {
  publickey: PropTypes.object,
  onTokenAsset: PropTypes.function,
  conn: PropTypes.object,
};

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
          <ControlLabel>源地址</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{padding: '3px',backgroundColor: '#337ab7',border:'none'}}><img src="img/send_token.png"/></InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="请输入源地址"
              onChange={(e) => this.handleChange(e)}
            />
            <FormControl.Feedback />
          </InputGroup>
        </FormGroup>
      </form>
    );
  }
}

SourceTokenAccountPubKeyInput.propTypes = {
  onSourceTokenAccountPubKey: PropTypes.function,
  tokenObj: PropTypes.object,
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
          <ControlLabel>目标地址</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{padding: '3px',backgroundColor: '#337ab7',border:'none'}}><img src="img/receive_token.png"/></InputGroup.Addon>
            <FormControl
              type="text"
              id="desttokenaccountpubkey"
              value={this.state.value}
              placeholder="请输入目标地址"
              onChange={(e) => this.handleChange(e)}
            />
            <FormControl.Feedback />
          </InputGroup>

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
          <ControlLabel>转账数量</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{padding: '3px',backgroundColor: '#337ab7',border:'none'}}><img src="img/token_num.png"/></InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="请输入转账数量"
              onChange={(e) => this.handleChange(e)}
            />
            <FormControl.Feedback />
          </InputGroup>
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
          <InputGroup>
            <InputGroup.Addon style={{padding: '3px',backgroundColor: '#337ab7',border:'none'}}><img src="img/token_num.png"/></InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="请输入创建数量"
              onChange={(e) => this.handleChange(e)}
            />
            <FormControl.Feedback />
          </InputGroup>
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
          <ControlLabel>小数点</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{padding: '3px',backgroundColor: '#337ab7',border:'none'}}><img src="img/token_decimal.png"/></InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="请输入小数点位数"
              onChange={(e) => this.handleChange(e)}
            />
            <FormControl.Feedback />
          </InputGroup>
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
    // if (length === 0) {
    //   return 'bitconch';
    // }
    // if (value.match(/^[A-Za-z0-9]+$/)) {
    //   return 'success';
    // }
    // if (length > 44) {
    //   return 'error';
    // }
    // return null;
    if (length > 0) {
      // if (value.match(/^[A-Za-z0-9]+$/)) {
      //   return 'success';
      // }
      // return 'error';
      return 'success';
    } else if (length > 44) {
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
          <ControlLabel>名称</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{padding: '3px',backgroundColor: '#337ab7',border:'none'}}><img src="img/token_name.png"/></InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="请输入名称"
              onChange={(e) => this.handleChange(e)}
            />
            <FormControl.Feedback />
          </InputGroup>
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
      // if (value.match(/^[A-Za-z0-9]+$/)) {
      //   return 'success';
      // }
      // return 'error';
      return 'success';
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
          <ControlLabel>符号</ControlLabel>
          <InputGroup>
            <InputGroup.Addon style={{padding: '3px',backgroundColor: '#337ab7',border:'none'}}><img src="img/token_symbol.png"/></InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="请输入符号"
              onChange={(e) => this.handleChange(e)}
            />
            <FormControl.Feedback />
          </InputGroup>
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
          <input style={{backgroundColor: '#fff',border:'none'}}></input>
          <FormControl type="text" value={this.state.value} placeholder="请输入收款人的地址" onChange={(e) => this.handleChange(e)}/>
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
        <FormGroup validationState={this.state.validationState}>
          <ControlLabel>数量（{this.props.amount}）</ControlLabel>
          <input style={{backgroundColor: '#fff',border:'none'}}></input>
          <FormControl type="text" value={this.state.value} placeholder="请输入交易数量" onChange={(e) => this.handleChange(e)}/>
          <FormControl.Feedback />
        </FormGroup>
      </form>
    );
  }
}
TokenInput.propTypes = {
  amount:PropTypes.object,
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
//
class ExportSercetModal extends React.Component {//transparent
  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <div style={{textAlign:'center'}}>
            <input readOnly value='提示' style={{fontSize:'16px',color:'#2b2b2b',width:'60px',border:'none',backgroundColor:'transparent',textAlign:'center'}}/>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <textarea readOnly size='auto' value='导入后，当前账户相关信息将丢失，如需保存请导出私钥' style={{fontSize:'14px',textAlign:'center',color:'#2b2b2b',border:'none',backgroundColor:'transparent',width:'100%'}}/>
            <SercetkeyInput onSercetkey={key => this.props.exsecretkey(key)}/>
            <div className="text-center">
              <Button onClick={() => this.props.updateaccount()} style={{color:'#fff',backgroundColor:'#2cb782',width:'80px'}}>
                确认
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

ExportSercetModal.propTypes = {
  exsecretkey: PropTypes.function,
  onHide: PropTypes.function,
  updateaccount:PropTypes.function,
};
class ShowModal extends React.Component {//transparent
  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <div style={{textAlign:'center'}}>
            <input readOnly value='提示' style={{fontSize:'16px',color:'#2b2b2b',width:'60px',border:'none',backgroundColor:'transparent',textAlign:'center'}}/>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <textarea readOnly size='auto' value={this.props.showtext} style={{fontSize:'14px',textAlign:'center',color:'#2b2b2b',border:'none',backgroundColor:'transparent',width:'100%'}}/>
            <div className="text-center">
              <Button onClick={() => this.props.onHide()} style={{color:'#fff',backgroundColor:'#2cb782',width:'80px'}}>
                关闭
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

ShowModal.propTypes = {
  showtext: PropTypes.object,
  onHide: PropTypes.function,
};
//
class TransferModal extends React.Component {
  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <div style={{textAlign:'center'}}>
            <input readOnly value='转账' style={{fontSize:'16px',color:'#2b2b2b',width:'60px',border:'none',backgroundColor:'transparent',textAlign:'center'}}/>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div style={{'padding': '5px 0 5px 0',textAlign:'center'}}>
              <img src={require('./images/'+this.props.logo)} style={{width:'50px',height:'50px'}}/>
            </div>
            <div style={{'padding': '0 0 5px 0',textAlign:'center'}}>
              <span>{this.props.name}</span>
            </div>
            <PublicKeyInput onPublicKey={(publicKey) => this.props.topublickey(publicKey)}/>
            <TokenInput onAmount={(amount) => this.props.transferamount(amount)} amount={this.props.amount}/>
            <div className="text-center">
              <Button onClick={() => this.props.transfer()} style={{backgroundColor:'#2cb782',color:'#fff',width:'80px'}}>发送</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

TransferModal.propTypes = {
  logo: PropTypes.object,
  name: PropTypes.object,
  amount:PropTypes.object,
  topublickey: PropTypes.function,
  transferamount: PropTypes.function,
  onHide: PropTypes.function,
  transfer:PropTypes.function,
};
//
class AddPropertyModal extends React.Component {
  state={
    tokenNameArray:[],
  }
  PostPoroertyList(tokenarr){
    this.props.tokenarr(tokenarr);
    console.log('第2步:::::::',tokenarr);

  }
  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <div style={{textAlign:'center'}}>
            <input readOnly value='添加新资产' style={{fontSize:'16px',color:'#2b2b2b',width:'80px',border:'none',backgroundColor:'transparent',textAlign:'center'}}/>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <TokenAsset conn={this.props.web3sol} publickey={this.props.publickey} onTokenAsset={(tokenarr)=>this.PostPoroertyList(tokenarr)}/>
            </div>
            <div className="text-center">
              <Button onClick={() => this.props.addsure()} style={{backgroundColor:'#2cb782',color:'#fff',width:'80px',marginTop:'10px'}}>确定</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

AddPropertyModal.propTypes = {
  publickey: PropTypes.object,
  web3sol: PropTypes.object,
  offSelect: PropTypes.function,
  onSelect: PropTypes.function,
  onHide: PropTypes.function,
  addsure: PropTypes.function,
  tokenarr: PropTypes.function,
};
//
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
    transferModal:false,
    mysecretKey:null,
    balance: 0,
    recipientPublicKey: null,
    recipientAmount: null,
    confirmationSignature: null,
    transactionConfirmed: null,
    tokenSupply: new web3.TokenAmount(0),
    tokenName: null,
    tokenSymbol: null,
    tokenDecimal: 0,
    tokenAmount: 0,
    tokenLogo: null,
    tokenAccPubkey: null,
    tokenPublicKey: null,
    newTokenAcountAddr: null,
    sourceTokenAccountPublicKey: null,
    destTokenAccountPublicKey: null,
    transferTokenAmount: 0,
    sourceTokenAccountTokenAmount: 0,
    destTokenAccountTokenAmount: 0,
    tokenObj: null,
    newTokenAccountPublicKey: null,
    createdTokenInfoList: [],
    tokenAccountPubkeyList: [],
    tokenInfoInnerHtml: null,
    tokenNameArray: [],
    showText:null,
    showModal: false,
    addPropertyModal:false,
    tokenArr: [],
    displaydetail: 'none'
  };

  constructor(props) {
    super(props);
    this.onStoreChange();
    this.getArrayFromlocal();
  }
  async getArrayFromlocal(){
    var TokensArray = this.web3solAccount.publicKey.toString();
    var weekArray =  await JSON.parse(localStorage.getItem(TokensArray));
    this.setState({tokenNameArray: weekArray});
    this.loadlocalarr(weekArray);
  }
  async loadlocalarr(array){
    var tokensArr = [];
    for (var i = 0; i < array.length; i++) {
      var tokens = array[i];
      if (tokens.tokenselected == true) {
        var publickey = new web3.PublicKey(tokens.tokenpublickey);
        var token = new web3.Token(this.web3sol, publickey);
        var tokenaccpubkey = tokens.tokenaccpubkey;
        if (tokenaccpubkey.length == 0){
          var newtokenaccpubkey =  await token.newAccount(this.web3solAccount);
          tokens.tokenaccpubkey = newtokenaccpubkey.toString();
          const newTokenAccountInfo = await token.accountInfo(newtokenaccpubkey);
          tokens.tokenamount = newTokenAccountInfo.amount.toString();
        }else{
          var accpublickey = new web3.PublicKey(tokenaccpubkey);
          const newTokenAccountInfo = await token.accountInfo(accpublickey);
          tokens.tokenamount = newTokenAccountInfo.amount.toString();
        }

      }
      tokensArr.push(tokens);

    }
    this.setState({tokenArr: array,addPropertyModal: false});
  }

  getTokenDetails(){
    var i;
    // var tem = '';
    // var msg = '';
    var arrTokenDetails = [];
    for(i = 0; i < info.TokenDetail.length; i++) {
      arrTokenDetails.push(info.TokenDetail[i]);
    }
    alert(arrTokenDetails);
    return arrTokenDetails;
  }

  setConfirmationSignature(confirmationSignature) {
    this.setState({
      transactionConfirmed: null,
      confirmationSignature
    });
  }

  setSourceTokenAccountPublicKey(token) {
    var to = new web3.Token(this.web3sol, token.tokenpubkey);
    this.setState({
      sourceTokenAccountPublicKey: token.tokenaccpubkey,
      tokenObj: to
    });  }

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

  selectOn(){

  }
  selectOff(){

  }
  addPorpertyList(tokenarr){
    console.log('tokenarr======',tokenarr);
    this.setState({tokenNameArray: tokenarr});
  }
  ResetListForPorperty(){
    this.createNewTokenAccount();
  }
  copyPublicKey() {
    copy(this.web3solAccount.publicKey);
    this.setState({showText:'地址已复制到粘贴板',showModal: true});

  }

  copyTokenAccountPublicKey() {
    copy(this.state.newTokenAcountAddr);
  }

  copyNewTokenAccountPublicKey() {
    copy(this.state.newTokenAccountPublicKey);
  }

  createNewTokenAccount() {
    this.runModal(
      '正在添加',
      '请稍后...',
      async () => {
        var tokensArr = [];
        for (var i = 0; i < this.state.tokenNameArray.length; i++) {
          var tokens = this.state.tokenNameArray[i];
          if (tokens.tokenselected == true) {
            var publickey = new web3.PublicKey(tokens.tokenpublickey);
            var token =  new web3.Token(this.web3sol, publickey);
            var tokenaccpubkey = tokens.tokenaccpubkey;
            if (tokenaccpubkey == ''){
              var newtokenaccpubkey = await token.newAccount(this.web3solAccount);
              var newTokenAccountInfo = await  token.accountInfo(newtokenaccpubkey);
              token.tokenaccpubkey = newtokenaccpubkey.toString();
              tokens.tokenamount = newTokenAccountInfo.amount.toString();
            }else{
              var accpublickey = new web3.PublicKey(tokenaccpubkey);
              var newTokenAccountInfo1 = await token.accountInfo(accpublickey);
              tokens.tokenamount = newTokenAccountInfo1.amount.toString();
            }
          }
          tokensArr.push(tokens);
        }
        var TokensArray = this.web3solAccount.publicKey.toString();
        localStorage.setItem(TokensArray,JSON.stringify(tokensArr));
        this.setState({tokenArr: tokensArr,addPropertyModal: false});
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
          new web3.PublicKey(this.state.destTokenAccountPublicKey),
          this.state.transferTokenAmount,
        );
        const signature = await this.web3sol.sendTransaction(transaction,this.web3solAccount);

        await this.web3sol.confirmTransaction(signature);
        this.setState({transferModal: false,showText:'发送成功',showModal: true});
        this.setState({
          balance: await this.web3sol.getBalance(this.web3solAccount.publicKey),
          tokenAmount: await this.web3sol.getBalance(this.web3solAccount.publicKey)
        });
      }
    );
  }

  transferToken() {
    if (this.state.destTokenAccountPublicKey == null||this.state.destTokenAccountPublicKey.length == 0) {
      alert('请输入收款地址');
      return;
    }
    if (this.state.destTokenAccountPublicKey == null||this.state.destTokenAccountPublicKey == 0) {
      alert('请输入转账金额');
      return;
    }
    if (this.state.destTokenAccountPublicKey == this.state.tokenAccPubkey) {
      alert('不能转给自己');
      return;
    }
    if (this.state.tokenAccPubkey == this.web3solAccount.publicKey.toString()) {
      alert('pubkey:::'+this.state.destTokenAccountPublicKey);
      this.sendTransaction();
      return;
    }

    this.runModal(
      '发送Token',
      '请稍后...',
      async () => {
        var token = await new web3.Token(this.web3sol, new web3.PublicKey(this.state.tokenPublicKey));
        var sourcetokenacc = await token.accountInfo(new web3.PublicKey(this.state.tokenAccPubkey));
        if (new Number(sourcetokenacc.amount) < new Number(this.state.transferTokenAmount)) {
          alert('token数量不足，无法完成交易! 当前账户Token数量：' + sourcetokenacc.amount);
          return;
        }
        const sig = await token.transfer(
          this.web3solAccount,
          new web3.PublicKey(this.state.tokenAccPubkey),
          new web3.PublicKey(this.state.destTokenAccountPublicKey),
          this.state.transferTokenAmount
        );
        await this.web3sol.confirmTransaction(sig);
        sourcetokenacc = await token.accountInfo(new web3.PublicKey(this.state.tokenAccPubkey));
        var desttokenacc = await token.accountInfo(new web3.PublicKey(this.state.destTokenAccountPublicKey));
        this.setState({transferModal: false,showText:'发送成功',showModal: true});
        this.setState({
          tokenAmount: sourcetokenacc.amount.toString(),
          destTokenAccountTokenAmount: desttokenacc.amount.toString(),
        });
        this.getArrayFromlocal();
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
        alert('token publickey: ' + token.token);
        this.setState({
          tokenObj: token,
        });
        const newTokenAccountInfo = await token.accountInfo(pubkey);
        var tokenAmount = newTokenAccountInfo.amount;

        var arr = this.state.createdTokenInfoList;
        arr.push({token, pubkey});
        var arr_pubkey = this.state.tokenAccountPubkeyList;
        arr_pubkey.push(pubkey);
        this.setState({
          tokenAmount: tokenAmount.toString(),
          newTokenAcountAddr: pubkey.toString(),
          createdTokenInfoList: arr,
          tokenAccountPubkeyList: arr_pubkey,
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
        this.setState({
          balance: await this.web3sol.getBalance(this.web3solAccount.publicKey),
        });
      }
    );
  }

  exportPrivateKey() {
    copy(this.web3solAccount.secretKey);
    this.setState({showText:'私钥复制到粘贴板，请妥善保管',showModal: true});

  }
  copyAccountPublickey(){
    copy(this.state.tokenAccPubkey);
    this.setState({showText:'收款地址已复制到粘贴板',showModal: true});
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
  pushNewWindow(index){
    if (index == 999) {
      this.setState({tokenName: 'BUS',tokenAmount:this.state.balance,tokenAccPubkey:this.web3solAccount.publicKey.toString(),tokenLogo: 'account_head.png',tokenPublicKey:this.web3solAccount.publicKey.toString()});
    }else{
      var token = this.state.tokenArr[index];
      this.setState({tokenName: token.tokenname,tokenAmount: token.tokenamount,tokenAccPubkey: token.tokenaccpubkey,tokenLogo: token.tokenlogo,tokenPublicKey: token.tokenpublickey});
    }
    this.setState({displaydetail: 'block'});
  }
  closeNewWindow(){
    this.setState({displaydetail: 'none'});
  }
  render() {
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
    const transferModal = this.state.transferModal ? (
      <TransferModal
        show
        onHide={() => this.setState({transferModal: false})}
        transfer={() => this.transferToken()}
        topublickey={key => this.setDestTokenAccountPublicKey(key)}
        transferamount={key => this.setTransferTokenAmount(key)}
        amount={this.state.tokenAmount}
        name = {this.state.tokenName}
        logo = {this.state.tokenLogo}
      />
    ) : null;
    const showModal = this.state.showModal ? (
      <ShowModal
        show
        showtext={this.state.showText}
        onHide={() => this.setState({showModal: false})}
      />
    ) : null;
    const addPropertyModal = this.state.addPropertyModal ? (
      <AddPropertyModal
        show
        publickey = {this.web3solAccount.publicKey.toString()}
        web3sol = {this.web3sol}
        tokenarr = {(tokenarr) => this.addPorpertyList(tokenarr)}
        addsure = {() => this.ResetListForPorperty()}
        onSelect = {() => this.selectOn()}
        offSelect = {() => this.selectOff()}
        onHide={() => this.setState({addPropertyModal: false})}
      />
    ) : null;

    const settingsModal = this.state.settingsModal ?
      <SettingsModal show store={this.props.store} onHide={() => this.setState({settingsModal: false})}/> : null;
    return (
      <div style={{width:'100%'}}>
        {busyModal}
        {settingsModal}
        {exportSercetModal}
        {transferModal}
        {showModal}
        {addPropertyModal}
        <DismissibleErrors errors={this.state.errors} onDismiss={(index) => this.dismissError(index)}/>
        <div style={{width:'100%',height:'100%',position:'absolute',zIndex:'999',opacity:'1',backgroundColor:'#fff',display:this.state.displaydetail}}>
          <PropertyDetail store={this.props.store} closedetail = {() => this.closeNewWindow()} tokenname={this.state.tokenName} tokenamount={this.state.tokenAmount} tokenaccpubkey={this.state.tokenAccPubkey} rechangeamount={()=>this.setState({transferModal: true})} showcode={()=>this.copyAccountPublickey()}/>
        </div>
        <div style={sectionStyle}>
          <div style={{'padding': '35px 0 15px 0',textAlign:'center'}}>
            <img src={require('./images/bus_white.png')} style={{width:'60px',height:'60px'}}/>
          </div>
          <p />
          <FormGroup style={{textAlign:'center',width:'100%'}}>
            <InputGroup  style={{display: 'inline-flex'}}>
              <FormControl readOnly type="text" size="60%"  value={this.web3solAccount.publicKey} style={{fontSize:'auto',backgroundColor: 'transparent',borderStyle:'none',color:'#fff',textAlign:'center',boxShadow: 'none',float:'none'}}/>
              <InputGroup.Button>
                <Button onClick={() => this.copyPublicKey()} style={{background:`url(${CopyIcon})`,backgroundSize:'30px 30px',width:'30px',height:'30px',borderStyle: 'none'}}/>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <div style={{textAlign:'center'}}>
            <Button  onClick={() => this.setState({exportSercetModal: true})} style={{'marginRight':'20px',color:'#5c83f5'}}>
            导入私钥
            </Button>
            <Button  onClick={() => this.exportPrivateKey()}  style={{'marginLeft':'20px',borderColor:'#fff',color:'#fff',backgroundColor: 'transparent'}}>
            导出私钥
            </Button>
          </div>
        </div>
        <p/>
        <div style={{width:'100%'}}>
          <PropertyAdd addproperty={() => this.setState({addPropertyModal: true})}/>
        </div>
        <div style={{width:'100%'}}>
          <PropertySection tokenLogo='account_head.png' tokenName='BUS' tokenAmount={this.state.balance} transferAccounts={() => this.pushNewWindow(999)} />
          {
            this.state.tokenArr.map((obj,index) => {
              if (obj.tokenselected==true) {
                return(
                  <PropertySection key={index} tokenLogo={obj.tokenlogo} tokenName={obj.tokenname} tokenAmount={obj.tokenamount} transferAccounts={() => this.pushNewWindow(index)}/>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
}
Wallet.propTypes = {
  store: PropTypes.object,
};

