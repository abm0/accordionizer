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
};

AccordionizeSlide.prototype.createDivOverlay = function() {
  return $('<div />', {
    'class': this.bannerItem + '-overlay',
    html: this.alt
  });
};

AccordionizeSlide.prototype.createLabel = function() {
  return $('<div />', {
    'class': this.bannerItem + '-label',
    html: this.alt
  });
};

AccordionizeSlide.prototype.createImg = function() {
  var $image = $('<img />', {
    'alt': this.alt,
    'src': this.src
  });

  $image = this.addCssImg($image);
  return $image;
};

AccordionizeSlide.prototype.addCssImg = function($image) {
  $image.css({
    'position': 'absolute',
    'display': 'none',
    'z-index': '1'
  });

  return $image;
};
