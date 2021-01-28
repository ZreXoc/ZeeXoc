import React, {Component} from "react";
import ReactDOM from "react-dom";
import App from "../App";

/**
 * @typedef {(Point2D|{x: (Number|null), y: (Number|null)}|Number[])} Point
 */

export class Point2D {
    #_x;
    #_y;

    get x() {
        return this.#_x
    }

    /**@param {Number}val*/
    set x(val) {
        if (typeof val == "number") this.#_x = val
        this.onChange(this);
        return this.#_x;
    }

    get y() {
        return this.#_y
    }

    /**@param {Number}val*/
    set y(val) {
        if (typeof val == "number") this.#_y = val
        this.onChange(this);
        return this.#_y;
    }

    onChange = () => {
    };

    /**
     * @return {Point} - is coordinate changed
     * @param points
     */
    add(...points) {
        points.forEach(point => {
            let {x, y} = Point2D.pure(point);
            this.x += x || 0;
            this.y += y || 0;
        })
        return this;
    }

    /**
     * @param {Point} point
     * @return {Point2D}
     */
    minus(point) {
        let {x, y} = Point2D.pure(point);
        this.x -= x;
        this.y -= y;
        return this;
    }

    /**
     * @param {Point} points
     * @return {Boolean}
     */
    equal(...points) {
        let isEqual = true;
        points.forEach((point, index) => {
            if (!isEqual || !points[index + 1]) return
            let p1 = Point2D.pure(points[index]),
                p2 = Point2D.pure(points[index + 1])
            isEqual = (p1.x === p2.x && p1.y === p2.y);
        })
        return isEqual;
    }

    /**
     * @param {Point|null} [point=[0,0]]
     * @param {Number} [e=3] - 精确度
     * @return {string} - distance
     */
    distTo(point = [0, 0], e = 3) {
        let {x, y} = Point2D.minus(Point2D.pure(this), Point2D.pure(point));
        return Math.sqrt(x * x + y * y).toFixed(e);
    }

    /**
     * @param {Point|null} point
     */
    set(point) {
        let {x, y} = Point2D.pure(point);
        this.x = x;
        this.y = y;
        return this;
    }

    toString() {
        return `(${this.x},${this.y})`;
    }

    /**
     * @param {Point} points
     * @return {Point2D}
     */
    static sum(...points) {
        let result = new Point2D();
        result.add(...points);
        return result;
    }

    /**
     * @param {Point} leftPoint
     * @param {Point} rightPoint
     * @return {Point2D} - distance
     */
    static minus(leftPoint, rightPoint) {
        return Point2D.new(leftPoint).minus(rightPoint);
    }

    /**
     * @param {Point} points
     * @return {Boolean}
     */
    static equal(...points) {
        return Point2D.new(points[0]).equal(...points);
    }

    /**
     * @param {Point} leftPoint
     * @param {Point} [rightPoint=[0,0]]
     * @param {Number} [e=3] - 精确度
     * @return {string} - distance
     */
    static distance(leftPoint, rightPoint = [0, 0], e = 3) {
        let {x, y} = Point2D.minus(Point2D.pure(leftPoint), Point2D.pure(rightPoint));
        return Math.sqrt(x * x + y * y).toFixed(e);
    }

    /**
     * @param [point = null]
     * @return {Point2D}
     */
    static new = (point = null) => new Point2D(point);

    /**
     * @param {Point|null} [point = [0,0]]
     * @returns {{x: (Number|null), y: (Number|null)}}
     */
    static pure(point) {
        point = point || [null, null];
        let p = {x: null, y: null};
        if (point.x === 0 || point.x || point[0]) p.x = point.x;
        if (point.y === 0 || point.y || point[1]) p.y = point.y;

        if (typeof p.x != 'number' || isNaN(p.x)) p.x = null;
        if (typeof p.y != 'number' || isNaN(p.x)) p.y = null;
        return p;
    }

    /**
     * @param {Point|null} [point = null]
     * @param onChange
     */
    constructor(point = null, onChange = () => {
    }) {
        this.set(point);
        this.onChange = onChange;
    }
}

export class Interval2D {
    /**
     * @type Point2D
     */
    #_ul;
    #_lr;

    get ul() {
        return this.#_ul;
    }

    /**
     * @param point {Point}
     */
    set ul(point) {
        this.#_ul.set(point);
        this.onChange(this);
    }

    get lr() {
        return this.#_lr;
    }

    /**
     * @param point
     */
    set lr(point) {
        this.#_lr.set(point);
        this.onChange(this);
    }

    onChange() {
    };

