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

class LRef {
    current = {};
    mouseState = '';

    _initialClientOffset = {};
    _clientOffset = {};

    initialClientOffset(offset) {
        if (!offset) return this._initialClientOffset;
        this._initialClientOffset = {X: offset.X, Y: offset.Y};
    }

    clientOffset(offset) {
        if (!offset) return this._clientOffset;
        this._clientOffset = {X: offset.X, Y: offset.Y};
    }

    _position = {};
    _size = {};

    //TODO _size = {w,h}

    /**
     * @param {Object|undefined} position
     * @param {Object|null|undefined} position.ul - 左上坐标
     * @param {Object|null|undefined} position.lr - 右下坐标
     */
    position(position) {
        if (!position) return this._position;
        /*
        TODO if (position.lr == null)
        TODO if (position.ul == null)
        */
        if (position.ul === undefined) position.ul = this._position.ul;
        if (position.lr === undefined) position.lr = this._position.lr;
        this._position = {ul: position.ul, lr: position.lr};
    }

    diffOffset() {
        return this.diff(this.initialClientOffset(), this.clientOffset());
    }

    getOffset(e, type = null) {
        switch (type) {
            case null:
                if (e.target) return {X: e.clientX, Y: e.clientY};
                if (e.X || e.Y) return {X: e.X || 0, Y: e.Y || 0};
            case 'event':
                return {X: e.clientX, Y: e.clientY};
            default:
                return null
        }
    }

    diff(initialOffset, offset) {
        initialOffset = this.getOffset(initialOffset);
        offset = this.getOffset(offset);
        return {X: offset.X - initialOffset.X, Y: offset.Y - initialOffset.Y}
    }

    constructor(element = document) {
        this.current = element;
        /*setInterval(() => {
            let position = {
                X: parseInt(element.style.left.match(/\d+/) || 0),
                Y: parseInt(element.style.top.match(/\d+/) || 0)
            }
            window.ee = element.style;
            if (this.position() !== position) this.position({ul: position})
        }, 1000);
        element.addEventListener('mousedown', (e) => this.initialClientOffset(this.getOffset(e)))
        element.addEventListener('mousemove', (e) => {
            this.clientOffset(this.getOffset(e));
        });*/
    }
}

export {LRef}

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
                ref={this.state.ref}
                onClick={() => {
                    this.setPosition([Math.floor(Math.random()*500), Math.floor(Math.random()*500)], null)
                    console.log(this._position)
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

//export {setWindow};
export {Container};
export {Header};
export {Body};
export {Footer};