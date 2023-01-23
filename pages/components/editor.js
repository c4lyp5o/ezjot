import { useEffect, useState, useRef } from 'react';

export default function Editor({ onChange, name, value, ro }) {
  const editorRef = useRef(null);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <div>
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
