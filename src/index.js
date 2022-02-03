"use strict";

// https://github.com/baranan/minno-tasks/blob/master/IAT/iat7.js
// https://arxiv.org/abs/2111.02267
// https://share.streamlit.io/ycui1-mda/qualtrics_iat/qualtrics_iat/web_app.py

var template = document.createElement("template");
template.innerHTML = require("./template")();

class IAT extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.container = this._shadowRoot.querySelector("div");
        this.button = this.container.querySelector("button");
        this.button.addEventListener("click", function () {
            send("START");
        })

    }

    get options() {
        try {
            return JSON.parse(this.getAttribute("options"));
        } catch (e) {
            return {};
        }
    }
    set options(options) {
        if (typeof options === "string") {
            this.setAttribute("options", options);
        } else {
            this.setAttribute("options", JSON.stringify(options));
        }
    }

    static get observedAttributes() {
        return ["options"];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        this.render();


    }
    connectedCallback() {
        // this.render();
    }


    render() {
        var options = this.options;
        this.button.innerText = options.start_button;
    }
}

module.exports = IAT;

customElements.define("implicit-association-test", IAT);

// ========================
// const machine = {
//     initial: 'idle',
//     states: {
//         idle: {
//             on: {
//                 CLICK: 'active',
//             },
//         },
//         active: {
//             on: {
//                 CLICK: 'idle',
//             },
//         },
//     },
// };
// let currentState = machine.initial;
// function transition(state, event) {
//     // const nextState = machine.states[state].on?.[event] || state;
//     if (machine.states.hasOwnProperty(state) && machine.states[state].on.hasOwnProperty(event)) {
//         return machine.states[state].on[event];
//     }
//     return state;
// }
//
// function send(event) {
//     currentState = transition(currentState, event);
//     console.log(currentState);
// }


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
    console.log(currentState);
}

// send('START');
// send('NEXT');
// send('NEXT');
