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
        this.mainElement = this.shadowRoot
        return this;
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

        this.render(true)

        const customStyles = this.getAttribute("sx")
        if (customStyles) {
            this.addStyles(customStyles, false)
        } 
              
        if (this.props.events) {
            Object.keys(this.props.events).forEach(event => {
                const callback = this.props.events[event].callback
                const selector = this.props.events[event].selector ?? ""
                this.eventListeners[event] = {
                    callback,
                    selector
                }
            })
        }
    }
    render(firstRender = false) {
        this.beforeRender()
        const customStyles = this.getAttribute("sx")
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

        this.#addHTMLDeclaredEvents()
        this.addListeners()
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
    #addHTMLDeclaredEvents() {
        const events = this.filterAttributesByPrefix("on");
        for (let event in events) { 
            const handler = this.getAttribute(`on${event}`)
            this.removeAttribute(`on${event}`)
            this.mainElement = this.mainElement || this.shadowRoot
            this.mainElement.addEventListener(event, window[handler])
        }
    }

    styles() {
        return ``
    }

    customStyles = ``

    eventListeners = {}

    addStyles(styles, recursive=true) {
        // these styles will be added on the next render

        if (this.customStyles.includes(styles)) return
        
        this.customStyles += "\n" + styles

        // in the meantime, we add a style element to the shadow root
        const style = document.createElement("style")
        style.innerHTML = styles
        this.shadowRoot.appendChild(style)


        if (!recursive) return


        const slot = this.shadowRoot.querySelector("slot")
        if (!slot) return
        const children = [...slot.assignedElements()] 
        console.log(children)

        children.forEach((child) => {
            if (child.addStyles)
                child.addStyles(styles, recursive)
        })
    }

    addListeners() {
        for (let event in this.eventListeners) {
            const {callback, selector} = this.eventListeners[event]
            if (selector) {
                this.shadowRoot.querySelector(selector).addEventListener(event, callback)
            } else {
                this.shadowRoot.addEventListener(event, callback)
            }
        }
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

    onMutate() {
        return
    }

    filterAttributesByPrefix(prefix) {
        return Object.fromEntries(
            this.getAttributeNames()
            .filter((element) => element.startsWith(prefix))
            .map((name) => [name.slice(prefix.length), this.getAttribute(name)])
        )
    }
}
