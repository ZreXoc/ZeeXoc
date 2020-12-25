/**
 * @typedef {Point2D|Object|Number[]} Point
 * @param {Number} Point.x
 * @param {Number} Point.y
 */
class Point2D{
    x;
    y;
    /**
     * @param {Point} point
     */
    setOffset(point){
        let {x,y} = Point2D.pure(point);
        this.x = x;
        this.y = y;
    }

    /**
     * @param {Point} point
     * @return {boolean|Point2D} - is coordinate changed
     */
    add(point){
        let {x,y} = Point2D.pure(point);
        if (x===0&&y===0) return false
        this.x += x||0;
        this.y += y||0;
        return this;
    }

    /**
     * @param {Point} point
     * @return {boolean|Point2D} - is coordinate changed
     */
    minus(point){
        let {x,y} = Point2D.pure(point);
        if (x===0&&y===0) return false
        this.x -= x||0;
        this.y -= y||0;
        return this;
    }

    /**
     * @param {Point} points
     * @return {Point2D}
     */
    static sum(...points){
        let result = new Point2D();
        points.forEach(value => result.add(value))
        return result;
    }

    static minus(leftPoint,rightPoint){
        return Point2D.new(leftPoint).minus(rightPoint);
    }

    /**
     * @param{Point} [point = null]
     * @return {Point2D}
     */
    static new = (point=null) => new Point2D(point);

    /**
     * @param {Point} point
     * @returns {{x: (Number|null), y: (Number|null)}}
     */
    static pure(point) {
        if (!point) return {x: null, y: null};
        if (point instanceof Array) return {x: point[0], y: point[1]};
        return {x: point.x||null, y: point.y||null};
    }

    /**
     * @param {Point} [point = null]
    */
    constructor(point=null) {
        this.setOffset(point)
    }
}
export {Point2D}
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