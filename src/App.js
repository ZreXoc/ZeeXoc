import React, {Component} from 'react';

import './Stylesheet/basic.css';
import LWindow from "./Scripts/lyr-window";


function App() {
    let lWindow = {
        num: 0,
    }
    return (
        <div id="basic-window">
            <div id="action-area">
                <LWindow index={lWindow.num++} type={"act"} draggable={true}>
                    <div>
                        header
                    </div>
                    <div>
                        <iframe src="http://baidu.com" frameborder="0"></iframe>
                    </div>
                    <div>
                        footer
                    </div>
                </LWindow>
            </div>
        </div>
    );
}


export default App;