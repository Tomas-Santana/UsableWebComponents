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
        })

        this.render()
        this.onFirstRender()
    }

    render() {
        this.beforeUpdate()

        this.shadowRoot.innerHTML = `
            <style>
                ${this.styles()}
            </style>
            ${this.template()}
        `
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

    properties() {
        return {}
    }

    template() {
        return ""
    }

    data() {
        return {}
    }

    // Lifecycle methods

    beforeFirstRender() {

    }

    onFirstRender() {
        return
    }

    beforeUpdate() {
        return
    }
}
