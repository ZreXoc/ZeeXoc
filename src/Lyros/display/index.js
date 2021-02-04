import React from "react";
import './index.css';
import { Button } from 'antd';

function Header(props) {
    return (<div
        style={{...props.style}}
        w-type='header'>
        {props.children}
    </div>)
}
function Title(props) {
    return <span>{props.children}</span>;
}
function DeleteButton(props) {
    return <Button type="primary" onClick={props.delete}>×</Button>;
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

export {Header,Body,Footer,Title,DeleteButton}