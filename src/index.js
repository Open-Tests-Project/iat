"use strict";

// https://github.com/baranan/minno-tasks/blob/master/IAT/iat7.js
// https://arxiv.org/abs/2111.02267
// https://share.streamlit.io/ycui1-mda/qualtrics_iat/qualtrics_iat/web_app.py

var template = document.createElement("template");
template.innerHTML = require("./template")();
var Machine = require("./machine")

class IAT extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.container = this._shadowRoot.querySelector("div");
        this.instruction = this.container.querySelector(".instruction");
        this.button = this.container.querySelector("button");
        this.button.addEventListener("click", function () {
            console.log(this.state);
            var context = this.state.context || {};
            if (context.block) {
                this.machineService.send("NEXT");
            } else {
                this.machineService.send("START");
            }

        }.bind(this));
        this.state = {};
        var machineConfig = {};
        this.machineService = Machine(machineConfig, function (state) {
            this.state = state;
            this.render(state);
        }.bind(this));

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
        var context = this.state.context || {};
        var options = this.options;

        if (context.block) {
            this.button.innerText = options.continue_button;
        } else {
            this.button.innerText = options.start_button;
        }


        // if (this.state.value === "instruction") {
        //     this.instruction.innerHTML = context.blocks[context.block - 1];
        // } else {
        //     this.instruction.innerHTML = "running";
        // }

        console.log(this.state.value)


    }
}

module.exports = IAT;

customElements.define("implicit-association-test", IAT);