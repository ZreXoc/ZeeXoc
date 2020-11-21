import React, {Component} from "react";
import {LDrag} from "./LBasic";
import {LyWindow} from "./LBasic";

/*
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
*/
/*
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
*/
const spec = {
    beginDrag(dragItem, monitor) {
        console.log('startDrag!')
    },
    dragging(dragItem, monitor) {

        monitor.setPosition({
            X:monitor.oldPosition.X+monitor.getClientOffset().X-monitor.getInitialClientOffset().X,
            Y:monitor.oldPosition.Y+monitor.getClientOffset().Y-monitor.getInitialClientOffset().Y,
        })
    },
    endDrag(dragItem, monitor) {
        console.log('endDrag!')
    }
}

//LDrag(spec)
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
        this.ref = React.createRef();

        this.state = {
            index: this.props.index,
            type: this.props.type,
            style: null,
            class: this.setClass(this.props.type),
            contain: this.setContain(this.props.children),
        }
    }

    componentDidMount() {
        /*const dragEle = {
            container: this.self.current,
            handler: this.self.current.childNodes[0],
            parent: this.self.current.parentNode,
            dragType: true,
        }
        LBasic.setDrag(dragEle);*/
    }

    render() {
        return (
            <>
                <LyWindow/>
                <div id={"LWindow-" + this.state.index}
                     className={this.state.class}
                     l-w-type='container'
                     style={{...this.state.style, ...this.props.style}}
                     ref={this.ref}>
                    <div l-w-type="header">
                        {this.state.contain.get('header')}
                    </div>
                    <div l-w-type="body">
                        {this.state.contain.get('body')}
                    </div>
                    {/*<Header>
                            {this.state.contain.get('header')}
                        </Header>
                        <Body>
                            {this.state.contain.get('body')}
                        </Body>*/}
                    <div l-w-type="footer">
                        {this.state.contain.get('footer')}{/*style:TODO*/}
                    </div>
                </div>
            </>
        );
    }
}

export default LWindow;
