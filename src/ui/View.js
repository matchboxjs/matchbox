var define = require("matchbox-util/object/define")
var defaults = require("matchbox-util/object/defaults")
var factory = require("../factory")
var Event = require("./Event")
var attributes = require("../attributes")
var domAttributes = require("../dom/attributes")
var PrototypeExtension = require("./PrototypeExtension")
var InstanceExtension = require("./InstanceExtension")
var CacheExtension = require("./CacheExtension")

var View = module.exports = factory({
  'static': {},

  extensions: {
    layouts: new CacheExtension(function (prototype, name, layoutHandler) {
      return layoutHandler
    }),
    events: new InstanceExtension(function (view, name, event) {
      if (!(event instanceof Event)) {
        event = new Event(event)
      }
      if (typeof event.handler == "string") {
        event.handler = view[event.handler].bind(view)
      }
      event.register(view.element, this)
    }),
    attributes: new PrototypeExtension(function (prototype, name, attribute) {
      if (!(attribute instanceof attributes.Attribute)) {
        attribute = domAttributes.create(attribute)
      }

      attribute.name = attribute.name || name
      attribute.defineProperty(prototype, name, function (view) {
        return view.element
      })
    })
  },

  layouts: {
    'default': function () {}
  },
  events: {},
  attributes: {
    dummy: false
  },

  constructor: function View( element ){
    this.currentLayout = ""
    //this.layouts = {}
    this.children = {}
    this._element = null
    this.element = element
    View.initialize(this)
  },

  accessor: {
    element: {
      get: function () {
        return this._element
      },
      set: function (element) {
        var previous = this._element
        this._element = element
        this.onElementChange(element, previous)
      }
    }
  },

  prototype: {
    onElementChange: function (element, previous) {},
    onLayoutChange: function (layout, previous) {},
    changeLayout: function( layout ){
      if (this.currentLayout == layout) {
        return Promise.resolve()
      }

      var layoutHandler = this.layouts[layout]
      if (!layoutHandler) return Promise.reject(new Error("Missing layout handler: " + layout))

      var view = this
      var previous = view.currentLayout
      return Promise.resolve(previous).then(function () {
        return layoutHandler.call(view, previous)
      }).then(function () {
        view.currentLayout = layout
        view.onLayoutChange(layout, previous)
      })
    },
    dispatch: function (type, detail, def) {
      var definition = defaults(def, {
        detail: detail || null,
        view: window,
        bubbles: true,
        cancelable: true
      })
      return this.element.dispatchEvent(new window.CustomEvent(type, definition))
    }
  }
})
