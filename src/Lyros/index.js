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
        if (x) this.x = x;
        if (y) this.y = y;
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
    static pure(point = [0, 0]) {
        let p = {x: point.x || point[0] || null, y: point.y || point[1] || null};

        if (typeof p.x != 'number') p.x = null
        if (typeof p.y != 'number') p.y = null
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
     * @param ul {Point}
     * @param lr {Point}
     * @return {Interval2D}
     */
    set(ul, lr) {
        this.ul = ul;
        this.lr = lr;
        return this;
    }

    toString() {
        return (
            `${this.ul.toString()} (${this.lr.x},${this.ul.y}) \n(${this.ul.x},${this.lr.y}) ${this.lr.toString()}`);
    }

    constructor(ul, lr) {
        this.#_ul = new Point2D(ul);
        this.#_lr = new Point2D(lr);
        this.set(ul, lr);
    }
}

export class MouseListener {
    static eventNames = ['mouseDown', 'mouseMove', 'mouseUp', 'mouseEnter', 'mouseLeave'];

    #_event = {
        mouseDown: [this.mouseDown],
        mouseMove: [this.mouseMove],
        mouseUp: [this.mouseUp],
        mouseEnter: [this.mouseEnter],
        mouseLeave: [this.mouseLeave]
    }

    /*resetEvent(events) {
        this.#_event = {
            mouseDown: [this.mouseDown, ...events.mouseDown],
            mouseMove: [this.mouseMove, ...events.mouseMove],
            mouseUp: [this.mouseUp, ...events.mouseUp],
            mouseEnter: [this.mouseEnter, ...events.mouseEnter],
            mouseLeave: [this.mouseLeave, ...events.mouseLeave]
        }
    }*/

    //仅供debug用
    getEvent() {
        return this.#_event;
    }

    appendEvent(event) {
        event = MouseListener.pureEvent(event)
        MouseListener.eventNames.forEach(eventName => {
            console.log(event[eventName])
            this.#_event[eventName] = [
                ...this.#_event[eventName], ...event[eventName] || [function () {
                }]
            ];


        });
        /*return () => this.deleteEvent(event)*/
    }

    //废弃中。地址拷贝导致deletedEvents同时被修改，只有部分内容被删除。
    /*deleteEvent(deletedEvents) {
        /!*
            events->
                E:eventArray{Array}->
                    e{Function}
         *!/
        deletedEvents = MouseListener.pureEvent(deletedEvents)
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

    static pureEvent(event) {
        let pureEvent = {};
        for (let e in event) {
            if (!event.hasOwnProperty(e)) continue;
            if (!MouseListener.eventNames.every(eN => eN !== e)) {
                Object.assign(pureEvent, {[e]: event[e]});
            }
        }
        return pureEvent;
    }

    mouseDown() {

    }

    mouseMove() {
    }

    mouseUp() {
    }

    mouseEnter() {
    }

    mouseLeave() {
    }

    setListener() {

    }

    constructor(element = document) {
        //TODO
    }
}

export class Os {
    setMouseListener(element) {
        return new MouseListener(element);
    }

    constructor(element) {
    }
}