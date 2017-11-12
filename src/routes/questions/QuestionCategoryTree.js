import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { listToTree,config } from '../../utils'
import EditableTree from '../../components/EditableTree'

function tree({categories,dispatch,onSelect}) {

    const { list } = categories 
    const parseTreeData = ( list ) => {
    var top ={ 0 : { name: config.name , id : 0 ,parent:0, children:[] } }
    if ( !( _.isEmpty( list ))) {
       top['0'].children =  listToTree(list)
    }
    return top 
  }
  const TreeProps = {
    // treeData : [
    //       { name: 'pNode 01', id: '0-0' },
    //       { name: 'pNode 02', id: '0-1' },
    //       { name: 'pNode 03', id: '0-2', isLeaf: true },
    // ],
    treeData: parseTreeData(list),
    onCreateNewNode: ({name,parent}) => {
      dispatch({
        type: 'categories/create',
        payload: { name , parent },
      })
    },
    onChange:(node) =>{
      dispatch({
        type: 'categories/update',
        payload: { ...node },
      })
    },
    onDelete:(id)=>{
      dispatch({
        type: 'categories/delete',
        payload: { id },
      })
    },
    onSelect:(selectedKeys)=>{
      onSelect(Number(selectedKeys[0]))
    }
  }

  return (
      <EditableTree {...TreeProps}/>
  )
}

// tree.propTypes = {
//   categories: PropTypes.object,
//   dispatch: PropTypes.func,
// }

// export default connect(({ categories }) => ({  categories }))(tree)

export default  tree 