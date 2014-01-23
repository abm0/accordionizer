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
      'alt': this.alt,
      'src': this.src
    });

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
  }
};