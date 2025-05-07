import PropTypes from "prop-types";
import "./buttonChatroom.css";

function ButtonChatroom(props) {
  const participantsList = props.participantsList || [];
  return (
    <button type="submit" onClick={props.onClick} className={`buttonChatroom ${props.variant} ${props.size}`}>
        <span className="buttonChatroom-theme">Theme: {props.theme}</span>
        <span className="buttonChatroom-participants">
            <span className="participants-label">Participants ({props.participants}):</span>
            <span className="participants-marquee">
                <span className="participants-marquee-content">
                {participantsList.join(", ")}
                </span>
            </span>
        </span>
    </button>
  );
}

ButtonChatroom.propTypes = {
    onClick: PropTypes.func,
    theme: PropTypes.string,
    participants: PropTypes.number,
    participantsList: PropTypes.arrayOf(PropTypes.string),
};

export default ButtonChatroom;