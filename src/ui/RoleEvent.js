var inherit = require("../factory/inherit")
var EventDescription = require("./EventDescription")

inherit(RoleEvent, EventDescription)

function RoleEvent () {
  EventDescription.apply(this, arguments)
  if (this.target) {

  }
}

RoleEvent.prototype.transform = function (role, selector, delegateElement) {

}
