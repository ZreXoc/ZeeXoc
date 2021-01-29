import React from "react";
import './index.css';

function Header(props) {
    return (<div
        style={{...props.style}}
        w-type='header'>
        <span>{props.title}</span>
        <button onClick={props.delete}>×</button>{/*TODO*/}
    </div>)
}

function Body(props) {
    return (
        <div
            style={{...props.style}}
            w-type='body'>
            {props.children}
        </div>
    )
}

function Footer(props) {
    return (<div
        style={{...props.style}}
        w-type='footer'>
        <span>{props.title}</span>
        {props.children}
    </div>)
}

export {Header,Body,Footer}