import BaseComponent from "./BaseComponent.js";


export default class TreeView extends BaseComponent {

    template() {
        return /*html*/`
            <button> <span class="selector">\></span> </button>
            <input 
                type="checkbox" 
                id="selectAll" 
                name="selectAll" 
                ${this.checked ? "checked" : ""}
            >
            <label for="selectAll">${this.description}</label>
            <ul>
                <slot></slot>
            </ul>
        `
    }
    styles() {
        return /*css*/`
            ul {
                padding-left: 20px;
            }
            label {
                font-weight: bold;
                font-size: 1.2em;
            }
            .collapsed {
                display: none;
            }
            button {
                all: unset;
                cursor: pointer;
                font-size: 1.2em;
                margin-right: 5px;
                transition: transform 0.1s;
            }
            .buttonCollapsed {
                transform: rotate(90deg);
            }
            .selector {
                user-select: none
            }
        `
    }
    properties() {
        return {
            description: "Tree View",
            checked: {},
        }
    }
    data() {
        return {
            collapsed: false
        }
    }
    onRender() {

        this.checkbox = this.shadowRoot.getElementById("selectAll")

        this.checkbox.addEventListener("change", () => {
            this.checked = this.checkbox.checked ? "true" : ""
            if (this.parentNode.checkCheckbox) 
                this.parentNode.checkCheckbox()
            this.changeAll()
        })

        const button = this.shadowRoot.querySelector("button")
        button.addEventListener("click", () => {
            const ul = this.shadowRoot.querySelector("ul")
            const button = this.shadowRoot.querySelector("button")
            ul.classList.toggle("collapsed")
            button.classList.toggle("buttonCollapsed")
        })

        console.log("rendered", this.description)

    }

    checkCheckbox() {
        console.log(`${this.description} checked`)
        const slot = this.shadowRoot.querySelector("slot")
        this.items = slot.assignedElements()

        const checkBox = this.shadowRoot.getElementById("selectAll")
        const checkedItems = this.items.filter(item => item.checkbox.checked)
        const indeterminateItems = this.items.filter(item => item.checkbox.indeterminate)


        if (checkedItems.length === this.items.length) {
            checkBox.checked = true
            checkBox.indeterminate = false
        } else if (checkedItems.length > 0 || indeterminateItems.length > 0) {
            checkBox.checked = false
            checkBox.indeterminate = true
        } else {
            checkBox.checked = false
            checkBox.indeterminate = false
        }

        if (this.parentNode.checkCheckbox) {
            this.parentNode.checkCheckbox()   
        }
    }
    changeAll() {
        this.items.forEach(item => {
            item.checkbox.checked = this.checkbox.checked
            if (item.checkbox.indeterminate) {
                item.checkbox.indeterminate = false
            }
            if (item.changeAll) {
                item.changeAll()
            }
        })
    }

    onMutate() {
        console.log("Mutated treeView");
        const slot = this.shadowRoot.querySelector("slot")
        this.items = slot.assignedElements()
    }

    static fromObject(obj) {
        const rootNode = new TreeView();
        const constructorTemplate = "";
        for (let items in obj) {
            
        }
        rootNode.innerHTML = constructorTemplate;
    }

    /*
    {
        title: hola
        1: 2
    }
    */

    /*
        <tree-view>
            <tree-item></tree-item>
        </tree-view>
    */
}
customElements.define("tree-view", TreeView)