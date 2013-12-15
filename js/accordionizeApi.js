Accordionize.prototype.start = function() {
  if (this.plaginOptions.autostart) {
    this.$plaginContainer
      .children('.banner-item')
      .first()
      .trigger('mousedown');
  }
}

Accordionize.prototype.stop = function() {
}

Accordionize.prototype.next = function() {
}

Accordionize.prototype.prev = function() {
}

Accordionize.prototype.getSlideId = function() {
}

Accordionize.prototype.geSlideCount = function() {
}

Accordionize.prototype.moveToSlide = function(id) {
}

Accordionize.prototype.removeSlide = function(id) {
}

Accordionize.prototype.addSlide = function($img) {
}

Accordionize.prototype.setOptions = function(options) {
  this.createOptions(options);
}
