import PropTypes from 'prop-types'
import './buttonSimple.css'


function ButtonSimple(props) {

    return (
        <button type = "submit" onClick={props.onClick} className={`buttonSimple ${props.variant} ${props.size}`} disabled={props.disabled}>
            {props.text}
        </button>
    );
}

ButtonSimple.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    variant: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
}

export default ButtonSimple;