import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichInput extends React.Component {
      render() {
        return (
            <Editor 
            localization={{ locale: 'zh' }}
            toolbar={{
              options: ['textIndent', 'list']
            }}
            />
        )
      }
}