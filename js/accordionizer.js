/**
 * accordionizer
 * v 0.0.1
 *
 * Igor Dranichnikov, Aleksey Leshko
 * Copyright 2013, MIT License
 *
 * Dependencies: jQuery(>=1.10.2)
 */

loadScript("/js/accordionizeApi.js");
loadScript("/js/accordionizeInternal.js");

function Accordionize($container, options) {
  this.$pluginContainer = $container;
  this.pluginOptions = {};
  this.slides = [];
  this.currentSlide = 0;

  this.initPlugin(options);
}

function loadScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}
