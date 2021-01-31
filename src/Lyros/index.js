import React, {Component} from "react";
import cookie from 'react-cookies';
import {Interval2D} from "./offset";
import {Header, Body, Footer, Title, DeleteButton} from "./display";

class EventListener {
    element;

    previousEvent;

    currentEvent;

    setDrag(element, listener) {
        let isMouseDown = false;
        element.addEventListener('mousedown', e => {
            this.previousEvent = e;
            this.currentEvent = e;
            isMouseDown = true;
        })
        document.addEventListener('mousemove', e => {
            if (!isMouseDown) return
            this.currentEvent = e;
            listener(this.previousEvent, this.currentEvent)
        })
        document.addEventListener('mouseup', e => {
            isMouseDown = false;
        })
    }

    constructor(element, type, listener) {
        this.element = element;
        switch (type) {
            case 'drag': {
                this.setDrag(element, listener)
                break;
            }
            default: {
                element.addEventListener(type, listener)
            }
        }

    }
}

const WINDOW_DEFAULT_CONFIG = {
    title: 'window',
    draggable: true
}

function Window(require) {
    let config = require.config;
    let WrappedComponent = require.Component;
    return class extends Component {
        //DOM element
        ref;

        config = {
            ...Object.assign({}, WINDOW_DEFAULT_CONFIG, config),
            hash: this.props.hash
        }

        #_interval;

        interval(newInterval) {
            if (!newInterval) return this.#_interval
            this.#_interval.set(newInterval);
            return this.#_interval;
        }

        setDrag() {
            let pUl = Object.assign({}, {x: this.interval().ul.x, y: this.interval().ul.y});
            let header = this.ref.querySelector('[w-type=\'header\']');
            new EventListener(header, 'mousedown', (pE, cE) => {
                pUl = Object.assign({}, {x: this.interval().ul.x, y: this.interval().ul.y});
            })
            new EventListener(header, 'drag', (pE, cE) => {
                this.interval().translate({
                    x: pUl.x + cE.x - pE.x,
                    y: pUl.y + cE.y - pE.y
                })
            })
            new EventListener(header, 'mouseup', (pE, cE) => {
                pUl = Object.assign({}, {x: this.interval().ul.x, y: this.interval().ul.y});
            })
        }

        constructor(props) {
            super(props);
            this.state = {
                title: this.config.title,
                style: {}
            }
        }

        componentDidMount() {
            //在此声明防止interval提前与offset绑定
            this.#_interval = new Interval2D(null, {
                limit: document.getElementsByTagName('body')[0],
                onChange: interval => this.setState({style: {...interval.toOffset()}})
            });
            this.interval(Interval2D.toInterval2D(this.ref))
            if (this.config.draggable) this.setDrag();
        }


        render() {
            return (
                <div
                    className='app-window'
                    style={this.state.style}
                    ref={ref => this.ref = ref}>
                    <Header>
                        <Title>{this.state.title}</Title>
                        <DeleteButton delete={() => this.props.delete(this.config.hash)}/>
                    </Header>
                    <Body>
                        <WrappedComponent/>
                    </Body>
                    <Footer/>
                </div>
            )
        }
    }

}


export class Container extends Component {
    load(url, isRewrite) {
        let Win = Window(require('../' + url));
        let hash = Os.hashCode(url);
        this.setState(state => {
            if (isRewrite || !state.windows[hash])
                state.windows[hash] = <Win hash={hash} key={hash} delete={this.delete.bind(this)}/>
            Os.saveState(state)
            return state
        });
        return hash
    }

    delete(hash) {
        this.setState(state => {
            state.windows[hash] = undefined;
            Os.saveState(state);
            return state
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            windows: {},
            icons: {},
        }
    }

    componentDidMount() {
        this.load('game/')
        this.load('text/')
    }

    render() {
        return (
            <>
                {Object.values(this.state.windows)}
            </>
        )
    }
}


export class Os {
    element;

    static load(src) {
        let Win = Window(require('../' + src));
        return <Win/>;
    }

    static addEventListener(element, type, listener) {
        return new EventListener(element, type, listener)
    }

    static saveState(state) {
        cookie.save('appState'
            , state
            , {expires: new Date(new Date().getTime() + 24 * 3600 * 1000 * 15)})//half month
    }

    static loadState() {
        let c = cookie.load('appState');
        if (!c) return null;
        return c
    }

    static hashCode(string) {
        let hash = 0, i, chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    static mapChangeObj(map) {
        let obj = {};
        for (let [k, v] of map) {
            obj[k] = v;
        }
        return obj;
    }

    static objChangeMap(obj) {
        let map = new Map();
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            map.set(key, obj[key]);
        }
        return map;
    }

    constructor(element) {
        this.element = element;
    }
}
