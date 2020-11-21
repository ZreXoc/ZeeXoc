import React, {Component} from 'react';
import './Stylesheet/basic.css';
import LWindow from "./Scripts/lyr-window";

class App extends Component {
    render() {
        let lWindow = {
            num: 0,
        }
        return (
            <div id="basic-window">
                <div id="action-area">
                    <LWindow index={lWindow.num++} type={"act"}>
                        <div>
                            header
                        </div>
                        <div>
                            <p>this is a text</p>
                            <p>this is a text</p>
                            <p>this is a text</p>
                            <p>this is a text</p>
                            <p>this is a text</p>
                        </div>
                        <div>
                            footer
                        </div>
                    </LWindow>
                </div>
            </div>
        );
    }
}

/*
function App() {

}
*/


export default App;