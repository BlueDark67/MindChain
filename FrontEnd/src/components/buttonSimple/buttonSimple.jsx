import PropTypes from 'prop-types'
import './buttonSimple.css'


function ButtonSimple(props) {

    

    return (
        <button onClick={props.onClick} className={`buttonSimple ${props.variant} ${props.size}`}>
            {props.text}
        </button>
    );
}

ButtonSimple.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    variant: PropTypes.string,
    size: PropTypes.string
}

export default ButtonSimple;