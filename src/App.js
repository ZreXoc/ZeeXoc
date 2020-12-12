import React, {Component} from 'react';
import * as Lyrw from './Lyrw/Lyrw'
import {Container, Header, Body, Footer} from './Lyrw/Lyrw'
import {Offset} from './Lyrw/Lyrw'
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
    mouse = {
        state: '',
        initialOffset: new Offset(),
        currentOffset: new Offset(),
    }

    mouseDown(e) {
        this.mouse.initialOffset.e = [e.clientX, e.clientY];
        this.mouse = {...this.mouse, state: 'down', target: e.target};
    }

    mouseMove(e) {
       // if (['dragging','down','leave'].find(value => value===this.mouse.state)) return;
        let mouseState = (['dragging','down'].find(value => value===this.mouse.state)) ? 'dragging' : 'moving';

        this.mouse.currentOffset.e = [e.clientX, e.clientY];
        this.mouse = {...this.mouse, state: mouseState, target: e.target}

        if (mouseState === 'dragging') this.dragging(e);
    }

    mouseUp(e) {
        this.mouse.initialOffset.e = [e.clientX, e.clientY];
        this.mouse = {...this.mouse, state: 'up', target: e.target}
    }

    mouseEnter(e) {
        this.mouse = {...this.mouse, state: 'enter', target: e.target}
    }

    mouseLeave(e) {
        this.mouse.initialOffset.e = [e.clientX, e.clientY];
        this.mouse = {...this.mouse, state: 'leave', target: e.target}
    }

    dragging(e) {
        if (this.mouse.state !== 'dragging') return;
    }

    setListener() {
        let events = ['mouseDown', 'mouseMove', 'mouseUp', 'mouseEnter', 'mouseLeave']
        events.forEach((name, index) =>
            this.event.addEventListener(name.toLocaleLowerCase(), e => this[name](e))
        );
        //mouseStill
        setInterval(()=>{
            if (['dragging','down','leave','still'].find(value => value===this.mouse.state)) return;

            let pOffset = this.mouse.currentOffset;
            setTimeout(()=>{
                if(Offset.equal(pOffset,this.mouse.currentOffset)) this.mouse.state = 'still'
            },100)
        },200)
    }

    constructor(props) {
        super(props);
        this.state = {
            mouse: this.mouse
        }
    }

    componentDidMount() {
        this.setListener();
        console.log(this.event)
    }

    render() {
        return (
            <div ref={ref => this.event = ref}>
                <TextBox lyrw={{id: 'textBox'}}/>
            </div>
        );
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