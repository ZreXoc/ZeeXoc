import React, {Component} from 'react';

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

export {Offset}

class Container extends Component {
    _position = {
        ul: new Offset(),   //左上
        lr: new Offset()    //右下
    }

    get position() {
        return this._position;
    }

    set position(offset) {
        let {ul, lr} = offset;
        if (ul) this.position.ul.e = Offset.pure(ul);
        if (lr) this.position.lr.e = Offset.pure(lr);
    }

    setPosition(ul, lr) {
        this.position = {ul, lr}
        this.setState({
            style: {
                left: this.position.ul.e.X + 'px',
                top: this.position.ul.e.Y + 'px',
                width: this.position.lr.e.X-this.position.ul.e.X + 'px',
                height: this.position.lr.e.Y-this.position.ul.e.Y + 'px',
            }
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            style: {}
        }
    }

    componentDidMount() {
        this.setPosition([Math.floor(Math.random()*500), Math.floor(Math.random()*500)], null)
    }

    render() {
        return (
            <div
                w-type='container'
                style={{...this.state.style}}
                onClick={() => {
                    this.setPosition([Math.floor(Math.random()*500), Math.floor(Math.random()*500)], null)
                }}
            >{this.props.children}</div>
        )
    }
}

function Header(props) {
    return (<div style={{...props.style}} w-type='header'>{props.children}</div>)
}

function Body(props) {
    return (<div style={{...props.style}} w-type='body'>{props.children}</div>)
}

function Footer(props) {
    return (<div style={{...props.style}} w-type='footer'>{props.children}</div>)
}

function Icon(props) {
    return(<img src="props.src" alt="props.alt"/>)
}

//export {setWindow};
export {Container};
export {Header};
export {Body};
export {Footer};