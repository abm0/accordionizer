loadScript("/js/accordionizeSlide.js");

Accordionize.prototype.initPlugin = function(options) {
  this.createOptions(options);
  this.createPluginDOMTree();
  if (this.pluginOptions.autostart) {
    this.start();
  }
};

Accordionize.prototype.createOptions = function(options) {
  var defaultOptions = this.getDefaultOptions();

  this.pluginOptions = $.extend(defaultOptions, options);
};

Accordionize.prototype.getDefaultOptions = function() {
  var defaultOptions = {
    tabWidth: 80,
    scroll: {
      timeout: 7000,
      auto: true
    },
    autostart: true,
    bannerItem: 'banner-item'
  };

  return defaultOptions;
};

Accordionize.prototype.createPluginDOMTree = function() {
  var $objImages = this.$pluginContainer.find('img');
  var imgArray = $objImages.toArray();

  this.convertImgToPluginSlide(imgArray);

  $objImages.remove();

  for (var index in this.slides) {
    var slide = this.slides[index];

    var $wrapper = slide.getWrapper();
    this.$pluginContainer.append($wrapper);
  }

  this.paintOnCanvas();
  this.setEvents();
};

Accordionize.prototype.convertImgToPluginSlide = function(imgArray) {
  for (var index in imgArray) {
    var $img = $(imgArray[index]);
    var accordionizeSlide = new AccordionizeSlide({
      tagName: $img.prop('tagName'),
      src: $img.attr('src'),
      alt: $img.attr('alt'),
      bannerItem: this.pluginOptions.bannerItem
    });

    this.slides.push(accordionizeSlide);
  }
};


Accordionize.prototype.paintOnCanvas = function() {
  var $images = this.$pluginContainer.find('img');

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
};

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
};

Accordionize.prototype.grayscale = function(imageData) {
  var pix = imageData.data;
  for (var i = 0; i < pix.length; i += 4) {
    var grayscale = pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;
    pix[i] = pix[i + 1] = pix[i + 2] = grayscale;
  }
};

Accordionize.prototype.getSlideWidth = function() {
  var slideWidth = this.$pluginContainer.width() -
    (this.pluginOptions.tabWidth + 1) * (this.slides.length - 1) - 1;

  return slideWidth;
};

Accordionize.prototype.setEvents = function() {
  var $elements = this.$pluginContainer.find('.banner-item'),
      slideWidth = this.getSlideWidth();

  var _this = this;
  for (var i = 0; i < $elements.length; i++) {
    var $element = $($elements[i]);

    $element.on('mousedown', function() {
      var $this = $(this);
      if (!$this.is('.active')) {
        if (_this.$pluginContainer.attr('data-animated') != 'true') {
          _this.$pluginContainer.attr('data-animated', 'true');
          _this.wrap(_this, $this.siblings('.active'));
          _this.unwrap(_this, $this, slideWidth);
          _this.setLoop(_this);
        } else {
          return false;
        }
      }
    });
  }
};

Accordionize.prototype.setLoop = function(_this) {
  if (this.pluginOptions.scroll.auto) {
    clearInterval(window.interval);

    window.interval = setInterval(function() {
      var $activeElement = _this.$pluginContainer.children('.active');
      if($activeElement.is(':last-child')) {
        _this.$pluginContainer
          .children('.banner-item:first-child')
          .trigger('mousedown');
      } else {
        $activeElement
          .next()
          .trigger('mousedown');
      }
    }, _this.pluginOptions.scroll.timeout);
  }
};

Accordionize.prototype.unwrap = function(_this, $slide, slideWidth) {
  setTimeout(function() {
    _this.setDataForAnimate(_this, $slide, slideWidth);
    $slide.addClass('active');

    $slide
      .find('.banner-item-overlay')
      .fadeOut(400);

    setTimeout(function() {
      _this.fadeInElementsForUnwrap($slide);
    }, 400)
  }, 300);
};

Accordionize.prototype.wrap = function(_this, $slide) {
  setTimeout(function() {
    _this.setDataForAnimate(_this, $slide, _this.pluginOptions.tabWidth);
    $slide.removeClass('active');

    setTimeout(function() {
      _this.fadeInElementsForWrap($slide);
    }, 400);
  }, 300);

  $slide
    .find('.banner-item-label')
    .fadeOut(300);
};

Accordionize.prototype.setDataForAnimate = function(_this, $slide, width) {
  $slide.animate({ 'width': width + 'px' }, 400, function() {
    _this.$pluginContainer.attr('data-animated', 'false');
  });
};

Accordionize.prototype.fadeInElementsForUnwrap = function($slide) {
  $slide
    .find('.banner-item-label')
    .fadeIn(300);
  $slide
    .find('img')
    .fadeIn(300);
};

Accordionize.prototype.fadeInElementsForWrap = function($slide) {
  $slide
    .find('img')
    .fadeOut(300);
  $slide
    .find('.banner-item-overlay')
    .fadeIn(400);
};
