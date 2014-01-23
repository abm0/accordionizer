function AccordionizeSlide(properties) {
  $.extend(this, properties);
}

AccordionizeSlide.prototype.getWrapper = function() {
  var $wrapper = $('<div />', {
    'class': this.bannerItem,
    'data-title': this.alt
  });

  $wrapper
    .append(this.createDivOverlay())
    .append(this.createLabel())
    .append(this.createImg());

  return $wrapper;
}

AccordionizeSlide.prototype.createDivOverlay = function() {
  var $overlay = $('<div />', {
    'class': this.bannerItem + '-overlay',
    html: this.alt
  });

  return $overlay;
}

AccordionizeSlide.prototype.createLabel = function() {
  var $label = $('<div />', {
    'class': this.bannerItem + '-label',
    html: this.alt
  });

  return $label;
},

AccordionizeSlide.prototype.createImg = function() {
  var $image = $('<img />', {
    'alt': this.alt,
    'src': this.src
  });

  $image = this.addCssImg($image);
  return $image;
},

AccordionizeSlide.prototype.addCssImg = function($image) {
  $image.css({
    'position': 'absolute',
    'display': 'none',
    'z-index': '1'
  });

  return $image;
}
