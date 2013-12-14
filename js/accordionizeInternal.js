Accordionize.prototype.initPlugin = function(options) {
  this.createOptions(options);
  this.createPlaginDomTree();
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

Accordionize.prototype.createPlaginDomTree = function() {
  var $objImages = this.$plaginContainer.find('img');
  var imgArray = $objImages.toArray();

  this.convertImgToPluginSlide(imgArray);

  $objImages.remove();
}

Accordionize.prototype.convertImgToPluginSlide = function(imgArray) {
  var accordionizeSlide;
  for (var index in imgArray) {
    var $img = $(imgArray[index]);

    accordionizeSlide = new AccordionizeSlide({
      tagName: $img.prop('tagName'),
      src: $img.attr('src'),
      alt: $img.attr('alt')
    });

    this.slides.push(accordionizeSlide);
  }
}

function AccordionizeSlide(properties) {
  $.extend(this, properties);
}
