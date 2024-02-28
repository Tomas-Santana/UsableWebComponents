import BaseComponent from "./BaseComponent.js";
import TreeItem from './TreeItem.js'

export default class TreeView extends BaseComponent {

    template() {
        return /*html*/`
        <button
            class="${this.collapsed ? "buttonCollapsed" : ""}"
        > 
            <span class="selector">
                &#171;

            </span>
        </button>
        <input 
        type="checkbox" 
        id="selectAll" 
        name="selectAll" 
        ${this.checked ? "checked" : ""}
        >
        <label for="selectAll">${this.description}</label>
        <div class="container">
            <ul class="${this.collapsed ? "collapsed" : ""}" >
                <slot></slot>
            </ul>
            <div 
                class="line ${this.collapsed ? "collapsed" : ""}"
            >
            </div>
        </div>
        `
    }
    styles() {
        return /*css*/`
            ul {
                padding-left: 40px;
                margin: 0px;
                animation: slideIn 200ms;
            }
            label {
                font-weight: bold;
                margin: 5px 0px;
            }
            label:hover {
                color: #333;
            }
            .collapsed {
                display: none;
            }
            button {
                all: unset;
                cursor: pointer;
                font-size: 1.2em;
                margin: 0px 5px;
                transition: transform 0.1s;
                transform: rotate(270deg);
            }
            .buttonCollapsed {
                transform: rotate(180deg);
            }
            .selector {
                user-select: none
            }
            .container {
                position: relative;
                margin: 10px 0px;
            }
            .line {
                position: absolute;
                top: 0px;
                left: 10px;
                width: 2px;
                height: 100%;
                background-color: #aaa;

            }
        `
    }
    properties() {
        return {
            description: {
                reactive: true
            },
            checked: {},
        }
    }
    data() {
        return {
            collapsed: false,
            checkboxState: "false", 
        }
    }
    onRender() {
        this.checkbox = this.shadowRoot.getElementById("selectAll")

        this.items = this.shadowRoot.querySelector("slot").assignedElements()
        
        this.checkbox.addEventListener("change", () => {
                this.checked = this.checkbox.checked ? "true" : ""
                if (this.parentNode.checkCheckbox) 
                this.parentNode.checkCheckbox()
            this.changeAll()
        })

        const button = this.shadowRoot.querySelector("button")
        button.addEventListener("click", () => {
            this.collapsed = !this.collapsed
        })

        if (this.checkboxState === "true") {
            this.checkbox.checked = true
            this.checkbox.indeterminate = false

        }
        else if (this.checkboxState === "indeterminate") {
            this.checkbox.indeterminate = true
            this.checkbox.checked = false
        }
        else {
            this.checkbox.checked = false
            this.checkbox.indeterminate = false
        }

    }

    checkCheckbox() {
        const slot = this.shadowRoot.querySelector("slot")
        this.items = slot.assignedElements()

        const checkBox = this.shadowRoot.getElementById("selectAll")
        const checkedItems = this.items.filter(item => item.checkbox?.checked)
        const indeterminateItems = this.items.filter(item => item.checkbox?.indeterminate)


        if (checkedItems.length === this.items.length) {
            this.checkboxState = "true"
        } else if (checkedItems.length > 0 || indeterminateItems.length > 0) {
            this.checkboxState = "indeterminate"
        } else {
            this.checkboxState = "false"
        }

        if (this.parentNode.checkCheckbox) {
            this.parentNode.checkCheckbox()   
        }
    }
    changeAll() {
        const slot = this.shadowRoot.querySelector("slot")
        this.items = slot.assignedElements()
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
        this.items = this.shadowRoot.querySelector("slot").assignedElements()
    }

    addItem(name) {
        const child = new TreeItem();
        child.setAttribute("description", name)
        child.setAttribute("checked", "")
        
        this.appendChild(child)
    }

    static fromObject(name, obj) {
         const rootNode = new TreeView();
         rootNode.setAttribute("description", name)
         rootNode.setAttribute("checked", "")

         for (let item in obj) {
            if (typeof obj[item] == "object" && obj[item]) {
                rootNode.appendChild(TreeView.fromObject(item, obj[item]))
                continue;
            }
            rootNode.addItem(item)
        }
        return rootNode
        
    }

    /*
    {
        1: null,
        2: {
            3: null,
            4: {
                
            }
        }
    }
    */

    /*
        <tree-view>
            <tree-item></tree-item>
        </tree-view>
    */
}
customElements.define("tree-view", TreeView)