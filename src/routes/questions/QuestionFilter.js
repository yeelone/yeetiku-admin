import React, { PropTypes } from 'react'
import { Form, Button, Row, Col, Switch } from 'antd'
import { Search } from '../../components'
import { config } from '../../utils'

const QuestionFilter = ({
  field,
  keyword,
  onSearch,
  onAdd,
  onImport,
  importResult,
  onDeleteImportResult,
  isMotion,
  switchIsMotion,
}) => {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'subject', name: '题目' }, { value: 'type', name: '类型' }],
    selectProps: {
      defaultValue: field || 'subject',
    },
    onSearch: (value) => {
      onSearch(value)
    },
  }

  const renderImportResult = () =>  {
    if ( importResult ){
      if (!importResult.success){
        return (
          <div>
              <a href={config.server + importResult.content} target="_blank">导入完成，点击查看导入结果 </a>
              <Button type="dashed" shape="circle" icon="close" onClick={ () => onDeleteImportResult() } />
          </div>
        )
      }
    }
  }

  return (
    <Row gutter={24}>
      <Col lg={8} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <Search {...searchGroupProps} />
      </Col>
      <Col lg={{ offset: 8, span: 8 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        { renderImportResult()  }
        <Button size="large" type="ghost" onClick={onAdd}>添加</Button>
        <Button size="large" type="ghost" onClick={onImport}>导入</Button>
      </Col>
    </Row>
  )
}

QuestionFilter.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
}

export default Form.create()(QuestionFilter)
