import React, {Component} from "react";

const config = {
    title: 'text',
    draggable: true
}

class TextBox extends Component{
    render(){
        return (
            <p>Hello world!</p>
        )
    }
}

export {TextBox as Component,config}