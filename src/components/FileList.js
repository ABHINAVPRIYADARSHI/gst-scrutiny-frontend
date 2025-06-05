// src/components/FileList.js
import React, { useEffect, useState } from 'react';

const FileList = ({ gstn, returnType }) => {
  const [fileList, setFileList] = useState([]);

  const fetchFiles = async () => {
    const res = await fetch(`http://localhost:8000/files/${gstn}/${returnType}`);
    const data = await res.json();
    setFileList(data.files || []);
  };

  const deleteFile = async (filename) => {
    await fetch(`http://localhost:8000/delete/${gstn}/${returnType}/${filename}`, {
      method: 'DELETE',
    });
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, [gstn, returnType]);

  return (
    <div>
      <h3>Uploaded Files for {returnType}</h3>
      <ul>
        {fileList.map((file) => (
          <li key={file}>
            {file}
            <button onClick={() => deleteFile(file)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
