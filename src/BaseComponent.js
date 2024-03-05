export default class BaseComponent extends HTMLElement {
    constructor(props={}) {
        super()
        this.state = {}
        this.attachShadow({mode: 'open'})
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
        this.props = props
    }

    addTo(node) {
        node.appendChild(this);
    }
    
    connectedCallback() {
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

        // handle constructor props
        if (this.props.styles) {
            this.addStyles(this.props.styles.content, this.props.styles.recursive)
        }
        if (this.props.styles?.removeDefault) {
            this.styles = () => ""
        }
        if (this.props.events) {
            Object.keys(this.props.events).forEach(event => {
                const callback = this.props.events[event].callback
                const selector = this.props.events[event].selector ?? ""
                this.addListener(event, callback, selector)
            })
        }



        this.render(true)
    }
    render(firstRender = false) {
        this.beforeRender()
        this.shadowRoot.innerHTML = `
            <style>
                ${this.styles()}
                ${this.customStyles}
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

    customStyles = ``

    addStyles(styles, recursive=true) {
        // these styles will be added on the next render
        this.customStyles += "\n" + styles

        // in the meantime, we add a style element to the shadow root
        const style = document.createElement("style")
        style.innerHTML = styles
        this.shadowRoot.appendChild(style)


        if (!recursive) return

        const children = this.children ? [...this.children] : []

        children.forEach(child => {
            child.addStyles(styles)
        })
    }

    addListener(event, callback, selector="") {
        const element = selector ? this.shadowRoot.querySelector(selector) : this

        element.addEventListener(event, callback)
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
