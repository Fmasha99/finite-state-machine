class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      this.config = config;
      this.history = [config['initial']];
      this.activeStateIndex = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.history[this.activeStateIndex];
    }

    /**
    * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (this.config.states.hasOwnProperty(state)) {
        if (this.history[this.activeStateIndex + 1] != undefined) {
          this.history.pop();
          this.activeStateIndex--;
        }
        this.history.push(state);
        this.activeStateIndex++;
      } else {
        throw new Error('Incorrect state');
      }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      var resultState;
      var currentState = this.getState();
      var transitionObjects = this.config.states[currentState].transitions;
      var transitions = Object.keys(transitionObjects);
      for (var i = 0; i < transitions.length; i++) {
          var transitionKey = transitions[i];
          if (transitionKey == event) {
            resultState = transitionObjects[transitionKey];
          }
      }
      if (resultState != null && this.getState() != resultState) {
          if(this.history[this.activeStateIndex + 1] != resultState) {
            this.history.push(resultState);
          }
          this.activeStateIndex++;
      } else {
        throw new Error('Event doesn\'t exist');
      }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.activeStateIndex = 0;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      var states = this.config.states;
      if (event == undefined) {
        return Object.keys(states);
      } else {
        var result = [];
        var allStates = Object.keys(states);
        for (var i = 0; i < allStates.length; i++) {
          var state = allStates[i];
          var transitions = Object.keys(states[state].transitions);
          if (transitions.indexOf(event) != -1) {
            result.push(state);
          }
        }
        return result;
      }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (this.getState() == this.config['initial']) {
        return false;
      } else {
        this.activeStateIndex--;
        return true;
      }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if(this.history.length < 2) {
        return false;
      } else {
        if (this.activeStateIndex > this.history.length - 2) {
          return false;
        }
        this.activeStateIndex++;
        return true;
      }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.history = [this.config['initial']];
      this.activeStateIndex = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/