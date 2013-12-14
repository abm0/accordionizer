$.getScript("/js/accordionizeSlide.js");

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

  for (var index in this.slides) {
    var slide = this.slides[index];

    var $wrapper = slide.getWrapper();
    this.$plaginContainer.append($wrapper);
  }

  this.paintOnCanvas();
}

Accordionize.prototype.convertImgToPluginSlide = function(imgArray) {
  var accordionizeSlide;
  for (var index in imgArray) {
    var $img = $(imgArray[index]);

    accordionizeSlide = new AccordionizeSlide({
      tagName: $img.prop('tagName'),
      src: $img.attr('src'),
      alt: $img.attr('alt'),
      banerItem: this.plaginOptions.banerItem
    });

    this.slides.push(accordionizeSlide);
  }
}


Accordionize.prototype.paintOnCanvas = function() {
  var $images = this.$plaginContainer.find('img');

  for (var i = 0; i < $images.length; i++) {
    var $image = $($images[i]);
    var imgWidth = $image.width();
    var imgHeight = $image.height();
    var imgName = $image.attr('alt');

    var $canvas = this.getCanvas(imgWidth, imgHeight, imgName);
    var context = $canvas.get(0).getContext('2d');
    context.drawImage($image.get(0), 0, 0);

    var imageData = context.getImageData(0, 0, imgWidth, imgHeight);
    this.grayscale(imageData);

    context.putImageData(imageData, 0, 0);
    $canvas.insertAfter($image);
  }
}

Accordionize.prototype.getCanvas = function(imgWidth, imgHeight, imgName) {
  var $canvas = $('<canvas />');
  $canvas.attr({
    width: imgWidth,
    height: imgHeight,
    'data-rel': imgName
  });
  $canvas.css({
    position: 'absolute'
  });
  return $canvas;
}

Accordionize.prototype.grayscale = function(imageData) {
  var pix = imageData.data;
  for (var i = 0; i < pix.length; i += 4) {
    var grayscale = pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;
    pix[i] = pix[i + 1] = pix[i + 2] = grayscale;
  }
}
