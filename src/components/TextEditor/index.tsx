import React, { ReactElement, useState } from 'react';
import Tinymce, { Editor } from '@tinymce/tinymce-react';

import FileManager from '../FileManager';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { Button, Modal } from 'antd';
import usePath from '../../hoxmodels/path'
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

interface Props {
  value: any;
  onChange: any;
}

function TextEditor({ value, onChange }: Props): ReactElement {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [code, setCode] = useState('');
  const {path, onSetPath} = usePath()
  

  function addCode() {
    onChange(value + code);
    setCode('');
    setVisible(false);
  }


  return (
    <div>
      <div style={{ display: 'flex' }}>
        <FileManager
          onChange={(_val) => {
            onChange(value + `<img src='${path}/${_val.path}' />`);
          }}
          editorMode
          editorModeText="Fotoğraf Yükle"
        />
        <div style={{ margin: '0 .5em' }}>
          <FileManager
            onChange={(_val) => {
              onChange(
                value +
                  `<video width="320" height="240"><source src="${_val.path}" type="video/mp4">Your browser does not support the video tag.</video>`,
              );
            }}
            editorMode
            editorModeText="Video Yükle"
          />
        </div>
        <Button
          onClick={() => {
            setVisible(true);
          }}
        >
          HTML Ekle
        </Button>
      </div>
      <Editor
        apiKey='m7akmcr0l1wg3115mnb3tgps9d01f1ujtu4hnrf318cwz81x'
        value={value}
        onEditorChange={onChange}
        init={{
          menubar: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          image_title: true,
          image_advtab: true,

          font_formats:"Ubuntu=ubuntu",
          content_style: "@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap'); body { font-family: Ubuntu; }",
          image_class_list: [
            { title: 'Top', value: 'lazy detail-img top' },
            { title: 'Left', value: 'lazy detail-img left' },
            { title: 'Right', value: 'lazy detail-img right' },
            { title: 'Content', value: 'lazy detail-img content' }
        ],
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
         
          toolbar:'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | footnotes | mergetags code',
        
             
          
        }}
      />
      <Modal
        visible={isVisible}
        onCancel={() => {
          setVisible(false);
          setCode("");
        }}
        onOk={addCode}
      >
        <div style={{ marginTop: '2em' }}>
          <h3>Html İçerik</h3>
          <CodeEditor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              border: '1px solid grey',
              height: 400
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default TextEditor;
