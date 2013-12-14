/**
 * accordionizer
 * v 0.0.1
 *
 * Igor Dranichnikov, Aleksey Leshko
 * Copyright 2013, MIT License
 *
 * Dependencies: jQuery(>=1.10.2)
 */

$.getScript("/js/accordionizeApi.js");
$.getScript("/js/accordionizeInternal.js");

function Accordionize($container, options) {
  this.$plaginContainer = $container;
  this.plaginOptions = {};
  this.slides = [];
  this.currentSlide = 0;

  this.initPlugin(options);
}
