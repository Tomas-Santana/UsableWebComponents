import BaseComponent from "./BaseComponent.js";

export default class TreeItem extends BaseComponent {
    template() {
        return /*html*/`
            <li>
                <input 
                    type="checkbox" 
                    id="tree-item" 
                    name="checkbox" 
                    ${this.checked ? "checked" : ""}
                />
                <label for="checkbox">${this.description}</label>
            </li>
        `
    }
    properties() {
        return {
            description: {
                reactive: true
            },
            checked: {
                reactive: false
            }
        }
    }
    styles() {
        return /*css*/`
            li {
                list-style-type: none;
            }
        `
    }
    onFirstRender() {
        this.type = "tree-item"
    }
    onRender() {
        this.checkbox = this.shadowRoot.querySelector("input");

        this.checkbox.addEventListener("change", () => {
            this.checked = this.checkbox.checked ? "true" : ""
            this.parentNode.checkCheckbox()
        })
    }
}

customElements.define("tree-item", TreeItem)
