import BaseComponent from "./BaseComponent.js";
import TreeItem from './TreeItem.js'

export default class TreeView extends BaseComponent {

    template() {
        return /*html*/`
        <div id="main-element">
            <button class="v-expand__tv"> 
                <span class="selector">
                    &#171;

                </span>
            </button>
            <input 
            type="checkbox" 
            id="selectAll" 
            name="selectAll" 
            class="v-input__tv vi-input__tv"
            ${this.checked ? "checked" : ""}
            >
            <label for="selectAll" class="v-label__tv vi-label__tv">${this.description}</label>
        </div>
        <div class="container">
            <ul class="v-ul__tv">
                <slot></slot>
            </ul>
            <div class="line tv-line__tv"></div>
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
                user-select: none;
                transition: color ease-in-out 150ms
            }
            label:hover {
                color: #2323d2;
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
            .main-element {
                user-select: none
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
            "tree-id": {}
        }
    }
    data() {
        return {
            collapsed: false
        }
    }
    onRender() {
        this.checkbox = this.shadowRoot.getElementById("selectAll")

        const events = this.filterAttributesByPrefix("on");
        for (let event in events) { 
            const handler = this.getAttribute(`on${event}`)
            this[`on${event}`] = null
            this.checkbox.addEventListener(event, window[handler])
        }

        const styles = this.getAttribute('');
        this.addStyles(styles, false)
        this.removeAttribute('style')
        const recursiveStyle = this.getAttribute('style-recursive')
        // this.addStyles(recursiveStyle, true)


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
    setOwnCheckbox(state) {
        if (state) {
            this.checked = true
            this.indeterminate = false
        } else {
            this.checked = false
            this.indeterminate = false
        }
    }

    setCheckbox(id, state=true) {
        const item = this.findItemById(id)

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

    getObject() {
        const obj = {
            description: this.description,
            checked: this.checkbox.checked,
            indeterminate: this.checkbox.indeterminate,
            id: this["tree-id"],
            items: []
        }
        this.items.forEach(item => {
            if (item.constructor.name == "TreeView") {
                obj.items.push(item.getObject())
            } else {
                obj.items.push({
                    description: item.description,
                    checked: item.checkbox.checked,
                    id: item["tree-id"]
                })
            }
        })
        return obj
    }

    getFlatItems(state="", pushMyself=true) {
        let items = []
        if (pushMyself) {
            items.push({
                description: this.description,
                checked: this.checkbox.checked,
                id: this["tree-id"],
                indeterminate: this.checkbox.indeterminate
            })
        }
        this.items.forEach(item => {
            if (item.constructor.name == "TreeView") {
                items.push({
                    description: item.description,
                    checked: item.checkbox.checked,
                    id: item["tree-id"],
                    indeterminate: item.checkbox.indeterminate
                })
                items.push(...item.getFlatItems(state, false))
            } else {
                items.push({
                    descr0iption: item.description,
                    checked: item.checkbox.checked,
                    id: item["tree-id"],
                    indeterminate: item.checkbox.indeterminate
                })
            }
        })
        if (state === "checked") {
            items = items.filter(item => item.checked)
        }
        else if (state === "unchecked") {
            items = items.filter(item => !item.checked)
        }
        else if (state === "indeterminate") {
            items = items.filter(item => item.indeterminate)
        }

        return items
    }

    static fromObject(obj) {
        const t = new TreeView(obj.props ?? {})
        t.setAttribute("description", obj.description)
        t.setAttribute("checked", obj.checked)
        t.setAttribute("tree-id", obj.id)
        
        obj.items.forEach(item => {
            if (item.items) {
                const child = TreeView.fromObject(item)
                t.appendChild(child)
            } else {
                const child = new TreeItem(item.props ?? {})
                child.setAttribute("description", item.description)
                child.setAttribute("tree-id", item.id)
                child.setAttribute("checked", item.checked)
                t.appendChild(child)
                child.setOwnCheckbox(item.checked)
            }
        })

        return t
    }
    findItemById(id) {
        if (this.id == id) return this
        const item = this.items.find((item) => item['tree-id'] == id)
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
    findItemsByDescription(description, checkMyself=false) {
        const items = this.items.filter((item) => item.description === description)
        
        if (checkMyself && this.description === description) items.unshift(this)
        
        for (let child of this.items) {
            if (child.constructor.name == "TreeView") {
                const moreItems = child.findItemsByDescription(description)
                if (moreItems) items.push(...moreItems)
            }
        }

        return items;
    }
}
customElements.define("tree-view", TreeView)