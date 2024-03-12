class AttrComponent extends HTMLElement {
    static observedAttributes = ['sx', 'name']

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    connectedCallback() {
        this.styles = this.getAttribute('sx') ?? ''
        this.name = this.getAttribute('name') ?? 'world'
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                :host {
                    display: block;
                }
            </style>
            <style id="custom-styles">
                ${this.styles}
            </style>
            <div>
                <h1>Hello ${this.name}!</h1>
                <button>Goodbye</button>
            </div>
            
        `
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'sx') {
            const customStyles = this.shadowRoot.getElementById('custom-styles')
            if (customStyles) {
                customStyles.textContent = newValue
            }
            
        }
        else if (name === 'name') {
            const h1 = this.shadowRoot.querySelector('h1')
            if (h1) {
                h1.textContent = `Hello ${newValue}!`
            }
        }
        console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`)
    }
}

customElements.define('attr-component', AttrComponent)