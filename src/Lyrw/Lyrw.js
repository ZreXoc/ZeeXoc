import React, {Component} from 'react';

/*function setWindow() {
    return function (WComp) {
        return class Lyrw extends WComp {
            mouseDown(e) {
                let X = e.clientX, Y = e.clientY;
                this.setState({
                    monitor: {
                        initialClientOffset: {X,Y}
                    }
                })
                this.state.mouseDown(e,this.state);
            }

            setListener() {
                this.state.ref.current.addEventListener('mouseDown', (e) => this.mouseDown(e))
            }

            constructor(props) {
                super(props);
                this.state = {
                    ...this.props.lyrw,
                    ref: React.createRef(),
                    monitor: {
                        initialClientOffset: {},
                        clientOffset: {}
                    }
                }
            }

            componentDidMount() {
                this.setListener();

            }

            render() {
                return (
                    <div w-type='container' ref={this.state.ref}>{super.render()}</div>
                )
            }
        }
    }
}*/
class Container extends Component {
    mouseDown(e) {
        let X = e.clientX, Y = e.clientY;
        this.setState({
            monitor: {
                initialClientOffset: {X, Y}
            }
        })
        this.state.mouseDown(e, {item:this.state.item,...this.state.monitor});
    }

    setListener() {
        this.state.item.addEventListener('mousedown', (e) => this.mouseDown(e))
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.conf,
            ref : React.createRef(),
            monitor: {
                initialClientOffset: {},
                clientOffset: {}
            }
        }
    }

    componentDidMount() {
        /*this.setState((preState, props)=>{
            preState.item = this.state.ref.current;
            delete preState.ref;
        })*/
        this.setState((preState, props)=>{
            preState.item = this.state.ref.current;
            delete preState.ref;
        },()=>{
            this.setListener();
        })
        this.props.getData(this.state.monitor);
    }

    render() {
        return (
            <div w-type='container' ref={this.state.ref}>{this.props.children}</div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div style={{...this.props.style}} w-type='header'>{this.props.children}</div>
        )
    }
}

class Body extends Component {
    render() {
        return (
            <div style={{...this.props.style}} w-type='body'>{this.props.children}</div>
        )
    }
}

class Footer extends Component {
    render() {
        return (
            <div style={{...this.props.style}} w-type='footer'>{this.props.children}</div>
        )
    }
}

//export {setWindow};
export {Container};
export {Header};
export {Body};
export {Footer};