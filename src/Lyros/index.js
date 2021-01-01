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

class MouseListener {
    eventNames = ['mouseDown', 'mouseMove', 'mouseUp', 'mouseEnter', 'mouseLeave'];
    #_event = {
        a:[1,2],
        b:[2,22]
    };

    /*resetEvent(events) {
        this.#_event = {
            mouseDown: [this.mouseDown, ...events.mouseDown],
            mouseMove: [this.mouseMove, ...events.mouseMove],
            mouseUp: [this.mouseUp, ...events.mouseUp],
            mouseEnter: [this.mouseEnter, ...events.mouseEnter],
            mouseLeave: [this.mouseLeave, ...events.mouseLeave]
        }
    }*/
    appendEvent(event) {
        /*for (let e in event) {
            if (!event.hasOwnProperty(e)) continue;
            if (!this.eventNames.includes(e)) continue;

            console.log(e, event[e])
        }*/
    }

    deleteEvent(deletedEvents) {
        /*
            events->
                E:eventArray{Array}->
                    e{Function}

         */
        console.log(1,this.#_event)
        for (let dE in deletedEvents) {
            if (!deletedEvents.hasOwnProperty(dE)) continue;
            if (!this.#_event[dE]) continue//不包含deletedEvents中的event则continue

            let oldEventArray = this.#_event[dE]
            let deletedEventArray = deletedEvents[dE]
            let tt = this.#_event;
            //遍历原event中event数组,相等则删去;TODO
            oldEventArray.forEach((oE,index) => {
                if (deletedEventArray.every((dE)=>dE===oE)) {
                    console.log(index,...this.#_event[dE][index])
                    console.log(tt)
                    debugger;
                    this.#_event[dE].splice(index)
                    console.log(index,...this.#_event[dE])
                }
            })
        }
        console.log(2,this.#_event)
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

    constructor(element = document, event) {
        this.#_event = event
        this.appendEvent(event)
    }
}

export class Os {
    setMouseListener(element, events) {
        return new MouseListener(element, events);
    }

    constructor(element) {
    }
}