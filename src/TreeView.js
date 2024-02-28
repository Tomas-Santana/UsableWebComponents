import BaseComponent from "./BaseComponent.js";
import TreeItem from './TreeItem.js'

export default class TreeView extends BaseComponent {

    template() {
        return /*html*/`
        <button> 
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
            <ul>
                <slot></slot>
            </ul>
            <div class="line"></div>
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
            @keyframes slideaway {
                from { display: block; }
                to { transform: translateY(-40px); opacity: 0;}
            }
            @keyframes slideIn {
                from { transform: translateY(-40px); opacity: 0;}
                to { display: block; }
            }
            .collapsed {
                animation: slideaway 200ms;
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

                animation: slideIn 200ms;
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
            const line = this.shadowRoot.querySelector(".line")
            ul.classList.toggle("collapsed")
            button.classList.toggle("buttonCollapsed")
            line.classList.toggle("collapsed")
        })

        // console.log("rendered", this.description)

    }

    checkCheckbox() {
        // console.log(`${this.description} checked`)
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
        // this.items.forEach(item => {
        //     console.log(item.description)
        // })
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