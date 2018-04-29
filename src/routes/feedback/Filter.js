import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Switch } from 'antd'
import { Search } from '../../components'
import { config } from '../../utils'

const Filter = ({
  field,
  keyword,
  onSearch,
  isMotion,
  switchIsMotion,
}) => {
  const searchGroupProps = {
    field,
    keyword,
    size: 'large',
    select: true,
    selectOptions: [{ value: 'content', name: '内容' }, { value: 'creator', name: '回馈者' }],
    selectProps: {
      defaultValue: field || 'content',
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
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
}

export default Form.create()(Filter)
