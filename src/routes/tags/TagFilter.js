import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Switch } from 'antd'
import { Search } from '../../components'

const TagFilter = ({
  field,
  keyword,
  onSearch,
  onAdd,
  isMotion,
  switchIsMotion,
}) => {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'name', name: '标签名' }],
    selectProps: {
      defaultValue: field || 'name',
    },
    onSearch: (value) => {
      onSearch(value)
    },
  }
  return (
    <Row gutter={24}>
      <Col lg={8} md={12} sm={16} xs={24} style={{ marginBottom: 16 }}>
        <Search {...searchGroupProps} />
      </Col>
      <Col lg={{ offset: 8, span: 8 }} md={12} sm={8} xs={24} style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button size="large" type="ghost" onClick={onAdd}>添加</Button>
      </Col>
    </Row>
  )
}

TagFilter.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
}

export default Form.create()(TagFilter)
