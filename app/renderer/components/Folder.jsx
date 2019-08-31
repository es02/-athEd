import React, { Component } from 'react';
import './../styles/Folder.scss';

export default class Folder extends Component {
    constructor(props){
        super(props);
        this.state = {'folder': props.name};
    }
    render() {
        return (
            <div className="folder-div">
                <a>{this.state.folder}</a>
            </div>
        );
    }
}