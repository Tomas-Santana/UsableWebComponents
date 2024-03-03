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
            label:hover {
                color: #333;
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
            id: {}
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
    get items() {
        const slot = this.shadowRoot.querySelector("slot")
        return slot.assignedElements()
    }


    checkCheckbox() {

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

    setCheckbox(id, state=true) {
        const item = this.findItem(id)
        console.log(item)

        if (state) {
            item.checkbox.checked = true
            item.checkbox.indeterminate = false
        } else {
            item.checkbox.checked = false
            item.checkbox.indeterminate = false
        }

        if (item.changeAll) {
            item.changeAll()
        }

        this.checkCheckbox()
    
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
        this.items
        this.checkCheckbox()
    }

    getObject(state="") {
        const slot = this.shadowRoot.querySelector("slot")
        const states = ["checked", "unchecked", "indeterminated"]

        const data = slot.assignedElements().map((item) => {
            if (item.constructor.name == "TreeView") {
                return [item.description, item.getObject(state)]
            }
            const checked = item.checked ? "Checked" : "Unchecked"
            if (state == "" || (state in states && checked.toLowerCase() == state))
                return [item.description, checked]
            
        })
        return Object.fromEntries(data);
    }

    static fromObject(obj) {
        const t = new TreeView()
        t.setAttribute("description", obj.description)
        t.setAttribute("checked", obj.checked)
        t.setAttribute("id", obj.id)
        obj.items.forEach(item => {
            if (item.items) {
                const child = TreeView.fromObject(item)
                t.appendChild(child)
            } else {
                const child = new TreeItem()
                child.setAttribute("description", item.description)
                child.setAttribute("checked", item.checked)
                child.setAttribute("id", item.id)
                t.appendChild(child)
            }
        })

        return t
    }
    findItem(id) {
        const item = this.items.find(item => item.id == id)
        if (item) {
            return item
        }
        for (let child of this.items) {
            if (child.constructor.name == "TreeView") {
                const found = child.findItem(id)
                if (found) {
                    return found
                }
            }
        }
    }
}
customElements.define("tree-view", TreeView)