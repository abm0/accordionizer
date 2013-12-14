Accordionize.prototype.initPlugin = function(options) {
  this.createOptions(options);
}

Accordionize.prototype.createOptions = function(options) {
  var defaultOptions = this.getDefaultOptions();

  this.plaginOptions = $.extend(defaultOptions, options)
}

Accordionize.prototype.getDefaultOptions = function() {
  var defaultOptions = {
    tabWidth: 80,
    scroll: {
      timeout: 7000,
      auto: true
    },
    banerItem: 'banner-item'
  };

  return defaultOptions;
}
