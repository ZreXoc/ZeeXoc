import React, {Component} from 'react';

function setWindow() {
    return function (WComp) {
        return class Lyrw extends WComp {
            constructor(props) {
                super(props);
                this.state = {
                    ...this.props.lyrw,
                    ref: React.createRef()
                }
            }

            componentDidMount() {
                this.state.ref.current.addEventListener('click', (e) => console.log(e))
            }

            render() {
                return (
                    <div w-type='container' ref={this.state.ref}>{super.render()}</div>
                )
            }
        }
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

export {setWindow};
export {Header};
export {Body};
export {Footer};