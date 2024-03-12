import BaseComponent from "./BaseComponent.js";

export default class TreeItem extends BaseComponent {
    constructor(props = {}) {
        super(props)

        this.setAttribute("description", props.description ?? "Default")
        this.setAttribute("tree-id", props["tree-id"] ?? (100 + Math.floor(Math.random() * 1000)) )
        
    
    }

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
        this.mainElement = this.shadowRoot.querySelector("li")


        if (this.checked) {
            this.checkbox.checked = true
        }
        else {
            this.checkbox.checked = false
        }

        this.checkbox.addEventListener("change", () => {
            this.checked = this.checkbox.checked ? "true" : ""
            this.parentNode.checkCheckbox()
        })

        const sibling = this.parentElement.firstChild

        if (sibling.shadowRoot){
            const siblingStyleSheetContent = sibling.shadowRoot.querySelector("style").innerHTML
            this.addStyles(siblingStyleSheetContent)
        }


    }
    setOwnCheckbox(state) {
        if (this.checkbox) {
            this.checkbox.checked = state
            this.checked = state ? "true": ""
        }
    }
    connectedCallback() {
        super.connectedCallback()

        this.customStyles
    }
}

customElements.define("tree-item", TreeItem)
