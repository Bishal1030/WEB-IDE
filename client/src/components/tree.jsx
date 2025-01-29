import React from 'react';
import { FaFolder, FaFile } from 'react-icons/fa';

const FileTreeNode = ({ fileName, nodes }) => {
  const isDir = !!nodes;
  return (
    <div style={{ marginLeft: '10px' }}>
      <div className="file-node">
        <span className="icon">{isDir ? <FaFolder /> : <FaFile />}</span>
        {fileName}
      </div>
      {nodes && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode fileName={child} nodes={nodes[child]} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ tree }) => {
  return <FileTreeNode fileName="/" nodes={tree} />;
};

export default FileTree;