import React, {Component} from 'react';
/*import {Offset} from './Lyrw/Lyrw'*/
import './Stylesheet/basic.css';
import {Container, Os} from "./Lyros";

class App extends Component {
    container={
        method:{}
    }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.container)
        this.container.method.load('text',true)
    }

    render() {
        return (
            <Container method={method =>this.container.method = method}/>
        );
    }
}
function debug() {
}

export default App;