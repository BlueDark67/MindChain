import React, {Component} from "react";
import PropTypes from "prop-types";
import Switch from "react-switch";
import './switch.css';

//Componente Switch que é usado na criação de sala para escolher o se a sala é privada e para escolher se o tema é escolhido pelo criador
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
            <label className="label-create">
                <span className="label-span-create">{this.props.labelSwitch}</span>
                <Switch onChange={this.handleChange} checked={this.state.checked} />
                {this.state.checked && (
                    <div>
                        <span className="div-span-create">{this.props.labelInput}</span>
                        <br/>
                        <input className="input-create" type="text" placeholder={this.props.placeholder} value={this.state.inputValue} onChange={this.handleInputChange} />
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