import React, {Component} from "react";

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
    }

    get y() {
        return this.#_y
    }

    /**@param {Number}val*/
    set y(val) {
        if (typeof val == "number") this.#_y = val
    }

    /**
     * @param {Point} point
     * @return {Point2D} - is coordinate changed
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
        this.x -= x || 0;
        this.y -= y || 0;
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
     */
    constructor(point = null) {
        this.set(point)
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
    }

    get lr() {
        return this.#_lr;
    }

    /**
     * @param point
     */
    set lr(point) {
        this.#_lr.set(point);
    }

    /**
     * @param {Point} points
     * @description 平移: ul.add(...point);lr.add(...point)
     * @return {Interval2D}
     */
    translate(...points) {
        this.ul.add(...points)
        this.lr.add(...points)
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

    constructor(interval2D = [null, null]) {
        let {ul, lr} = interval2D;
        this.#_ul = new Point2D(ul);
        this.#_lr = new Point2D(lr);
        this.set({ul, lr});
    }
}

const ORIGINEVENT = ['mouseDown', 'mouseMove', 'mouseUp', 'mouseEnter', 'mouseLeave'];
const EXTENDEVENT = [...ORIGINEVENT, 'mouseStill', 'dragging'];
const DEFAULT_CONFIG = {
    title:'window',
    events:{
        mouseDown:[],
        mouseMove:[],
        mouseUp:[],
        mouseEnter:[],
        mouseLeave:[],
        mouseStill:[],
        dragging:[]
    },
    drag: {
        enable: true,
        limit: 'parent',
    }
}

export function Window(config) {
    return WrappedComponent => class extends Component {
        //DOM element
        item;

        _config = {
            ...Object.assign({}, DEFAULT_CONFIG, config),
        }

        get config() {
            return this._config;
        }

        set config(newConf) {
            return Object.assign(this._config, newConf);
        }

        _interval;

        get interval() {
            return this._interval;
        }

        set interval(newInterval) {
            this._interval.set(newInterval);
            this.setState({
                style: {
                    ...this._interval.toOffset()
                }
            })
            return this._interval;
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
            this._interval = new Interval2D();
            this.interval = Interval2D.toInterval2D(this.item)
        }

        render() {
            return (
                <div
                    className='window-container'
                    style={{
                        ...this.state.style
                    }}
                    ref={ref => this.item = ref}>
                    <Header title={this.state.title}/>
                    <Body>
                        <WrappedComponent
                            w-type='body'
                            config={newConf => newConf ? this.config = newConf : this.config}
                            debug={{
                                interval: newInterval => newInterval ? this.interval = newInterval : this.interval,
                                title: nT => nT?this.setState({title:nT}):this.state.title
                            }}
                        />
                    </Body>
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
        {props.children}
    </div>)
}
function Body(props) {
    return(
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

export class EventListener {
    element;
    /**
     * @description element`s state:'focused'|'na'
     * @type {string}
     */
    state = '';
    currentOffset = new Point2D();
    initialOffset = new Point2D();

    #_event = {
        mouseDown: [],
        mouseMove: [],
        mouseUp: [],
        mouseEnter: [],
        mouseLeave: [],
        mouseStill: [],
        dragging: [],
    }

    resetEvent(events) {
        this.#_event = {};
        this.appendEvent(events);
    }

    //仅供debug用
    getEvent() {
        return this.#_event;
    }

    appendEvent(event) {
        event = EventListener.pureEvent(event)
        EXTENDEVENT.forEach(eventName => {
            this.#_event[eventName] = [
                ...this.#_event[eventName], ...event[eventName] || []
            ];
        });
        /*return () => this.deleteEvent(event)*/
    }

    //废弃中。地址拷贝导致deletedEvents同时被修改，只有部分内容被删除。

    static pureEvent(event) {
        let pureEvent = {};
        for (let e in event) {
            if (!event.hasOwnProperty(e)) continue;
            if (!EXTENDEVENT.every(eN => eN !== e)) {
                Object.assign(pureEvent, {[e]: event[e]});
            }
        }
        return pureEvent;
    }

    /*deleteEvent(deletedEvents) {
        /!*
            events->
                E:eventArray{Array}->
                    e{Function}
         *!/
        deletedEvents = EventListener.pureEvent(deletedEvents)
        console.log(2,{...deletedEvents})
        for (let dE in deletedEvents) {
            if (!deletedEvents.hasOwnProperty(dE)) continue;
            if (!this.#_event[dE]) continue;

            let oldEventArray = this.#_event[dE]
            let deletedEventArray = deletedEvents[dE]
            //遍历原event中event数组,相等则删去;
            oldEventArray.forEach((oE, index) => {
                if (!deletedEventArray.every((dE) => dE !== oE)) {
                    this.#_event[dE].splice(index, 1)
                }
            })
        }
        console.log(this.#_event)
    }*/

    mouseDown(e) {
        let boundingClientRect = this.element.getBoundingClientRect();
        this.initialOffset.set([boundingClientRect.x, boundingClientRect.y]);
    }

    mouseMove(e) {//TODO
        let mouseState = (['dragging', 'down'].find(value => value === mouseEvent.state)) ? 'dragging' : 'moving';

        this.currentOffset.e = [e.clientX, e.clientY];
        this.state = mouseState;
        if (mouseState === 'dragging') this.dragging(e);
    }

    mouseUp(e) {
    }

    mouseEnter(e) {
    }

    mouseLeave(e) {
    }

    mouseStill(e) {

    }

    dragging(e) {

    }

    setListener(element) {
        this.element = element;
        ORIGINEVENT.forEach((eventName, index) =>
            this.element.addEventListener(eventName.toLocaleLowerCase(), e => this[eventName](e))
        );
        //mouseStill
        setInterval(() => {
            if (['dragging', 'down', 'leave', 'still'].find(value => value === this.state)) return;

            let currentOffset = mouseEvent.currentOffset;
            setTimeout(() => {
                if (Point2D.equal(currentOffset, mouseEvent.currentOffset)) {
                    this.state = 'still'
                }
            }, 100)
        }, 200)
    }

    constructor(element = document) {
        this.setListener(element);
        //TODO
    }
}

let mouseEvent = new class MouseEventListener extends EventListener {
    mouseDown(e) {
        this.initialOffset.set([e.clientX, e.clientY]);
        this.state = 'mouseDown';
    }

    constructor() {
        super(document);
    }
}()

function load() {

}
export class Os {
    static load=require=>require().default;

    setEventListener(element) {
        return new EventListener(element);
    }

    constructor(element) {
    }
}