import PropTypes from 'prop-types'
import './buttonSimple.css'



function ButtonSimple(props){
    return(
        <button className='buttonSimple'> {props.text}</button>
    );
}

ButtonSimple.prototype = {
    text: PropTypes.string
}

export default ButtonSimple;