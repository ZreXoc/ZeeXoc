import React, {Component} from 'react';
/*import {Offset} from './Lyrw/Lyrw'*/
import './Stylesheet/basic.css';
import {Os} from "./Lyros";

class App extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <>
                {Os.load('text/')}
            </>
        );
    }
}
function debug() {
}

export default App;