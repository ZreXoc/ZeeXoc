import React, {Component} from "react";
import {Interval2D} from "./offset";
import {Header, Body, Footer} from "./display";

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
        }

        #_interval;

        interval(newInterval) {
            if (!newInterval) return this.#_interval
            this.#_interval.set(newInterval);
            return this.#_interval;
        }

        setDrag() {
            let pUl = Object.assign({}, {x: this.interval().ul.x, y: this.interval().ul.y});
            new EventListener(this.ref, 'mousedown', (pE, cE) => {
                pUl = Object.assign({}, {x: this.interval().ul.x, y: this.interval().ul.y});
            })
            new EventListener(this.ref, 'drag', (pE, cE) => {
                this.interval().translate({
                    x: pUl.x + cE.x - pE.x,
                    y: pUl.y + cE.y - pE.y
                })
                console.log(this.interval().in(Interval2D.toInterval2D(document.getElementsByTagName('body')[0])))
            })
            new EventListener(this.ref, 'mouseup', (pE, cE) => {
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
                limit:Interval2D.toInterval2D(document.getElementsByTagName('body')[0]),
                onChange: interval => this.setState({style: {...interval.toOffset()}})

            });
            this.interval(Interval2D.toInterval2D(this.ref))
            if (this.config.draggable) this.setDrag();
        }

        componentWillUnmount() {
            alert('bye!')
        }

        render() {
            return (
                <div
                    className='app-window'
                    style={this.state.style}
                    ref={ref => this.ref = ref}>
                    <Header title={this.state.title}/>
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
    load(url, isForce = true) {
        let Win = Window(require('../' + url));

        if (!isForce && this.windows[url]) return false
        else this.setState({
            windows: {[url]: <Win key={url}/>}
        });
        return true
    }

    constructor(props) {
        super(props);
        this.state = {
            windows: {},
            icons: {}
        }
        this.props.method({load: this.load.bind(this)})
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

    constructor(element) {
        this.element = element;
    }
}