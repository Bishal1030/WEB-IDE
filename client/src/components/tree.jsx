import React from 'react';

const FileTreeNode = ({ fileName, nodes }) => {
    console.log(nodes)
    return (
        <div>
            {fileName}
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