    /**
     * @param {Point} points
     * @description 平移: ul.add(...point);lr.add(...point)
     * @return {Interval2D}
     */
    translate(points) {
        let pUl = Point2D.pure(this.ul)
        let pLr = Point2D.pure(this.lr)
        this.ul.set(points)
        this.lr.set(Point2D.minus(pLr, pUl).add(points))
        this.onChange(this)
        return this;
    }

    add(...points) {
        this.ul.add(...points)
        this.lr.add(...points)
        this.onChange(this)
        return this;
    }

    /**
     *
     * @param interval2D.ul {Point}
     * @param interval2D.lr {Point}
     * @return {Interval2D}
     */
    set(interval2D) {
        this.ul = interval2D.ul;
        this.lr = interval2D.lr;
        return this;
    }

    toOffset() {
        let {ul, lr} = Interval2D.pure(this)
        return {
            left: ul.x,
            top: ul.y,
            width: lr.x - ul.x,
            height: lr.y - ul.y,
        }
    }

    toString() {
        return (
            `${this.ul.toString()} (${this.lr.x},${this.ul.y}) \n(${this.ul.x},${this.lr.y}) ${this.lr.toString()}`);
    }

    static toInterval2D(element) {
        let clientRect = element.getBoundingClientRect()
        return new Interval2D({
            ul: {
                x: clientRect.left,
                y: clientRect.top,
            },
            lr: {
                x: clientRect.right,
                y: clientRect.bottom,
            }
        })
    }

    static pure(interval) {
        return {
            ul: Point2D.pure(interval.ul),
            lr: Point2D.pure(interval.lr)
        }
    }

    constructor(interval2D, onChange = () => {
    }) {
        let {ul, lr} = interval2D || [null, null];
        this.#_ul = new Point2D(ul);
        this.#_lr = new Point2D(lr);
        this.set({ul, lr});
        onChange(this)
        this.onChange = onChange;
    }
}

const OFFSET_DEFAULT_CONFIG = {
    bindPosition: true,
    draggable: true
}

const WINDOW_DEFAULT_CONFIG = {
    title: 'window',
    draggable: true
}

export function Window(require) {
    let config = require.config;
    let WrappedComponent = require.Component;
    return class extends Component {
        //DOM element
        item;

        config = {
            ...Object.assign({}, WINDOW_DEFAULT_CONFIG, config),
        }

        #_interval;

        interval(newInterval) {
            if (!newInterval) return this.#_interval
            this.#_interval.set(newInterval);
            return this.#_interval;
        }

        offset;

        setDrag() {
            let pUl = Object.assign({}, {x: this.interval().ul.x, y: this.interval().ul.y});
            new EventListener(this.item, 'mousedown', (pE, cE) => {
                pUl = Object.assign({}, {x: this.interval().ul.x, y: this.interval().ul.y});
            })
            new EventListener(this.item, 'drag', (pE, cE) => {
                this.interval().translate({
                    x: pUl.x + cE.x - pE.x,
                    y: pUl.y + cE.y - pE.y
                })
            })
            new EventListener(this.item, 'mouseup', (pE, cE) => {
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
            this.#_interval = new Interval2D(null, interval => {
                this.setState({
                    style: {
                        ...interval.toOffset()
                    }
                })
            });
            this.interval(Interval2D.toInterval2D(this.item))
            if (this.config.draggable) this.setDrag();
        }

        componentWillUnmount() {
            alert('bye!')
        }

        render() {
            return (
                <div
                    className='window-container'
                    style={{
                        ...this.state.style
                    }}
                    ref={ref => this.item = ref}>
                    <Header title={this.state.title} delete={this.props.delete}/>
                    <Body>
                        <WrappedComponent/>
                    </Body>
                    <Footer/>
                </div>
            )
        }
    }

}

function Header(props) {
    return (<div
        style={{...props.style}}
        w-type='header'>
        <span>{props.title}</span>
        <button onClick={props.delete}>×</button>{/*TODO*/}

    </div>)
}

function Body(props) {
    return (
        <div
            style={{...props.style}}
            w-type='body'>
            {props.children}
        </div>
    )
}

function Footer(props) {
    return (<div
        style={{...props.style}}
        w-type='footer'>
        <span>{props.title}</span>
        {props.children}
    </div>)
}

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

function load(src) {
    let Win = Window(require('../' + src));
    return <Win/>;
}

export class Os {
    element;
    static load = load

    static addEventListener(element, type, listener) {
        return new EventListener(element, type, listener)
    }

    constructor(element) {
        this.element = element;
    }
}