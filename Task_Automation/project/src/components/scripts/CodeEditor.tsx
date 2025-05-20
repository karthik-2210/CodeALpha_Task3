import React from 'react';
import AceEditor from 'react-ace';

// Import ace modules
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  height = '400px',
  readOnly = false
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <AceEditor
        mode="python"
        theme="monokai"
        onChange={onChange}
        value={code}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          fontSize: 14,
          showPrintMargin: false,
        }}
        width="100%"
        height={height}
        readOnly={readOnly}
        className="font-mono"
      />
    </div>
  );
};

export default CodeEditor;