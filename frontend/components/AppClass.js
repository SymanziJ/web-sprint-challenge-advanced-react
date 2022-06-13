import React from 'react';
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

export default class AppClass extends React.Component {

  state = initialState;

   getXY = () => {
    let x = this.state.index % 3 + 1;
    let y = Math.floor(this.state.index / 3)+1;
    return {xCoord: x, yCoord: y}
  }

  getXYMessage = () => {
    return (`Coordinates (${this.getXY().xCoord}, ${this.getXY().yCoord})`);
  }

  reset = () => {
    this.setState(initialState);
  }

  getNextIndex = (direction) => {
    let {index} = this.state;
    const {xCoord, yCoord} = this.getXY();
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

  move = (evt) => {
    const nextIndex = this.getNextIndex(evt.target.id);
    if (this.state.index !== nextIndex) {
      this.setState({
        ...this.state,
        message: initialMessage,
        index: nextIndex,
        steps: this.state.steps+1
      })
    } else {
      this.setState({
        ...this.state,
        message: `You can't go ${evt.target.id}`
      })
    }
  }

  onChange = (evt) => {
    this.setState({
      ...this.state,
      email: evt.target.value
    })
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const submission = {
      "x": this.getXY().xCoord,
      "y": this.getXY().yCoord,
      "steps": this.state.steps,
      "email": this.state.email
    }
    axios.post('http://localhost:9000/api/result', submission)
      .then( res => {
        this.setState({
          ...this.state,
          message: res.data.message,
          email: initialEmail
        })
      })
      .catch( err => {
        this.setState({
          ...this.state,
          message: err.response.data.message
        })
      })
  }

  render() {
    const { className } = this.props;
    const XYMessage = this.getXYMessage();

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{XYMessage}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email} ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
