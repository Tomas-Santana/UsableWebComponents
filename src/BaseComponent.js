export default class BaseComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
        this.state = {}
    }

    async connectedCallback() {
        Object.keys(this.data()).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return this.state[key]
                },
                set(value) {
                    this.setState({[key]: value})
                }
            })
            this.setState({[key]: this.data()[key]}, false)
        })

        Object.keys(this.properties()).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return this.getAttribute(key)
                },
                set(value) {
                    this.setAttribute(key, value)
                    this.setState({[key]: value})
                }
            })
            const defaulValue = this.getAttribute(key) || this.properties()[key]
            this.setState({[key]: defaulValue}, false)
        })

        this.render()
        this.onFirstRender()
    }
    render() {
        this.beforeRender()
        this.shadowRoot.innerHTML = `
            <style>
                ${this.styles()}
            </style>
            ${this.template()}
        `
        this.onRender()
    }

    setState(newState, reRender = true) {
        this.state = {
            ...this.state,
            ...newState
        }

        if (reRender) {
            this.render()
        }
    }

    styles() {
        return ""
    }

    /**
     * Properties of the custom component (custom attributes for the HTML tag)
     */
    properties() {
        return {}
    }

    /**
     * Template of the custom component
     */
    template() {
        return ""
    }

    /**
     * 
     * Reactive properties of the custom component 
     */
    data() {
        return {}
    }

    // Lifecycle methods
    /**
     * Called before the first render of the component
     */
    beforeFirstRender() {

    }

    /**
     * Called after the first render of the component
     */ 
    onFirstRender() {
        return
    }
    /**
     * 
     * Called before the component is updated
     */
    beforeRender() {
        return
    }

    /**
     * Called after the component is updated
     */
    onRender() {
        return
    }
}
