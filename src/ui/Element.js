var defaults = require("matchbox-util/object/defaults")
var View = require("./View")
var Selector = require("../dom/Selector")
var Fragment = require("../dom/Fragment")
var InstanceExtension = require("./InstanceExtension")
var CacheExtension = require("./CacheExtension")

var Element = module.exports = View.extend({
  extensions: {
    children: new InstanceExtension(function(element, name, selector){
      selector = new Selector(defaults(selector, {
        attribute: "data-element",
        operator: "~",
        value: name
      })).prefix(element.name)
      selector.element = element.element
      element.children[name] = selector
    }),
    fragments: new CacheExtension(function (prototype, name, fragment) {
      if (!(fragment instanceof Fragment)) {
        return new Fragment(fragment)
      }
      return fragment
    })
  },
  children: {},
  changeLayout: {},
  events: {},
  attributes: {},
  fragments: {},
  constructor: function Element(element) {
    View.apply(this, arguments)
    Element.initialize(this)
  },
  prototype: {
    name: ""
  }
})
