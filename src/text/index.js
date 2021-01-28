import React, {Component} from "react";
import {Window} from "../Lyros";

const config = {
    title: 'text',
    draggable: true
}
class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div style={{color: 'red'}}>
                gjd
            </div>
        );
    }
}

export {TextBox as Component,config}