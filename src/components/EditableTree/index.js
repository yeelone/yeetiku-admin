import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown,Input, Tree,Button,Icon } from 'antd'

import "./style.css"

const TreeNode = Tree.TreeNode
function randomInt(start, end){
    return Math.floor(Math.random() * (end - start) + start)
}

/*todo: 1、删除时设置倒计时
   *    2、回车时保存
   *    
*/
class AddInput extends React.Component {
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
        this.props.onEnter(this.props.node ,e.target.value) 
    }
    
    handlerPressEnter = (e) => {
        this.props.onEnter(this.props.node ,e.target.value)
    }

    render(){
        return (
            <div>
                <Input ref="myInput" defaultValue={this.props.defaultValue} onBlur={this.onBlur} onPressEnter={this.handlerPressEnter}/>
            </div>
        )
    }
}

class EditableTree extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            expandedKeys: ['0',],
            autoExpandParent: true,
            checkedKeys: ['0'],
            selectedKeys: ['0'],
            treeData:{},
        }
    }

    saveNewNode = (node,name) => {
        node['name'] = name 
        this.props.onCreateNewNode({name,parent:Number(this.state.selectedKeys[0])})
    }

    updateNode = (node,name) => {
        node['name'] = name    
        this.props.onChange({id: node.key , name , parent:Number(this.state.selectedKeys[0])})
    }

    insertNewTreenode = () => {
        let node = this.getCurrentNode(this.state.selectedKeys[0])
        if ( ! (_.has(node,'children')) ) {
                 node['children'] ={}  
        }
        let tempKey = randomInt(10000,20000) // 生成一个临时key 
        node['children'][tempKey] = {
            key:tempKey,
            id:tempKey,
            parent_id:node.id,
            children:{},
        }
        node['children'][tempKey].name = <AddInput  onEnter={this.saveNewNode} node={node['children'][tempKey]} />
        let expandedKeys = this.state.expandedKeys 
        expandedKeys.push(node.key+'')
        this.setState({expandedKeys})
        return node 
    }

    createNode = (e) => {
        this.insertNewTreenode() 
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        })
    }

    onSelect = (selectedKeys, info) => {
        if ( info.selected ) {
            this.setState({ selectedKeys }) 
            this.props.onSelect(selectedKeys)
        }
    }
    
    //找到一个节点
    getCurrentNode = (selectedKey) => {
        const treeData = this.props.treeData 
        var node = {}
        const loop = data => Object.keys(data).some ( (item) => {
            let itemstr = item + '' 
            if ( itemstr === selectedKey ) {
                node = data[itemstr]
                return true  
            }else{
                if (!( _.isEmpty(data[itemstr].children) )) {
                    loop(data[itemstr].children) 
                }
                return false 
            }
        } ) 
        loop(treeData)  
        return node  
    }

    removeNode = () => {
        this.props.onDelete(Number(this.state.selectedKeys[0]))
    } 

    renameNode = () => {
        let node = this.getCurrentNode(this.state.selectedKeys[0])
        node['name'] = <AddInput defaultValue={node.name} onEnter={this.updateNode} node={node}/>  
        this.forceUpdate()
    } 

    renderTitleWithMenu = (title) => {
        const menu = (
            <Menu>
                <Menu.Item >
                    <Button onClick={this.renameNode}>重命名</Button>
                </Menu.Item>
                <Menu.Item>
                    <Button onClick={this.removeNode}>删除</Button>
                </Menu.Item>
            </Menu>
            )
        return (
            <span>
                <span> { title } </span>
                <Dropdown overlay={menu} trigger={['click']}>
                     <Icon type="down" /> 
                </Dropdown>
            </span>
        )
    }

    render(){
        const loop = data => Object.keys(data).map ( (item) => {
            let node = data[item]
            const name = this.renderTitleWithMenu(node.name)
            if ( _.isEmpty(node.children) ) {
                return <TreeNode title={name} key={item} isLeaf={true}/>
            }else {
                return <TreeNode title={name} key={item}>{loop(node.children)}</TreeNode>
            }
        })
        return (
            <div  className="category-tree-container">
                <div className="actions-bar"> 
                        <Button onClick={this.createNode}>
                            <Icon type="folder-add" />
                        </Button>
                </div>
                <Tree
                    showLine className="myCls"
                    treeDefaultExpandAll
                    onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
                    >
                            {loop(this.props.treeData)}
                    </Tree> 
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//   return {
//      treeData: listToTree(state.category.categories ,{
//                             idKey: 'id',
//                             parentKey: 'parent_id',
//                             childrenKey: 'children'
//                         })
//    }
// }

EditableTree.propTypes = {
     treeData: PropTypes.object,
     onCreateNewNode:PropTypes.func,
}

export default EditableTree