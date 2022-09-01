import logo from './logo.svg';
import './App.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// TODO:
// error: timer is not set to 00:00 according to tests



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {type : 'Session', sessionLength : 25, breakLength : 5, time : [25, '00']}
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.setTime = this.setTime.bind(this);
    this.decreaseTime = this.decreaseTime.bind(this);
    this.resetTime = this.resetTime.bind(this);
  }

  // reset time
  resetTime() {
    this.setState({type : 'Session', sessionLength : 25, breakLength : 5, time : [25, '00']});
  }

  // decrement session length
  sessionDecrement() {
    if(this.state.sessionLength == 1) {
      return;
    }
    this.setState((prevState) => {
      return {type : prevState.type, sessionLength : prevState.sessionLength - 1, breakLength : prevState.breakLength, time : prevState.time};
    });
    this.setTime();
  }

  // increment session length
  sessionIncrement() {
    if(this.state.sessionLength == 60) {
      return;
    }
    this.setState((prevState) => {
      return {type : prevState.type, sessionLength : prevState.sessionLength + 1, breakLength : prevState.breakLength, time : prevState.time};
    });
    this.setTime();
  }

  // decrement break length
  breakDecrement() {
    if(this.state.breakLength == 1) {
      return;
    }
    this.setState((prevState) => {
      return {type : prevState.type, sessionLength : prevState.sessionLength, breakLength : prevState.breakLength - 1, time : prevState.time};
    });
    this.setTime();
  }

  // increment break length
  breakIncrement() {
    if(this.state.breakLength == 60) {
      return;
    }
    this.setState((prevState) => {
      return {type : prevState.type, sessionLength : prevState.sessionLength, breakLength : prevState.breakLength + 1, time : prevState.time};
    });
    this.setTime();
  }

  // change timer value based on session/break length 
  setTime() {
    if(this.state.type == 'Session') {
      this.setState((prevState) => {
        return {type : prevState.type, sessionLength: prevState.sessionLength, breakLength: prevState.breakLength, time : [prevState.sessionLength, prevState.time[1]]}
      });
    }
    else {
      this.setState((prevState) => {
        return {type : prevState.type, sessionLength: prevState.sessionLength, breakLength: prevState.breakLength, time : [prevState.breakLength, prevState.time[1]]}
      });
    }
  }

  // decrease time while timer is runnign
  decreaseTime() {
      let newTime = []
      

      // if seconds still left then decrease the seconds
      if(this.state.time[1] > 0) {
        newTime = [this.state.time[0], this.state.time[1] - 1];
      }
      // else decrease the minute, next time the seconds will be decreased
      else {
        newTime = [this.state.time[0] - 1, 59];
      }

      let currentDate = new Date();
      
      
      // end if time runs out, if type = session move to break and vice versa
      if(this.state.time[0] == 0 && this.state.time[1] == 0) {
        // play beep sound first
        let sound = document.getElementById('beep');
        sound.play();
        if(this.state.type == 'Session') {
          this.setState((prevState) => {
            return {type : 'Break', sessionLength: prevState.sessionLength, breakLength: prevState.breakLength, time : [prevState.breakLength, 0]}
          });
        }
        else if(this.state.type == 'Break') {
          this.setState((prevState) => {
            return {type : 'Session', sessionLength: prevState.sessionLength, breakLength: prevState.breakLength, time : [prevState.sessionLength, 0]}
          });
        }
      }
      else {      
        this.setState((prevState) => {
          return {type : prevState.type, sessionLength: prevState.sessionLength, breakLength: prevState.breakLength, time : newTime}
        });
      }
      console.log("time of clock (minutes seconds) ", this.state.time[0], this.state.time[1], "; current time in seconds: ", currentDate.getSeconds());
  }

  render() {
    return (
      <div className="App">
        <h1 id="heading">25+5 Clock</h1>
        <div id="components">
          <BreakComponent onDecrement={this.breakDecrement} onIncrement={this.breakIncrement} displayValue={this.state.breakLength}/>
          <SessionLength onDecrement={this.sessionDecrement} onIncrement={this.sessionIncrement} displayValue={this.state.sessionLength}/>
        </div>
        <Timer reset={this.resetTime} timerFunc={this.decreaseTime} type={this.state.type} time={this.state.time}/>
      </div>
    );
  }
}

class BreakComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="break">
        <h2 id="break-label">Break Length</h2>
        <button id="break-decrement" onClick={this.props.onDecrement}><FontAwesomeIcon icon="fa-solid fa-arrow-down" /></button>
        <span id="break-length">{this.props.displayValue}</span>
        <button id="break-increment" onClick={this.props.onIncrement}><FontAwesomeIcon icon="fa-solid fa-arrow-up" /></button>
      </div>
    );
  }
}

class SessionLength extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <div id="session">
        <h2 id="session-label">Session Length</h2>
        <button id="session-decrement" onClick={this.props.onDecrement}><FontAwesomeIcon icon="fa-solid fa-arrow-down" /></button>
        <span id="session-length">{this.props.displayValue}</span>
        <button id="session-increment" onClick={this.props.onIncrement}><FontAwesomeIcon icon="fa-solid fa-arrow-up" /></button>
      </div>
    );
  }
}

class TimerControls extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="controls">
        <button id="start_stop" onClick={this.props.playTimer}><FontAwesomeIcon icon="fa-solid fa-play" /></button>
        <button id="pause" onClick={this.props.pauseTimer}><FontAwesomeIcon icon="fa-solid fa-pause" /></button>
        <button id="reset" onClick={this.props.restartTimer}><FontAwesomeIcon icon="fa-solid fa-rotate" /></button>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
      </div>
    );
  }
}


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.playTimer = this.playTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.restartTimer = this.restartTimer.bind(this);
    this.state = {PlayHasBeenPressed : false, interval : ''};
  }

  playTimer() {
    if(this.state.PlayHasBeenPressed == true) {
      this.pauseTimer();
    }
    else {
      this.setState({PlayHasBeenPressed : true , interval : setInterval(() => {this.props.timerFunc()}, 1000)});
    }
  }

  pauseTimer() {
    clearInterval(this.state.interval);
    this.setState({PlayHasBeenPressed : false , interval : ''});

  }

  restartTimer() {
    // reset audio
    let audio = document.getElementById('beep');
    audio.pause();
    audio.load();
    clearInterval(this.state.interval);
    this.setState({interval : ''})
    // change prop value back to original
    this.props.reset();
  }

  render() {
    return (
      <div id="timer">
        <h2 id="timer-label">{this.props.type}</h2>
        <div id="time-left">{this.props.time[0] < 10 ? ('0' + this.props.time[0]).slice(-2) : this.props.time[0]}:{this.props.time[1] < 10 ? ('0' + this.props.time[1]).slice(-2) : this.props.time[1]}</div>
        <TimerControls playTimer={this.playTimer} pauseTimer={this.pauseTimer} restartTimer={this.restartTimer}/>
      </div>
    );
  }
}


export default App;
