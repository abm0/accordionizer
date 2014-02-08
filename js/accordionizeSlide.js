AccordionizeSlide = function (properties) {
  $.extend(this, properties);
};

AccordionizeSlide.prototype = {

  getWrapper: function() {
    return $('<div />', {
      'class': this.bannerItem,
      'data-title': this.alt
    })
      .append(this.createDivOverlay())
      .append(this.createLabel())
      .append(this.createImg());
  },

  createDivOverlay: function() {
    return $('<div />', {
      'class': this.bannerItem + '-overlay',
      html: this.alt
    });
  },

  createLabel: function() {
    return $('<div />', {
      'class': this.bannerItem + '-label',
      html: this.alt
    });
  },

  createImg: function() {
    var $image = $('<img />', {
        'alt': this.alt
      }),
      slide = this;

    $image.load(function () {
      slide.initCanvas($image);
    });

    $image.attr('src', this.src);

    $image = this.addCssImg($image);
    return $image;
  },

  addCssImg: function($image) {
    $image.css({
      'position': 'absolute',
      'display': 'none',
      'z-index': '1'
    });

    return $image;
  },

  initCanvas: function ($image) {
    var imgWidth = $image.width(),
      imgHeight = $image.height(),
      imgName = $image.attr('alt'),
      $canvas = $('<canvas />');

    $canvas.attr({
      width: imgWidth,
      height: imgHeight,
      'data-rel': imgName
    });
    $canvas.css({
      position: 'absolute'
    });

    var context = $canvas.get(0).getContext('2d');

    context.drawImage($image.get(0), 0, 0);

    var imageData = context.getImageData(0, 0, imgWidth, imgHeight);
    this.parent.grayscale(imageData);

    context.putImageData(imageData, 0, 0);
    $canvas.insertAfter($image);
  }
};