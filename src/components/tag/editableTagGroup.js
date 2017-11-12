import { Tag, Input, Tooltip, Button } from 'antd'
import styles from  './styles.less'

export default class EditableTagGroup extends React.Component {
  state = {
    tags: [],
  }

  componentWillReceiveProps(nextProps){
    this.setState({ tags:nextProps.tags })
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag)
    this.props.onClose(removedTag)
    this.setState({ tags })
  }

  render() {
    const { tags } = this.state
    return (
      <div className={styles.container}>
        {tags.map((tag, index) => {
          const isLongTag = tag.name.length > 20
          const tagElem = (
            <Tag key={tag.id} closable afterClose={() => this.handleClose(tag)} style={{backgroundColor:"#3498db",color:"white"}}>
              {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </Tag>
          )
          return isLongTag ? <Tooltip title={tag.name}>{tagElem}</Tooltip> : tagElem
        })}
      </div>
    );
  }
}

