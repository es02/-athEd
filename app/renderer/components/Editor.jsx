import React, { Component } from 'react';
import './../styles/Editor.scss';

export default class Header extends Component {
    render() {
        return (
            <div className="editor-container">
                <textarea className="editor" />
            </div>
        );
    }
}