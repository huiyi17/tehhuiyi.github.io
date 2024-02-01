import React from 'react'
import "./submitPopUp.css"

import {
  closebtn
} from "./SubmitPopUpStyle"

function SubmitPopUp(props) {
  return (props.trigger) ? (
    <div className = "popup">
        <div className="popup-inner">
            <button style={closebtn} className = "close-btn" onClick={() => props.setTrigger(false)}>Close</button>
            <h1>Submit Successfully</h1>
            { props.children }
        </div>
    </div>
  ) : ""
}

export default SubmitPopUp