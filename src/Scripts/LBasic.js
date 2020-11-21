import React, {Component} from "react";
import {render} from "react-dom";

const LBasic = {
    /**
     *
     * @param {DOM} dragEle.container - 拖拽体
     * @param {DOM} [dragEle.handler = body] - 拖拽把手
     * @param {DOM} [dragEle.parent = body.parent] - 父级区域
     * @param {boolean,string} dragEle.dragType - 拖拽类型:true||false||"return"
     */
    setDrag: function (dragEle) {
        const dContainer = dragEle.container;
        const dHandler = dragEle.handler || dContainer;
        const dParent = dragEle.parent || dContainer.parentNode;
        let draggable
        switch (dragEle.dragType) {
            case false:
                draggable = false;
                break;
            default:
                draggable = true
        }
        let sent = {
            l: dParent.left || 0,
            r: dParent.offsetWidth - dContainer.offsetWidth,
            t: dParent.top || 0,
            b: dParent.offsetHeight - dContainer.offsetHeight,
            n: 10
        }
        let isDrag;
        let sentX;
        let sentY;
        let dmW;
        let dmH;
        dHandler.addEventListener('mousedown', function (e) {
            if (!draggable) return;
            e.stopPropagation();
            isDrag = true
            sentX = e.clientX - dContainer.offsetLeft;
            sentY = e.clientY - dContainer.offsetTop;
            dmW = document.documentElement.clientWidth || document.body.clientWidth;
            dmH = document.documentElement.clientHeight || document.body.clientHeight;
            sent.r = sent.r || dmW - dContainer.offsetWidth;
            sent.b = sent.b || dmH - dContainer.offsetHeight;
            document.addEventListener('mousemove', function (e) {
                if (!isDrag) return;

                let slideLeft = e.clientX - sentX;
                let slideTop = e.clientY - sentY;


                if (slideLeft <= sent.l) {
                    slideLeft = sent.l;
                }
                if (slideLeft >= sent.r) {
                    slideLeft = sent.r;
                }
                if (slideTop <= sent.t) {
                    slideTop = sent.t;
                }
                if (slideTop >= sent.b) {
                    slideTop = sent.b;
                }

                dContainer.style.left = slideLeft + 'px';
                dContainer.style.top = slideTop + 'px';
            });
        });
        window.addEventListener('mouseup', endDrag);

        function endDrag() {
            console.log(1)
            isDrag = false;
            if (dragEle.dragType == 'return') {
                dContainer.style.left = sentX + 'px';
                dContainer.style.top = sentY + 'px';
            }
        }
    }
}
export {LBasic};

/**
 * @param {Object}spec
 * @param {function}spec.beginDrag - 拖拽开始调用函数
 * @param {function}spec.dragging - 拖拽中调用函数
 * @param {function}spec.endDrag - 拖拽结束调用函数
 * @returns {function(*): {new(*=): LDrag, ref: React.RefObject<unknown>, dragItem: unknown, prototype: LDrag}}
 * @constructor
 */
function LDrag(spec) {
    return function (DragComponent) {
        return class LDrag extends DragComponent {
            //同dragItem暴露给外部
            monitor = {
                isDragging: this.isDragging,
                getInitialClientOffset: this.getInitialClientOffset.bind(this),
                getClientOffset: this.getClientOffset.bind(this),
                oldPosition:this.getPosition(),
                getPosition: this.getPosition.bind(this),
                setPosition: this.setPosition.bind(this),
            }
            //Func Start
            dragItem;

            isDragging = false;

            beginDrag(e) {
                this.isDragging = true

                this.setInitialClientOffset(this.getOffset(e));
                spec.beginDrag(this.dragItem, this.monitor);
            }

            dragging(e) {
                if (!this.isDragging) return;
                this.setClientOffset(this.getOffset(e));

                spec.dragging(this.dragItem, this.monitor);
            }

            endDrag(e) {
                if (!this.isDragging) return;
                this.isDragging = false;

                spec.endDrag(this.dragItem, this.monitor);
            }

            getOffset(e) {
                return {X: e.clientX, Y: e.clientY}
            };

            initialClientOffset = {X: null, Y: null};

            setInitialClientOffset(offset) {
                this.initialClientOffset = {X: offset.X, Y: offset.Y};
            }

            getInitialClientOffset() {
                return this.initialClientOffset;
            }

            clientOffset = {X: null, Y: null};

            setClientOffset(offset) {
                this.clientOffset = {X: offset.X, Y: offset.Y};
            }

            getClientOffset(e) {
                return this.clientOffset;
            }

            getPosition(){
                return {X:Number(this.dragItem.style.left.replace('px','')),Y:Number(this.dragItem.style.top.replace('px',''))}
            }

            setPosition(position) {
                this.dragItem.style.left = position.X + 'px';
                this.dragItem.style.top = position.Y + 'px';
            }

            //Func End

            constructor(props) {
                super(props);
                this.ref = React.createRef();
            }

            componentDidMount() {
                this.dragItem = this.ref.current;
                this.dragItem.addEventListener('mousedown', (e) => this.beginDrag(e))
                document.addEventListener('mousemove', (e) => this.dragging(e))
                document.addEventListener('mouseup', (e) => this.endDrag(e))
            }

            render() {
                return super.render()
            }
        }

    }
}

class LyWindow extends Component {
    static _initialClientOffset = {};
    static _clientOffset = {};

    static get initialClientOffset() {
        return this._initialClientOffset;
    }

    static set initialClientOffset(value) {
        this._initialClientOffset = value;
    }

    static get clientOffset() {
        return this._clientOffset;
    }

    static set clientOffset(value) {
        this._clientOffset = value;
    }

    constructor(props) {
        super(props);
        React.forwardRef((props, ref) => {
           this.item = ref;
            console.log(ref)
        });
        ;
        console.log(props)
        console.log(this.item)
    }

    render() {
        return null
    }
}

export {LDrag};
export {LyWindow};