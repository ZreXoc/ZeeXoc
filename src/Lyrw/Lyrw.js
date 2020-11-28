import React, {Component} from 'react';

/*function setWindow() {
    return function (WComp) {
        return class Lyrw extends WComp {
            onMouseDown(e) {
                let X = e.clientX, Y = e.clientY;
                this.setState({
                    monitor: {
                        initialClientOffset: {X,Y}
                    }
                })
                this.state.onMouseDown(e,this.state);
            }

            setListener() {
                this.state.ref.current.addEventListener('onMouseDown', (e) => this.onMouseDown(e))
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
    onMouseDown(e) {
        let X = e.clientX, Y = e.clientY;
        this.setState({
            monitor: {
                ...this.state.monitor,
                mouseState: 'down',
                initialClientOffset: {X, Y}
            }
        })
        if (this.state.mouseDown) this.state.mouseDown(e, {item: this.state.item, ...this.state.monitor});
    }

    onMouseMove(e) {
        {
            let mouseState = this.state.monitor.mouseState === 'down'||this.state.monitor.mouseState === 'dragging' ? 'dragging' : 'over';
            let X = e.clientX, Y = e.clientY;
            this.setState({
                monitor: {
                    ...this.state.monitor,
                    mouseState,
                    clientOffset: {X, Y}
                }
            });
        }

        this.onDragging(e);

        if (this.state.mouseMove) this.state.mouseMove(e, {item: this.state.item, ...this.state.monitor});
    }

    onMouseUp(e) {
        this.setState({monitor: {...this.state.monitor, mouseState: 'up'}});
    }

    onMouseEnter(e) {
        this.setState({monitor: {...this.state.monitor, mouseState: 'enter'}});
    }

    onMouseLeave(e) {
        this.setState({monitor: {...this.state.monitor, mouseState: 'leave'}});
    }

    onDragging(e) {
        if (this.state.monitor.mouseState !== 'dragging') return;

    }

    setListener() {
        let events = ['mouseDown', 'mouseMove', 'mouseUp', 'mouseEnter', 'mouseLeave']
        //TODO 事件监听在父级中设置，监听document.
        events.forEach((name, index) =>
            this.state.item.addEventListener(name.toLocaleLowerCase(), (e) => this['on' + name.charAt(0).toUpperCase() + name.slice(1)](e))
        );
    }


    constructor(props) {
        super(props);
        this.state = {
            ...this.props.conf,
            ref: React.createRef(),
            monitor: {
                mouseState: '',
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
        this.setState((preState, props) => {
            preState.item = this.state.ref.current;
            delete preState.ref;
        }, () => {
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