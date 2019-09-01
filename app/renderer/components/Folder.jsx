import React, { Component } from 'react';
import { FaFolder,FaFolderOpen} from 'react-icons/fa';
import File from './File'
import './../styles/Folder.scss';

const {lstatSync,readdirSync} = require('fs');
export default class Folder extends Component {
    constructor(props){
        super(props);
        const files = readdirSync(props.cwd+'/'+props.name,{withFileTypes: true }).filter(file => !lstatSync(props.cwd+'/'+props.name+'/'+file).isDirectory());
        const dirs =  readdirSync(props.cwd+'/'+props.name,{withFileTypes: true }).filter(folder => lstatSync(props.cwd+'/'+props.name+'/'+folder).isDirectory());
        this.state = {'folder': props.name,
                      'cwd': props.cwd+'/'+props.name,
                      showSubFolder: false,
                      files,
                      dirs};
        /*this.toggleSubFolder = this
            .toggleSubFolder
            .bind(this)*/
    }
    toggleSubFolder(){
        //console.log("change on subfolder occured");
        //console.log(this.state.showSubFolder);
        this.state.showSubFolder ? this.setState({ showSubFolder: false}) : this.setState({showSubFolder: true});
        //console.log(this.state.showSubFolder);
    }
    render() {
        return (
            <div className="folder-div">
                <a onClick={() => this.toggleSubFolder()}> 
                    {(!this.state.showSubFolder)? <FaFolder /> : <FaFolderOpen />} {this.state.folder}
                </a>
                <div className={"subfolder-div " + (this.state.showSubFolder ? 'show' : 'hide')}>
                    {this.state.files.map(file => {return <File key={file} name={file} path={this.state.cwd+'/'+file}/>;})}
                    {this.state.dirs.map(folder => {return <Folder key={folder} name={folder} cwd={this.state.cwd}/>})}                    
                </div>
            </div>
        );
    }
}