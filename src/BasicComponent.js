import BaseComponent from "./BaseComponent.js";

export default class BasicComponent extends BaseComponent {
    template() {
        return `
            <h1>Hello ${this.name}</h1>
        `
    }

    data() {
        return {
            name: "World",
        }
    }
    

    onRendered() {
        setTimeout(() => {
            this.name = "Mundo"
        }, 2000);    
    }

}

customElements.define("basic-component", BasicComponent)