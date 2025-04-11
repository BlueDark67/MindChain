import React, {Component} from "react";
import PropTypes from "prop-types";
import Switch from "react-switch";
import './switch.css';

class SwitchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            inputValue: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleChange(checked){
        this.setState({checked});
        if(this.props.onSwitchChange){
            this.props.onSwitchChange(checked);
        }
    }

    handleInputChange(e){
       const value = e.target.value;
       this.setState({inputValue: value});
         if(this.props.onInputChange){
              this.props.onInputChange(value);
         }
    }

    render(){ 
        return(
            <label>
                <span>{this.props.labelSwitch}</span>
                <Switch onChange={this.handleChange} checked={this.state.checked} />
                {this.state.checked && (
                    <div>
                        <span>{this.props.labelInput}</span>
                        <br/>
                        <input type="text" placeholder={this.props.placeholder} value={this.state.inputValue} onChange={this.handleInputChange} />
                    </div>
                )}
            </label>
        );
    }   
}

SwitchComponent.propTypes = {
    labelSwitch: PropTypes.string.isRequired,
    labelInput: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    placeholder: PropTypes.string,
    onSwitchChange: PropTypes.func,
    onInputChange: PropTypes.func,
};


export default SwitchComponent;