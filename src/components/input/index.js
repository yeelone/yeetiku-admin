import React from 'react'
import { Input,Button  } from 'antd'

export default class AddInput2 extends React.Component {
    componentDidMount(){
        // this.myInput.focus()
        // this.myInput.setSelectionRange(0, this.myInput.value.length)
    }

    handleClick = () => {
        // this.myInput.focus()
        // this.myInput.setSelectionRange(0, this.myInput.value.length)
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
                <Input ref={(input) => { this.myInput = input }}  defaultValue={this.props.defaultValue} onBlur={this.onBlur} onPressEnter={this.handlerPressEnter} style={{ width: "80%"}}/>
                <Button icon="enter"></Button>
            </div>
        )
    }
}