import React, { Component } from 'react';
import './../styles/Editor.scss';

export default class Header extends Component {
    render() {
        return (
            <div className="editor-container">
                <div className="line-counter">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                </div>
                <textarea className="editor" />
            </div>
        );
    }
}