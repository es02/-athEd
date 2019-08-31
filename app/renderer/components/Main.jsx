import React, { Component } from 'react';
import './../styles/Main.scss';

import Header from './Header';
import AthEditor from './AthEditor';
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
                        <AthEditor />
                        <Terminal />
                    </div>
                </div>
                
            </div>
        );
    }
}