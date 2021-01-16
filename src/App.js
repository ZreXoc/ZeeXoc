import React, {Component} from 'react';
/*import {Offset} from './Lyrw/Lyrw'*/
import './Stylesheet/basic.css';
import {Os} from "./Lyros";

/*
class NewWindow extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        console.log(nextProps)
        if (nextProps.conf.focus!==this.props.conf.id) return false;
        return true;
    }

    constructor(props) {
        super(props);
        //console.log(logo)
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

                    conf={(conf) => this.setState({conf: conf})}>
                    <Header>
                        <span>{this.props.conf.id}</span>
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
        if (value.target !== this._mouse.target) console.log(3, value.target, this.mouse.target)/!*this.setState({mouse:{target:value.target}})*!/
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
    windowState(state){
        this.setState({
            windowState:{
                [state.id]:state
            }
        })
    }
    render() {
        return (
            <div ref={ref => this.event = ref}>
                <NewWindow
                    conf={{id: 'textBox',
                        focus: this.state.focus,
                        mouse:this.state.mouse}}
                    focus={(ele) => this.setState({focus: ele})}
                    windowState={state=>this.windowState(state)}
                />
                <NewWindow
                    id={ 'styleBox'}
                    status={{
                        focus: this.state.focus,
                        mouse:this.state.mouse}}
                    focus={(ele) => this.setState({focus: ele})}
                    windowState={state=>this.windowState(state)}
                />
            </div>
        );
    }
}
*/
class App extends Component {
    componentDidMount() {
        //debug();
    }

    render() {
        let Text = Os.load(()=>require('./text'))
        return (
            <>
                <Text/>
            </>
        );
    }
}
function debug() {
}

export default App;