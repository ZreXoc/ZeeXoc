import React, {Component} from 'react';
import * as Lyrw from './Lyrw/Lyrw.js'
import './Stylesheet/basic.css';

@Lyrw.setWindow()
class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lyrw: this.props.lyrw
        }
    }

    render() {
        return (
            <>
                <Lyrw.Header>
                    <span>kksk</span>
                </Lyrw.Header>
                <Lyrw.Body>
                    <span>kksk</span>
                </Lyrw.Body>
                <Lyrw.Footer>
                    <span>kksk</span>
                </Lyrw.Footer>
            </>
        )
    }
}

class Windows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lyrw: {
                conf: {
                    temp: 'dd'
                },
            }
        }
    }

    render() {
        return (<TextBox lyrw={{id: 'textBox', ...this.state.lyrw}}/>)
    }
}

class App extends Component {
    render() {
        return (
            <Windows/>
        );
    }
}


export default App;