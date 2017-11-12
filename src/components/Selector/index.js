import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styles from './Selector.less'
import { Transfer,Modal } from 'antd'

class  Selector extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            targetKeys:this.props.targetKeys,
            sourceData:[],
            selectedKeys: [],
        };
    }

    wrapData = (sourceData) => {
        var data = [] ;
        if (!sourceData) {
            data = [];
        }else{
            for ( let i =0 ; i < sourceData.length ; i++) {
                data.push({
                    key: sourceData[i].id,
                    title: sourceData[i].name,
                    description: ``,
                });
            }
        }
        return data ;
  }

    handleOk =  () => {
        this.props.onOk(this.state.targetKeys)
    }
    
    handleCancle = () => {
        this.props.onCancel()
    }

    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    }

    render (){
        const modalOpts = {
            title: `关联用户`,
            visible:this.props.visible || false,
            onOk: this.handleOk,
            onCancel:this.handleCancle,
            wrapClassName: 'vertical-center-modal',
        }

        const data = this.wrapData(this.props.sourceData)
        return (
            <Modal {...modalOpts} width={ styles.modal }>
                <Transfer
                    showSearch
                    dataSource={data}
                    titles={['Source', 'Target']}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange}
                    render={item => item.title}
                    listStyle={{
                        width: 250,
                        height: 500,
                    }}
                />
            </Modal>
        )
    }
      
}


Selector.propTypes = {
}

export default Selector
