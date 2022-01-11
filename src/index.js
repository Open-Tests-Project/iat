"use strict";

const template = document.createElement("template");
template.innerHTML = require("./template")();

class IAT extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.container = this._shadowRoot.querySelector("div");
        
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        this.render();
    }
    connectedCallback() {
        this.render();
    }


    render() {

    }
}

module.exports = IAT;

customElements.define("implicit-association-test", IAT);