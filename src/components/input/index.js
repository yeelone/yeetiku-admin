import React,{PropTypes} from 'react'
import { Input,Button  } from 'antd'

export default class AddInput extends React.Component {
    componentDidMount(){
        const input = this.refs.myInput.refs.input
        input.focus()
        input.setSelectionRange(0, input.value.length)
    }

    handleClick = () => {
        const input = this.refs.myInput.refs.input
        input.focus()
        input.setSelectionRange(0, input.value.length)
    }

    onBlur = (e) =>{
        if (_.has(this.props, 'onBlur')){
            this.props.onBlur(e.target.value) 
        }
        
    }
    
    handlerPressEnter = (e) => {
        this.props.onEnter(e.target.value)
    }

    render(){
        return (
            <div>
                <Input ref="myInput" defaultValue={this.props.defaultValue} onBlur={this.onBlur} onPressEnter={this.handlerPressEnter} style={{ width: "80%"}}/>
                <Button icon="enter"></Button>
            </div>
        )
    }
}