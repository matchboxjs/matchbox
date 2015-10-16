module.exports = Selector

Selector.DEFAULT_NEST_SEPARATOR = ":"

function Selector (attribute, value, operator, extra, element) {
  this.attribute = attribute
  this.value = value || null
  this.operator = operator || "="
  this.extra = extra || null

  this.element = element || null
}

Selector.prototype.clone = function () {
  return new Selector(this.attribute, this.value, this.operator, this.extra, this.element)
}

Selector.prototype.combine = function (selector) {
  var s = this.clone()
  s.extra += selector.toString()
  return s
}

Selector.prototype.equal = function (value) {
  var s = this.clone()
  s.operator = "="
  s.value = value
  return s
}

Selector.prototype.contains = function (value) {
  var s = this.clone()
  s.operator = "~"
  s.value = value
  return s
}

Selector.prototype.nest = function (sub, separator) {
  var s = this.clone()
  s.value += (separator||Selector.DEFAULT_NEST_SEPARATOR) + sub
  return s
}

Selector.prototype.from = function (element) {
  var s = this.clone()
  s.element = element
  return s
}

Selector.prototype.select = function (element, transform) {
  var result = element.querySelector(this.toString())
  return transform ? transform(result) : result
}

Selector.prototype.selectAll = function (element, transform) {
  var result = element.querySelectorAll(this.toString())
  return transform ? transform(result) : result
}

Selector.prototype.node = function (transform) {
  return this.select(this.element, transform)
}

Selector.prototype.nodeList = function (transform) {
  return this.select(this.element, transform)
}

Selector.prototype.matches = function (target, root) {
  if (root) {
    return root === target || root.contains(target)
  }
  return target.matches(this.toString())
}

Selector.prototype.toString = function () {
  var value = this.value && '"' + (this.value == true ? "" : this.value) + '"'
  var operator = value ? this.operator || "=" : ""
  var extra = this.extra || ""
  return "[" + this.attribute + operator + value + "]" + extra
}
