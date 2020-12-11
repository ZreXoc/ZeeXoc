import React, {Component} from 'react';

class Offset {
    /**
     * @property {Number} X
     * @property {Number} Y
     */
    _e = {}
    get e() {return this._e}
    set e(offset) {
        this._e = Offset.pure(offset);
    }

    static pure(offset){
        if (!offset) return {X:null,Y:null};
        if (offset.e) return {X:offset.e.X,Y:offset.e.Y};
        if (offset instanceof Array) return  {X:offset[0],Y:offset[1]};
        return {X:offset.X,Y:offset.Y};
    }

    /**
     * @param {Offset|Object} offsets
     */
    static add(...offsets) {
        let offset = new Offset();
        offset.add(...offsets);
        return offset
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
        this.e = [eX,eY]
    }

    /** @param {Offset|Object} offset */
    minus(offset) {
        let o = Offset.pure(offset);
        let X,Y;
        X = this.e.X - o.X;
        Y = this.e.Y - o.Y;
        this.e = {X, Y};
    }

    /** @param {Offset|Object} offset */
    constructor(offset=null) {
        this.e = offset
    }
}

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
        setInterval(() => {
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
        });
    }
}

export {LRef}

class Container extends Component {
    onMouseDown(e) {
        this.setState((preState, props) => {
            preState.lRef.mouseState = 'down';
        })
    }

    onMouseMove(e) {
        let mouseState = this.state.lRef.mouseState === 'down' || this.state.lRef.mouseState === 'dragging' ? 'dragging' : 'over';
        this.setState((preState, props) => {
            preState.lRef.mouseState = mouseState;
        });

        this.onDragging(e);

        if (this.state.mouseMove) this.state.mouseMove(e, {item: this.state.lRef.current, ...this.state.monitor});
    }

    onMouseUp(e) {
        this.setState((preState, props) => {
            preState.lRef.mouseState = 'up';
        })
    }

    onMouseEnter(e) {
        this.setState((preState, props) => {
            preState.lRef.mouseState = 'enter';
        })
    }

    onMouseLeave(e) {
        this.setState((preState, props) => {
            preState.lRef.mouseState = 'leave';
        })
    }

    onDragging(e) {
        if (this.state.lRef.mouseState !== 'dragging') return;

    }

    setListener() {
        let events = ['mouseDown', 'mouseMove', 'mouseUp', 'mouseEnter', 'mouseLeave']
        //TODO 事件监听在父级中设置，监听document.
        events.forEach((name, index) =>
            this.state.lRef.current.addEventListener(name.toLocaleLowerCase(), (e) => this['on' + name.charAt(0).toUpperCase() + name.slice(1)](e))
        );
    }


    constructor(props) {
        super(props);
        this.state = {
            ...this.props.conf,
            ref: React.createRef(),
            lRef: {},
        }
    }

    componentDidMount() {
        /*this.setState((preState, props)=>{
            preState.item = this.state.ref.current;
            delete preState.ref;
        })*/
        this.setState((preState, props) => {
            preState.lRef = new LRef(this.state.ref.current);
            preState.Offset = Offset.add({X: 1, Y: 2}, [2,9]);
            delete preState.ref;
        }, () => {
            this.setListener();
        })
        this.props.getData(this.state.lRef);
    }

    render() {
        return (
            <div w-type='container' ref={this.state.ref}>{this.props.children}</div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div style={{...this.props.style}} w-type='header'>{this.props.children}</div>
        )
    }
}

class Body extends Component {
    render() {
        return (
            <div style={{...this.props.style}} w-type='body'>{this.props.children}</div>
        )
    }
}

class Footer extends Component {
    render() {
        return (
            <div style={{...this.props.style}} w-type='footer'>{this.props.children}</div>
        )
    }
}

//export {setWindow};
export {Container};
export {Header};
export {Body};
export {Footer};