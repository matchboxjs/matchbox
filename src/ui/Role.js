var factory = require("../factory")

module.exports = factory({
  constructor: function( element ){
    this.element = element
    this.layouts = {}
    this.currentLayout = null
    this.children = {}
  },

  'static': {
    Children: function Children(){
      this.selector = ""
    }
  },

  describe: {
    events: function( event, handler ){
      this.on(event, handler, false)
    },
    delegate: function(event, selector){
      this.delegate(event, selector)
    },
    children: function(name, selector){
      this.children[name] = this.select(selector)
    },
    layouts: function( name, handler ){
      this.layouts[name] = handler.bind(this)
    }
  },

  prototype: {
    on: function( event, handler, capture ){
      this.element.addEventListener(event, handler, !!capture)
    },
    off: function( event, handler, capture ){
      this.element.removeEventListener(event, handler, !!capture)
    },
    once: function( event, handler, capture ){
      this.element.addEventListener(event, function proxy(){
        handler.apply(this, arguments)
        this.removeEventListener(event, proxy, !!capture)
      }, !!capture)
    },
    layout: function( layout ){
      this.currentLayout = layout
      this.layouts[layout]()
    },
    delegate: function( event, selector ){

    },
    select: function( selector ){

    }
  }
})