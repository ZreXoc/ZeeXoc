/**
 * @typedef {(Point2D|{x: (Number|null), y: (Number|null)})} Point
 * @property {Number} x
 * @property {Number} y
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
     * @param {Point|Number[]} point
     * @return {boolean|Point2D} - is coordinate changed
     */
    add(point) {
        let {x, y} = Point2D.pure(point);
        if (x === 0 && y === 0) return false
        this.x += x || 0;
        this.y += y || 0;
        return this;
    }

    /**
     * @param {Point|Number[]} point
     * @return {boolean|Point2D} - is coordinate changed
     */
    minus(point) {
        let {x, y} = Point2D.pure(point);
        if (x === 0 && y === 0) return false
        this.x -= x || 0;
        this.y -= y || 0;
        return this;
    }

    /**
     * @param {Point|Number[]|null} [point=[0,0]]
     * @param {Number} [e=3] - 精确度
     * @return {string} - distance
     */
    distTo(point = {x: 0, y: 0}, e = 3) {
        let {x, y} = Point2D.minus(Point2D.pure(this), Point2D.pure(point));
        return Math.sqrt(x * x + y * y).toFixed(e);
    }

    /**
     * @param {Point|Number[]|null} point
     */
    set(point) {
        let {x, y} = Point2D.pure(point);
        if (x) this.x = x;
        if (y) this.y = y;
    }

    toString(){
        return `(${this.x},${this.y})`
    }

    /**
     * @param {Point|Number[]} points
     * @return {Point2D}
     */
    static sum(...points) {
        let result = new Point2D();
        points.forEach(value => result.add(value))
        return result;
    }

    /**
     * @param {Point|Number[]} leftPoint
     * @param {Point|Number[]} rightPoint
     * @return {Point2D} - distance
     */
    static minus(leftPoint, rightPoint) {
        return Point2D.new(leftPoint).minus(rightPoint);
    }

    /**
     * @param {Point|Number[]} leftPoint
     * @param {Point|Number[]} [rightPoint=[0,0]]
     * @param {Number} [e=3] - 精确度
     * @return {string} - distance
     */
    static dist(leftPoint, rightPoint = [0, 0], e = 3) {
        let {x, y} = Point2D.minus(Point2D.pure(leftPoint), Point2D.pure(rightPoint));
        return Math.sqrt(x * x + y * y).toFixed(e);
    }

    /**
     * @param [point = null]
     * @return {Point2D}
     */
    static new = (point = null) => new Point2D(point);

    /**
     * @param {Point|Number[]|null} [point = {x: null, y: null}]
     * @returns {{x: (Number|null), y: (Number|null)}}
     */
    static pure(point) {
        let p = {x: point.x || point[0] || null, y: point.y || point[1] || null};

        if (typeof p.x != 'number') p.x = null
        if (typeof p.y != 'number') p.y = null
        return p;
    }

    /**
     * @param {Point|Number[]|null} [point = null]
     */
    constructor(point = null) {
        this.set(point)
    }
}

export class Interval2D {
    #_lr;
    #_ul;

    get ul() {
        return this.#_ul;
    }

    /** @param {Point|Number[]|null} point */
    set ul(point) {
        this.#_ul.set(point);
    }

    get lr() {
        return this.#_lr;
    }

    /** @param {Point|Number[]|null} point */
    set lr(point) {
        this.#_lr.set(point);
    }

    /** @param {Point|Number[]} points*/
    translate(...points) {
        this.ul.add(...points)
    }

    /**
     * @param {Point} ul - upper left point
     * @param {Point} lr - lower right point
     */
    set(ul, lr) {
        this.ul = ul;
        this.lr = lr;
    }

    toString(){
        return(
        `${this.ul.toString()},(${this.lr.x},${this.ul.x})\n(${this.ul.x},${this.lr.x}),${this.lr.toString()}`);
    }

    constructor(ul, lr) {
        this.#_ul = new Point2D(ul);
        this.#_lr = new Point2D(lr);
        this.set(ul, lr);
    }
}

class Offset {
    /**
     * @property {Number} X
     * @property {Number} Y
     */
    _e = {}
    get e() {
        return this._e
    }

    set e(offset) {
        this._e = Offset.pure(offset);
    }

    static pure(offset) {
        if (!offset) return {X: null, Y: null};
        if (offset.e) return {X: offset.e.X, Y: offset.e.Y};
        if (offset instanceof Array) return {X: offset[0], Y: offset[1]};
        return {X: offset.X, Y: offset.Y};
    }

    static equal(...offsets) {
        return offsets.every(offset => {
            if (Offset.pure(offset).X === Offset.pure(offsets[0]).X
                && Offset.pure(offset).Y === Offset.pure(offsets[0]).Y) return true;
            return false;
        })
    }

    /**
     * @param {Offset|Object} offsets
     */
    static add(...offsets) {
        let offset = new Offset();
        offset.add(...offsets);
        return offset
    }

    static minus(offsetA, offsetB) {
        let offset = new Offset(offsetA);
        offset.minus(offsetB);
        return offset;
    }


    /**
     * @param offsets
     */
    add(...offsets) {
        let eX = 0, eY = 0
        offsets.forEach((offset) => {
            let o = Offset.pure(offset)
            eX += o.X;
            eY += o.Y;
        })
        this.e = [eX, eY]
    }

    /** @param {Offset|Object} offset */
    minus(offset) {
        let o = Offset.pure(offset);
        let X, Y;
        X = this.e.X - o.X;
        Y = this.e.Y - o.Y;
        this.e = {X, Y};
    }

    /** @param {Offset|Object} offset */
    constructor(offset = null) {
        this.e = offset
    }
}