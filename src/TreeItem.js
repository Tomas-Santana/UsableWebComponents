import BaseComponent from "./BaseComponent.js";

export default class TreeItem extends BaseComponent {
    template() {
        return /*html*/`
            <li class="i-li__tv">
                <input 
                    type="checkbox" 
                    id="tree-item" 
                    name="checkbox"
                    class="i-input__tv vi-input__tv" 
                    ${this.checked ? "checked" : ""}
                />
                <label for="checkbox" class="i-label__tv vi-label__tv">${this.description}</label>
            </li>
        `
    }
    properties() {
        return {
            description: {
                reactive: true
            },
            "checked": {
                reactive: false
            },
            "tree-id": {reactive: false}
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
    setOwnCheckbox(state) {
        if (this.checkbox) {
            this.checkbox.checked = state
        }
    }
    connectedCallback() {
        super.connectedCallback()

        this.customStyles
    }
}

customElements.define("tree-item", TreeItem)
