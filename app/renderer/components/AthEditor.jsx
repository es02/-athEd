import React, { Component } from 'react';
import Editor from 'react-simple-code-editor';
import './../styles/Editor.scss';

const code = `function add(a, b) {
    return a + b;
  }
  `;

export default class AthEditor extends Component {
    constructor() {
        super();

        this.state = { code };
    }

    render() {
        return (
            <div className="editor-container">
                <div className="line-counter">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                    <p>12</p>
                    <p>13</p>
                    <p>15</p>
                    <p>16</p>
                    <p>17</p>
                    <p>18</p>
                    <p>19</p>
                    <p>20</p>
                </div>
                <textarea className="editor" onKeyDown={event => console.log(event)} />
                {/* <Editor
                    value={this.state.code}
                    onValueChange={code => this.setState({ code })}
                    padding={10}
                    style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    }}
                /> */}
            </div>
        );
    }
}