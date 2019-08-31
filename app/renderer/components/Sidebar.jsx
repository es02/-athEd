import React, { Component } from 'react';
import FileBrowser, { Icons } from 'react-keyed-file-browser';

import './../styles/Sidebar.scss';

export default class Sidebar extends Component {
    constructor() {
        super();

        state = {
            files: [
                {
                  key: 'photos/animals/cat in a hat.png',
                },
                {
                  key: 'photos/animals/kitten_ball.png',
                },
                {
                  key: 'photos/animals/elephants.png',
                },
                {
                  key: 'photos/funny fall.gif',
                },
                {
                  key: 'photos/holiday.jpg',
                },
                {
                  key: 'documents/letter chunks.doc',
                },
                {
                  key: 'documents/export.pdf',
                },
              ]
        };
    }

    handleCreateFolder(key) {
        this.setState(state => {
            state.files = state.files.concat([{
                key: key,
            }]);
            return state;
        });
    }

    handleCreateFiles(files, prefix) {
        this.setState(state => {
            const newFiles = files.map((file) => {
            let newKey = prefix;
                if (prefix !== '' && prefix.substring(prefix.length - 1, prefix.length) !== '/') {
                    newKey += '/';
                }
                newKey += file.name;
                return {
                    key: newKey
                };
            });

            const uniqueNewFiles = [];
            newFiles.map((newFile) => {
            let exists = false;
            state.files.map((existingFile) => {
                if (existingFile.key === newFile.key) {
                exists = true;
                }
            });
            if (!exists) {
                uniqueNewFiles.push(newFile);
            }
            });
            state.files = state.files.concat(uniqueNewFiles);
            return state;
        });
    }

    handleRenameFolder(oldKey, newKey) {
        this.setState(state => {
            const newFiles = [];
            state.files.map((file) => {
            if (file.key.substr(0, oldKey.length) === oldKey) {
                newFiles.push({
                file,
                key: file.key.replace(oldKey, newKey)
                });
            } else {
                newFiles.push(file);
            }
            });
            state.files = newFiles;
            return state;
        });
    }

    handleRenameFile(oldKey, newKey) {
        this.setState(state => {
            const newFiles = [];
            state.files.map((file) => {
            if (file.key === oldKey) {
                newFiles.push({
                file,
                key: newKey
                });
            } else {
                newFiles.push(file);
            }
            });
            state.files = newFiles;
            return state;
        });
    }

    handleDeleteFolder(folderKey) {
        this.setState(state => {
            const newFiles = [];
            state.files.map((file) => {
                if (file.key.substr(0, folderKey.length) !== folderKey) {
                    newFiles.push(file);
                }
            });
            state.files = newFiles;
            return state;
        });
    }

    handleDeleteFile(fileKey) {
        this.setState(state => {
            const newFiles = [];
            state.files.map((file) => {
                if (file.key !== fileKey) {
                    newFiles.push(file);
                }
            });
            state.files = newFiles;
            return state;
        });
    }

    render() {
        return (
            <div className="sidebar">
                <FileBrowser 
                    files={files}
                    icons={Icons.FontAwesome(4)}
                    
                    onCreateFolder={this.handleCreateFolder}
                    onCreateFiles={this.handleCreateFiles}
                    onMoveFolder={this.handleRenameFolder}
                    onMoveFile={this.handleRenameFile}
                    onRenameFolder={this.handleRenameFolder}
                    onRenameFile={this.handleRenameFile}
                    onDeleteFolder={this.handleDeleteFolder}
                    onDeleteFile={this.handleDeleteFile}
                />
            </div>
        );
    }
}