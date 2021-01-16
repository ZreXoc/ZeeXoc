import React, {Component} from "react";
import {Window} from "../Lyros";

const config = {
    name: 'text'
}
@Window(config)
class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        let t = 0;
        setInterval(() => {
            this.props.debug.interval(this.props.debug.interval().translate({
                x: t,
                y: t
            }))
            this.props.debug.title(t)
            t++;
        }, 1000)
    }

    render() {
        this.props.config({
            name: 1111
        })
        return (
            <div style={{color: 'red'}}>
                name: {this.props.config().name}
                {/*offset: {this.props.debug.interval().toString()}*/}
            </div>
        );
    }
}

export default TextBox;