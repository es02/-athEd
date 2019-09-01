import React, { Component } from 'react';
import './../styles/Main.scss';

import Header from './Header';
import Editor from './Editor';
import Sidebar from './Sidebar';
import Terminal from './Terminal';

export default class Main extends Component {
    render() {
        return (
            <div className="container">
                <Header />
                <div className="sub-container">
                    <Sidebar />
                    <div className="deep-container">
                        <Editor />
                        <Terminal />
                    </div>
                </div>
            </div>
        );
    }
}