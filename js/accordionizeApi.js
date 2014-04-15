Accordionize.prototype = {
  start = function() {
    this.$pluginContainer
      .children('.banner-item')
      .first()
      .trigger('mousedown');
  },

  stop = function() {
  },

  next = function() {
  },

  prev = function() {
  },

  getSlideId = function() {
  },

  geSlideCount = function() {
  },

  moveToSlide = function(id) {
  },

  removeSlide = function(id) {
  },

  addSlide = function($img) {
  },

  setOptions = function(options) {
    this.createOptions(options);
  }
}
