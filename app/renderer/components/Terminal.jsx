import React, { Component } from 'react';
import './../styles/Terminal.scss';

export default class Terminal extends Component {
    render() {
        return (
            <div className="terminal-container">
                <h3>Terminal</h3>
                <textarea className="terminal" />
            </div>
        );
    }
}