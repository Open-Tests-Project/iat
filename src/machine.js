"use strict";


const machine = {
    initial: 'idle',
    context: {
        block: 0,
        blocks: [

        ],
        start_button: "Start"
    },
    states: {
        idle: {
            on: {
                START: {
                    target: 'instruction',
                    action: function (context, event) {
                        return {
                            block: context.block + 1
                        };
                    }
                },
            },
        },
        instruction: {
            on: {
                NEXT: {
                    target: 'running',
                    action: function (context, event) {
                        return context;
                    }
                },
            },
        },
        running: {
            on: {
                NEXT: {
                    target: 'instruction',
                    action: function (context, event) {
                        return {
                            block: context.block + 1
                        };
                    }
                },
            },
        },
    }
};

module.exports = function (config, onTransition) {

    var currentState = {
        value: machine.initial,
        context: machine.context
    };

    function transition(state, event) {
        if (machine.states.hasOwnProperty(state.value) && machine.states[state.value].on.hasOwnProperty(event)) {
            return {
                value: machine.states[state.value].on[event].target,
                context: machine.states[state.value].on[event].action(state.context, event)
            };
        }
        return state;
    }

    function send(event) {
        currentState = transition(currentState, event);
        onTransition(currentState);
    }



    return {
        send: send
    };
};