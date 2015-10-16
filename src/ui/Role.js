var factory = require("../factory")
var Selector = require("../dom/Selector")
var RoleEvent = require("./RoleEvent")

var Role = module.exports = factory({
  'static': {},

  describe: {
    delegate: function(event, selector){
      this.delegate(event, selector)
    },
    children: function(name, selector){
      this.children[name] = this.select(selector)
    },
    layouts: {
      phase: "instance",
      initialize: function( name, handler ){
        this.layouts[name] = handler.bind(this)
      }
    },
    events: {
      phase: "instance",
      override: false,
      executeSuper: false,
      //executionStrategy: "only-top",
      initialize: function (name, event) {
        if (!(event instanceof RoleEvent)) {
          event = new RoleEvent(event)
        }
        event.register(this.element, this)
      }
    },
    attributes: {
      phase: "prototype",
      //mergeValues: true,
      //callOnBaseClasses: false,
      override: true,
      executeSuper: false,
      //executionStrategy: "override",
      initialize: function (name, attribute) {}
    }
  },

  events: {
    change: {
      type: "change",
      target: "",
      handler: function () {}
    }
  },
  children: {
    saveBtn: new Selector()
  },
  layouts: {
    'default': function () {}
  },
  attributes: {
    open: false,
    layout: new Attr({
      type: "",
      'default': "",
      values: []
    })
  },

  constructor: function( element ){
    this.super(element)
    this.currentLayout = ""
    this.layouts = {}
    this.children = {}
    this._element = element
    this.element = element
    this.initialize()
    this.layouts("default")
  },

  accessor: {
    element: {
      get: function () {
        return this._element
      },
      set: function (element) {
        var old = this._element
        this._element = element
        this.onElement(element, old)
      }
    }
  },

  prototype: {
    onElement: function (element, old) {},
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

var Screen
var Region
var Window
var Pane
var Element = Role.extend({
  events: {
    click: function () {
      this.Super.events.click.apply(this, arguments)
    }
  }
})
