import React from 'react';
import {
  Button
} from 'react-bootstrap';
import PropTypes from 'prop-types';

import Close from './images/show_close.png';

//定义一个Section子组件
export class PropertyDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  //接收父组件传递过来的item
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render(){
    return(
      <div style={{width:'100%',height:'100%',backgroundColor:'#f7f7f7'}}>
        <div style={{width:'100%',backgroundColor:'#fff'}}>
          <div style={{width:'100%',height:'50px',backgroundColor:'#fff'}}>
            <Button onClick={()=>this.props.closedetail()} style={{background:`url(${Close})`,backgroundSize:'25px 25px',width:'25px',height:'25px',borderStyle: 'none',marginLeft:'10px',marginTop:'15px',float:'left'}}>
            </Button>
          </div>
          <div style={{width:'100%',backgroundColor:'#fff'}}>
            <input type="text" readOnly  value={this.props.tokenname} style={{fontSize:'18px',color:'#2b2b2b',border:'none',backgroundColor:'transparent',width:'100%',height:'40px',textAlign:'center',float:'center'}}/>
          </div>
          <div style={{width:'100%',backgroundColor:'#fff'}}>
            <input type="text" readOnly  value={this.props.tokenamount} style={{fontSize:'18px',color:'#3b3b3b',border:'none',backgroundColor:'transparent',width:'100%',height:'40px',textAlign:'center',float:'center'}}/>
          </div>
        </div>
        <div style={{width:'100%',height:'40px',backgroundColor:'#f7f7f7',bottom:'0',position:'fixed'}}>
          <Button onClick={()=>this.props.rechangeamount()} style={{backgroundColor:'#3252c6',width:'50%',height:'40px',color:'#fff'}}>
          转账
          </Button>
          <Button onClick={()=>this.props.showcode()} value='收款' style={{backgroundColor:'#2cb782',width:'50%',height:'40px',color:'#fff'}}>
          收款
          </Button>
        </div>
      </div>
    );
  }
}
PropertyDetail.propTypes = {
  store: PropTypes.object,
  tokenname: PropTypes.object,
  tokenamount: PropTypes.object,
  tokenaccpubkey: PropTypes.object,
  showcode: PropTypes.function,
  rechangeamount: PropTypes.function,
  closedetail: PropTypes.function
};
