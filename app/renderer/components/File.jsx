import React, { Component } from 'react';
import { FaRegFile,FaRegFileCode } from 'react-icons/fa';
import './../styles/File.scss';

const {readFileSync} = require('fs');
const {resolve} = require("path");
export default class File extends Component {
    constructor(props){
        super(props);
        this.state = {'file': props.name,
                      'path' : props.path,
                      'root' : resolve('.'),
                      'absPath' : resolve('.') +'\\' + props.path.substring(2),
                      'fileOpen' : false
                    };
    }
    showText(){
        console.log(this.state.absPath);
        console.log("contents:");
        const contents = readFileSync(this.state.absPath,'utf8');
        console.log(contents);
        this.state.fileOpen ? this.setState({fileOpen : false}) : this.setState({fileOpen : true});
        
    }
    render() {
        return (
            <div className="file-div">
                <a onClick={() => {this.showText()}}>
                    {(this.state.fileOpen) ? <FaRegFileCode /> : <FaRegFile />} 
                    {this.state.file}
                </a>
            </div>
        );
    }
}