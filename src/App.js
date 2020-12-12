import React, {Component} from 'react';
import * as Lyrw from './Lyrw/Lyrw'
import {Container, Header, Body, Footer} from './Lyrw/Lyrw'
import {Offset} from './Lyrw/Lyrw'
import './Stylesheet/basic.css';

//@Lyrw.setWindow()
class NewWindow extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //console.log(this.ref)
        //this.ref.addEventListener('mousedown', e => console.log(e))

        this.ref.addEventListener('mousedown',e=>this.props.focus(this.props.conf.id))
        this.ref.addEventListener('click',e=>this.props.focus(this.props.conf.id))
    }

    render() {
        return (
            <div ref={ref => this.ref = ref}>
                <Container
                    getData={(state) => this.setState({wState: state})}>
                    <Header>
                        <span>kksk</span>
                    </Header>
                    <Body>
                        <span>kksk</span>
                    </Body>
                    <Footer>
                        <span>kksk</span>
                    </Footer>
                </Container>
            </div>
        )
    }
}

class Windows extends Component {
    _mouse = {
        state: '',
        initialOffset: new Offset(),
        currentOffset: new Offset(),
    }
    get mouse() {
        return this._mouse;
    }

    set mouse(value) {
        if (value.target !== this._mouse.target) console.log(3, value.target, this.mouse.target)/*this.setState({mouse:{target:value.target}})*/
        Object.assign(this._mouse, value);
    }

    mouseDown(e) {
        this.mouse.initialOffset.e = [e.clientX, e.clientY];
        this.mouse = {state: 'down'};
        console.log(this.mouse)
    }

    mouseMove(e) {
        // if (['dragging','down','leave'].find(value => value===this.mouse.state)) return;
        let mouseState = (['dragging', 'down'].find(value => value === this.mouse.state)) ? 'dragging' : 'moving';

        this.mouse.currentOffset.e = [e.clientX, e.clientY];
        this.mouse = {state: mouseState}
        if (mouseState === 'dragging') this.dragging(e);
    }

    mouseUp(e) {
        this.mouse.initialOffset.e = [e.clientX, e.clientY];
        this.mouse = {state: 'up'}
    }

    mouseEnter(e) {
        this.mouse = {state: 'enter'}
    }

    mouseLeave(e) {
        this.mouse.initialOffset.e = [e.clientX, e.clientY];
        this.mouse = {state: 'leave'}
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
        setInterval(() => {
            if (['dragging', 'down', 'leave', 'still'].find(value => value === this.mouse.state)) return;

            let pOffset = this.mouse.currentOffset;
            setTimeout(() => {
                if (Offset.equal(pOffset, this.mouse.currentOffset)) this.mouse.state = 'still'
            }, 100)
        }, 200)
    }

    constructor(props) {
        super(props);
        this.state = {
            mouse: {
                target: this.mouse.target
            },
            focus: ''
        }
    }

    componentDidMount() {
        this.setListener();
    }

    render() {
        return (
            <div ref={ref => this.event = ref}>
                <NewWindow conf={{id: 'textBox'}} focus={(ele) => this.setState({focus: ele})}/>
                <NewWindow conf={{id: 'text'}} focus={(ele) => this.setState({focus: ele})}/>
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