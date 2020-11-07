import React, {Component} from "react";
import ReactDOM from 'react-dom';
import LBasic from "./LBasic";

class Header extends Component {
    constructor(props) {
        super(props);
        this.self = React.createRef();
        this.state = {
            contain: this.props.children,
            LDrag: this.props.header
        }
    }

    render() {
        return (
            <div l-w-type="header" ref={this.self}>
                {this.state.contain}
            </div>
        );
    }
}

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contain: this.props.children,
        }
    }


    render() {
        return (
            <div l-w-type="body">
                {this.state.contain}
            </div>
        );
    }
}

class LWindow extends Component {
    setClass(type) {
        switch (type) {
            case 'default':
            case 'act':
                return 'act-window';
            default:
                return 'act-window';
        }
        ;
    }

    setContain(contain) {
        let map = new Map();
        map.set('header', contain[0]);
        map.set('body', contain[1]);
        map.set('footer', contain[2]);
        return map
    }

    constructor(props) {
        super(props);
        this.self = React.createRef();

        this.state = {
            index: this.props.index,
            type: this.props.type,
            class: this.setClass(this.props.type),
            contain: this.setContain(this.props.children),
            dom: {
                container: this.self.current,
            }
        }
    }

    componentDidMount() {
        const dragEle = {
            container: this.self.current,
            handler: this.self.current.childNodes[0],
            parent: this.self.current.parentNode,
            dragType: true,
        }
        LBasic.setDrag(dragEle);
    }

    render() {
        return (
                    <div id={"LWindow-" + this.state.index}
                         className={this.state.class}
                         l-w-type='container'
                         ref={this.self}>
                        <Header>
                            {this.state.contain.get('header')}
                        </Header>
                        <Body>
                            {this.state.contain.get('body')}
                        </Body>
                        {/*<footer>TODO*/}
                    </div>
        );
    }
}

export default LWindow;