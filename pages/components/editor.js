import { useEffect, useState, useRef } from 'react';

export default function Editor({ onChange, name, value, ro }) {
  const editorRef = useRef(null);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorHeight, setEditorHeight] = useState('auto');

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    const editorContainer = editorRef.current?.container;
    if (editorContainer) {
      editorContainer.style.height = '200px';
      editorContainer.style.overflowY = 'auto';
      setEditorHeight(`${editorContainer.offsetHeight}px`);
    }
  }, [editorLoaded]);

  return (
    <div style={{ height: editorHeight }}>
      {editorLoaded ? (
        <CKEditor
          editor={ClassicEditor}
          disabled={!ro}
          name={name}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  );
}
