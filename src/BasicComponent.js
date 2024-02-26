import BaseComponent from "./BaseComponent.js";

export default class BasicComponent extends BaseComponent {
    template() {
        return `
            <h1>Count is ${this.count}</h1>
            <button id="inc">Increment</button>
        `
    }
    data() {
        return {
            count: 0
        }
    }
    properties() {
        return {
            color: "red"
        }
    }
    styles() {
        return `
            #inc {
                color: ${this.color}
            }
        `
    }    
    onRender() {
        const button = this.shadowRoot.getElementById("inc")
        button.addEventListener("click", () => {
            this.count++
        }) 
    }
}

customElements.define("basic-component", BasicComponent)