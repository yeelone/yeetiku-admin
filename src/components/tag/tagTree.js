import React from 'react'
import PropTypes from 'prop-types'
import { Layout,Menu,Icon,Tag,Breadcrumb,Popconfirm,message   } from 'antd'
const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu
const { CheckableTag } = Tag
import styles from  './styles.less'
import Input from '../input'

class MyTag extends React.Component {
    state = { checked: false }
    handleChange = (checked) => {
      this.setState({ checked })
      this.props.handleChange(checked)
    }

    cancel = (e) => {
        message.error('Click on No')
      }

    render() {
      return (
        <div className={styles.tag}>
          <CheckableTag  checked={this.state.checked} onChange={this.handleChange} >
          { this.props.title  }
          </CheckableTag>
          <Popconfirm 
            title="删除父标签将会同时删除所有子标签，你确定吗?" 
            onConfirm={(e) => this.props.onConfirm(e)} 
            onCancel={this.cancel} 
            okText="Yes" 
            cancelText="No">
            <Icon type="close" /> 
        </Popconfirm>
        </div>
      )
    }
  }


//这个组件会渲染三级标签
class EditableTagTree extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            content:"",
            level1:{},
            level2:{},
            branch:[],  //branch 格式如  [12,24] ，表示父ID是24, 24的父ID是12 
            default:{},
            checked: false,
            latest:"",
        }
    }

    componentWillReceiveProps(nextProps){
        const tree = this.props.tagsTree
        let item = {}
        if ( this.state.latest ) {
            item = tree[this.state.latest]
        } else {
            item = tree[Object.keys(tree)[0]]
        }
        
        if  ( _.has(item, 'tag') && item.tag ){
            this.setState({level1: item.tag ,   content:this.renderLevel2(item)})
        }else{
            this.setState({level1: {}, level2:{},   content:""})
        }
     }


    addTag = (value) => {
        this.props.onEnter(value, this.state.branch)
    }

    addL1Tag = (value) => {
        this.props.onEnter(value, [])
    }
    
    _setBranch = (parent, child) => {
        let branch = []
        if ( parent ) {
            switch(parent.level) {
                case 1 : branch = [parent.id]
                        break 
                case 2:  branch = [parent.parent, parent.id ]
                    break 
            }
        }

        this.setState({branch})
        return branch
    }

    handleClose = (parent, child) => {
        const branch = this._setBranch(parent, child)
        this.props.onClose(child.id, branch)
    }

    handleL2Click = (tag) => {
        let newBranch = this.state.branch
        newBranch = [tag.parent, tag.id]
        this.setState({level2: tag ,branch:newBranch})
    }

    onSelected = (checked, node) => {
        this.props.onSelected(checked, node)
    }

    cancel = (e) => {
        message.error('Click on No')
    }

    handleL1Click = (e) => {
        const key = e.key 
        const item = this.props.tagsTree[e.key] 
        this.setState({ 
            level1: item.tag,
            level2:{},
            branch:[item.tag.id], 
            latest:item.tag.id,
            content:this.renderLevel2(item) 
        })
    }

    renderLevel1 = (node) => {
        if ( _.has(node , "id")  ) {
            return (
                <Menu.Item  key={node.id} >
                    <span className={styles.level1_name}>{node.name}</span>
                    <Popconfirm 
                        title="删除父标签将会同时删除所有子标签，你确定吗?" 
                        onConfirm={(e) =>this.handleClose(null,node)} 
                        onCancel={this.cancel} 
                        okText="Yes" 
                        cancelText="No">
                        <Icon type="close" /> 
                    </Popconfirm>
                </Menu.Item>
    
            )
        }
    }

    renderLevel2 = (node) => {
        return (
                Object.keys(node.children).map((key)=>{
                    const parent = node.children[key]
                   
                    if (parent.tag){
                        return (
                            <div key={parent.tag.id}>
                                <div className={styles.tagitem}>
                                    <span onClick={() => this.handleL2Click(parent.tag)} className={styles.level2} > 
                                        { parent.tag.name } 
                                    </span>
                                    <span style={{fontSize:"14px"}} >  
                                            <Popconfirm title="删除父标签将会同时删除所有子标签，你确定吗?" onConfirm={(e) =>this.handleClose(node.tag,parent.tag)} onCancel={this.cancel} okText="Yes" cancelText="No">
                                                <Icon type="close" /> 
                                            </Popconfirm>
                                    </span> 
                                </div>
                                {Object.keys(parent.children).map((key2)=>{
                                    const child = parent.children[key2].tag
                                    if (child){
                                        return(
                                            <MyTag key={child.id}  
                                                style={styles.tag} 
                                                onConfirm={(e) => this.handleClose(parent.tag,child)} 
                                                title={child.name} 
                                                handleChange={(checked) => this.onSelected(checked, child)}/>
                                        )
                                    }
                                    
                                })}
                            </div>
                        )
                    }
                })
        )
    } 

    render(){
        const { tagsTree,tagsTreeTotal } = this.props
        return (
            <div>
                <Layout>
                    <Layout>
                        <Sider>
                            <Menu
                                onClick={this.handleL1Click}
                                defaultOpenKeys={['sub1']}
                                mode="inline">
                                <SubMenu key="sub1" title={<span><Icon type="tags" /><span>一级标签</span></span>}>
                                    <Input ref="myInput"  onEnter={this.addL1Tag} />
                                    {
                                        Object.keys(tagsTree).map((key)=>{
                                            const item = tagsTree[key].tag
                                            return this.renderLevel1(item)
                                        })
                                    }
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content style={{padding:"10px"}}>
                            <Breadcrumb>
                            { this.state.level1 ? 
                                <Breadcrumb.Item>{this.state.level1.name}</Breadcrumb.Item> : null }
                            
                            { this.state.level2 ? 
                                <Breadcrumb.Item>{this.state.level2.name}</Breadcrumb.Item> : null }
                            </Breadcrumb>
                            <Input ref="myInput"  onEnter={this.addTag} />
                            {this.state.content}
                        </Content>
                    </Layout>
                </Layout>
             </div>
        )
    
    }
    

    
}

export default  EditableTagTree

