import React, { Component } from 'react';
import Folder from './Folder';
import File from './File';
import './../styles/Sidebar.scss';

const {lstatSync,readdirSync} = require('fs');
export default class Sidebar extends Component {
    constructor(props='./'){
        super(props);
        const dirs = readdirSync('.',{withFileTypes: true }).filter(file => lstatSync(file).isDirectory()).filter(file=> (file===".git" || file==="node_modules") ? false : true);
        const files = readdirSync('.',{withFileTypes: true }).filter(file => !lstatSync(file).isDirectory());
        this.state = {cwd: '.',
                      dirs,
                      files};
    }
    render() {
        return (
            <div className="sidebar">
                {this.state.dirs.map(folder => {return <Folder key={folder} name={folder} cwd={this.state.cwd}/>;})}
                {this.state.files.map(file => {return <File key={file} name={file} path={this.state.cwd+'./'+file} />;})}
            </div>
        );
    }
}