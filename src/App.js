import React, { Component } from 'react'
import math from 'mathjs'

import Page from './Page'
import Display from './Display'
import NumPad from './NumPad'

function addInputToEquation (state, props) {
  if (state.shouldGrabResult) {
    if (props.input.match(/[0-9]/g)) {
      return {
        equation: props.input,
        result: '0',
        shouldGrabResult: false
      }
    } else {
      return {
        equation: String(state.result).concat(props.input),
        shouldGrabResult: false
      }
    }
  } else {
    return {
      equation: state.equation.concat(props.input)
    }
  }
}

function solveEquation (state) {
  const { equation } = state
  console.log(typeof math.eval(state.equation));
  if (equation[equation.length - 1] === '=') {
    return state
  } else {
    return {
      equation: state.equation.concat('='),
      result: math.format(math.eval(state.equation), formatResult),
      shouldGrabResult: true
    }
  }
}

function deleteLastCharacterFromEquation (state) {
  return {
    equation: state.equation.slice(0,-1)
  }
}

function formatResult (value) {
  if (value > 999999999 || value < 0.000000001) {
    return math.format(value, { notation: 'exponential', precision: 2 })
  } else {
    return value
  }
}

class App extends Component {
  constructor () {
    super()
    this.state = this.initialState()
  }

  initialState = () => {
    return {
      equation: '',
      result: '0',
      shouldGrabResult: false
    }
  }

  handleInput = (input) => {
    if (input.toLowerCase() === 'c') {
      this.setState(this.initialState)
    } else if (input.match(/[0-9\-.+/()*%]/g)) {
      this.setState(addInputToEquation(this.state, {input}))
    } else if (input === '=' || input.toLowerCase() === 'enter') {
      this.setState(solveEquation(this.state))
    } else if (input.toLowerCase() === 'backspace' || input.toLowerCase() === 'del' || input.toLowerCase() === 'delete') {
      this.setState(deleteLastCharacterFromEquation(this.state))
    }
  }

  componentWillMount () {
    window.addEventListener('keydown', this.handleKeydown)
  }

  handleKeydown = (event) => {
    this.handleInput(event.key)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeydown)
  }

  render () {
    const { equation, result } = this.state
    return (
      <Page>
        <Display equation={equation} result={result} />
        <NumPad handleInput={this.handleInput}/>
      </Page>
    )
  }
}

export default App
