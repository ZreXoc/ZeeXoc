import React, {Component} from "react";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import LBasic from "./LBasic";
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';

/*
class Header extends Component {
    constructor(props) {
        super(props);
        this.self = React.createRef();
        this.state = {
            contain: this.props.children,
            LDrag: this.props.header
        }
    }


    render() {
        return (
            <div l-w-type="header" ref={this.self}>
                {this.state.contain}
            </div>
        );
    }
}
*/
/*
class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contain: this.props.children,
        }
    }


    render() {
        return (
            <div l-w-type="body">
                {this.state.contain}
            </div>
        );
    }
}
*/

const boxSource = {
    /**
     * 开始拖拽时触发当前函数
     * @param {*} props 组件的 props
     */
    beginDrag(props) {
        // 返回的对象可以在 monitor.getItem() 中获取到
        return {
            name: props.name,
        }
    },

    /**
     * 拖拽结束时触发当前函数
     * @param {*} props 当前组件的 props
     * @param {*} monitor DragSourceMonitor 对象
     */
    endDrag(props, monitor,component) {
        // 当前拖拽的 item 组件
        const item = monitor.getItem()
        // 拖拽元素放下时，drop 结果
        const dropResult = monitor.getDropResult()

        // 如果 drop 结果存在，就弹出 alert 提示
        if (dropResult) {
            alert(`You dropped ${item.name} into ${dropResult.name}!`)
        }
        console.log(component)
    },
}

@DragSource(
    'LWindow',
    // 拖拽事件对象
    boxSource,
    // 收集功能函数，包含 connect 和 monitor 参数
    // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
    (connect, monitor) => ({
        // 包裹住 DOM 节点，使其可以进行拖拽操作
        connectDragSource: connect.dragSource(),
        // 是否处于拖拽状态
        isDragging: monitor.isDragging(),
    }),
)
class LWindow extends Component {
    setClass(type) {
        switch (type) {
            case 'default':
            case 'act':
                return 'act-window';
            default:
                return 'act-window';
        }
        ;
    }

    setContain(contain) {
        let map = new Map();
        map.set('header', contain[0]);
        map.set('body', contain[1]);
        map.set('footer', contain[2]);
        return map
    }

    constructor(props) {
        super(props);
        this.self = React.createRef();

        this.state = {
            index: this.props.index,
            type: this.props.type,
            style: null,
            class: this.setClass(this.props.type),
            contain: this.setContain(this.props.children),
            dom: {
                container: this.self.current,
            }
        }
    }

    componentDidMount() {
        /*const dragEle = {
            container: this.self.current,
            handler: this.self.current.childNodes[0],
            parent: this.self.current.parentNode,
            dragType: true,
        }
        LBasic.setDrag(dragEle);*/
    }
    static propTypes = {
        name: PropTypes.string.isRequired,
        isDragging: PropTypes.bool.isRequired,
        connectDragSource: PropTypes.func.isRequired
    }
    render() {
        const { isDragging, connectDragSource } = this.props
        const { name } = this.props
        const opacity = isDragging ? 0.4 : 1


        return connectDragSource && connectDragSource(
            <div id={"LWindow-" + this.state.index}
                 className={this.state.class}
                 l-w-type='container'
                 style={{...this.state.style,opacity}}
                 ref={this.self}>
                <div l-w-type="header">
                    {this.state.contain.get('header')}
                </div>
                <div l-w-type="body">
                    {name}
                    {this.state.contain.get('body')}
                </div>
                {/*<Header>
                            {this.state.contain.get('header')}
                        </Header>
                        <Body>
                            {this.state.contain.get('body')}
                        </Body>*/}
                {/*<footer>TODO*/}
            </div>
        );
    }
}

export default LWindow;