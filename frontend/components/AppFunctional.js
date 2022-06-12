import React, {useState} from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps
}

export default function AppFunctional(props) {

  const [state, setState] = useState(initialState)

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x = state.index % 3 + 1;
    let y = Math.floor(state.index / 3)+1;
    return {xCoord: x, yCoord: y}
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return (`Coordinates (${getXY().xCoord}, ${getXY().yCoord})`);
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setState(initialState);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let {index} = state;
    const {xCoord, yCoord} = getXY();
    if (direction === 'left') {
      return (xCoord === 1 ? index : index-1);
    } else if (direction === 'right') {
      return (xCoord === 3 ? index : index+1);
    } else if (direction === 'up') {
      return (yCoord === 1 ? index : index-3);
    } else if (direction === 'down') {
      return (yCoord === 3 ? index : index+3);
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const nextIndex = getNextIndex(evt.target.id);
    if (state.index !== nextIndex) {
      setState({
        ...state,
        message: initialMessage,
        index: nextIndex,
        steps: state.steps+1
      })
    } else {
      setState({
        ...state,
        message: `You can't go ${evt.target.id}`
      })
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setState({
      ...state,
      email: evt.target.value
    })
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const submission = {
      "x": getXY().xCoord,
      "y": getXY().yCoord,
      "steps": state.steps,
      "email": state.email
    }
    axios.post('http://localhost:9000/api/result', submission)
      .then( res => {
        setState({
          ...state,
          message: res.data.message,
          email: initialEmail
        })
      })
      .catch( err => {
        setState({
          ...state,
          message: err.response.data.message
        })
      })
  }
  
  const XYMessage = getXYMessage();

  return (
    <div id="wrapper" className={props.className}>
        <div className="info">
          <h3 id="coordinates">{XYMessage}</h3>
          <h3 id="steps">You moved {state.steps} {state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
                {idx === state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={move}>LEFT</button>
          <button id="up" onClick={move}>UP</button>
          <button id="right" onClick={move}>RIGHT</button>
          <button id="down" onClick={move}>DOWN</button>
          <button id="reset" onClick={reset}>reset</button>
        </div>
        <form onSubmit={onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={onChange} value={state.email} ></input>
          <input id="submit" type="submit"></input>
        </form>
    </div>
  )
}
