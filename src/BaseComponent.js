export default class BaseComponent extends HTMLElement {
    constructor() {
        super()
        this.state = {}
        this.onConstructed();
        this.mutationListeners = ["childList"]
        this.mutationObserver = new MutationObserver((mutationList, observer) => {
            for (let mutation in mutationList) {
            if (mutation in this.mutationListeners)
                this.render();
                this.onMutate();
            }
        })

        this.mutationObserver.observe(this, { childList:true })
    }
    
    connectedCallback() {
        this.attachShadow({mode: 'open'})
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
                    // set state only if the property is reactive
                    if (this.properties()[key].reactive) {
                        this.setState({[key]: value})
                    }

                }

            })
            const defaulValue = this.getAttribute(key) || this.properties()[key]
            this.setState({[key]: defaulValue}, false)
        })

        this.render(true)
    }
    render(firstRender = false) {
        this.beforeRender()
        this.shadowRoot.innerHTML = `
            <style>
                ${this.styles()}
            </style>
            ${this.template()}
        `
        if (firstRender) {
            this.onFirstRender()
        }
        this.onRender()
    }

    setState(newState, reRender=true) {
        this.state = {
            ...this.state,
            ...newState
        }

        if (reRender) {
            this.render()
        }
    }

    styles() {
        return ``
    }

    /**
     * Properties of the custom component (custom attributes for the HTML tag)
     */
    properties() {
        return {
        }
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
        return {
        }
    }

    // Lifecycle methods
    /**
     * Called after constructor
     */
    onConstructed() {
        return
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

    addToBody() {
        document.body.appendChild(this)
    }

    onMutate() {
        return
    }
}
