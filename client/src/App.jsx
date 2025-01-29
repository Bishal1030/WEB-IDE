import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import FileTree from "./components/tree";
import socket from "./socket";
import Editor from "@monaco-editor/react";

function App() {
  const [fileTree, setFileTree] = useState(null);

  const fetchFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const data = await response.json();
    setFileTree(data.tree);
  };

  useEffect(() => {
    fetchFileTree();
  }, []);

  useEffect(() => {
    socket.on("file:refresh", fetchFileTree);

    return () => {
      socket.off("file:refresh", fetchFileTree);
    };
  }, []);

  // code editor

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <div className="playground-container">
      <div className="files">
        {fileTree ? <FileTree tree={fileTree} /> : "Loading..."}
      </div>
      <div className="editor-container">
        <div className="editor">
          <Editor
            height="100%" // Ensures editor takes up the full available height
            defaultLanguage="javascript"
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              automaticLayout: true, // Important for automatic resizing
              formatOnType: true,
              padding: { top: 5, bottom: 10 },
            }}
          />
        </div>
        <div className="terminal-container">
          <Terminal />
        </div>
      </div>
    </div>
  );
}

export default App;
