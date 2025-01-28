import React, { useEffect, useState } from 'react';
import './App.css';
import Terminal from './components/Terminal';
import FileTree from './components/tree';
import socket from './socket';

function App() {
  const [fileTree, setFileTree] = useState(null);

  const fetchFileTree = async () => {
    const response = await fetch('http://localhost:9000/files');
    const data = await response.json();
    setFileTree(data.tree);
  };

  useEffect(() => {
    fetchFileTree();
  }, []);

  useEffect(() => {
    socket.on('file:refresh', fetchFileTree)
  
    return () => {
      socket.off('file:refresh', fetchFileTree);
    };
  }, [fileTree]);

  return (
    <>
      <div className='playground-container'>
        <div className='editor-container'>
          <div className='files'>
            {fileTree ? <FileTree tree={fileTree} /> : 'Loading...'}
          </div>
          <div className='editor'></div>
        </div>
        <div className='terminal-container'>
          <Terminal />
        </div>
      </div>
    </>
  );
}

export default App;
