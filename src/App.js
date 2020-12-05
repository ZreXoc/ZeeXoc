import React, {Component} from 'react';
import * as Lyrw from './Lyrw/Lyrw.js'
import './Stylesheet/basic.css';

//@Lyrw.setWindow()
class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lyrw: {
                ...this.props.lyrw,
                mouseDown(e, monitor) {
                    monitor.item.style.left = monitor.initialClientOffset.X + 'px';
                    monitor.item.style.top = monitor.initialClientOffset.Y + 'px';
                }
            },
            wState: {}
        }
    }

    render() {
        return (
            <Lyrw.Container conf={this.state.lyrw} getData={(state) => this.setState({wState: state})}>
                <Lyrw.Header>
                    <span>kksk</span>
                </Lyrw.Header>
                <Lyrw.Body>
                    <span>kksk</span>
                </Lyrw.Body>
                <Lyrw.Footer>
                    <span>kksk</span>
                </Lyrw.Footer>
            </Lyrw.Container>
        )
    }
}

class Windows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lyrw: {
                drag: {
                    isDrag: true,
                }
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
            <>
                <Windows/>
            </>
        );
    }
}


export default App;