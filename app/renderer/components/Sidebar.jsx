import React, { Component } from 'react';
import Folder from './Folder';
import './../styles/Sidebar.scss';

const {lstatSync,readdirSync} = require('fs');
export default class Sidebar extends Component {
    constructor(props='.'){
        super(props);
        const dirs = readdirSync('.',{withFileTypes: true }).filter(file => lstatSync(file).isDirectory());
        const files = readdirSync('.',{withFileTypes: true }).filter(file => !lstatSync(file).isDirectory());
        this.state = {cwd: props,
                      dirs,
                      files};
    }
    render() {
        return (
            <div className="sidebar">
                {this.state.dirs.map(folder => {return <Folder name={folder}/>;})}
                {this.state.files.map(file => {return <p>{file}</p>;})}
            </div>
        );
    }
}