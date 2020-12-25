import React,{Component} from "react";


class TextBox extends Component{
    constructor(props) {
        super(props);
        this.state = {
            conf:{
               id:'textBox',
                icon:{
                   src:'logo.svg'
                }
            }
        }
    }
    render() {
        this.props.conf(this.state.conf)
        return (
            <div>
                ddd
            </div>
        );
    }
}

export default TextBox;