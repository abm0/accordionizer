/**
 * accordionizer
 * v 0.0.1
 *
 * Igor Dranichnikov
 * Copyright 2013, MIT License
 *
 * Dependencies: jQuery(>=1.10.2)
 */

(function($) {
  $.fn.accordionize = function(externalOptions) {
    var core = {
      $plaginContainer: undefined,
      elements: [],
      plaginOptions: {},

      init: function($container) {
        core.$plaginContainer = $container

        core.createOptions();
        core.createPlaginDomTree();

        core.start();
      },

      createOptions: function() {
        var defaultOptions = core.getDefaultOptions();

        core.plaginOptions = $.extend(defaultOptions, externalOptions)
      },

      createPlaginDomTree: function() {
        core.findAndConvertBaseNode();
        core.buildAccordionizerNode();
        core.paintOnCanvas();
        core.setEvents();
      },

      start: function() {
        core.$plaginContainer.children('.banner-item').first().trigger('mousedown');
      },

      getDefaultOptions: function() {
        var defaultOptions = {
          tabWidth: 80,
          scroll: {
            timeout: 7000,
            auto: true
          },
          banerItem: 'banner-item'
        };

        return defaultOptions;
      },

      findAndConvertBaseNode: function() {
        var objImages = core.$plaginContainer.find('img');
        var imageArray = objImages.toArray();

        core.convertBaseNodeToAccordionizeNode(imageArray);
        objImages.remove();
      },

      buildAccordionizerNode: function() {
        var builtElements = [];
        core.elements.forEach(function(element) {
          var wrapper = core.createAccordionizerNodeWrapper(element);
          builtElements.push(wrapper);
        });

        core.$plaginContainer.append(builtElements);
      },

      createAccordionizerNodeWrapper: function(accordionizerNode) {
        var title = accordionizerNode.alt;
        var src = accordionizerNode.src;

        var wrapper = $('<div />', {
          'class': core.plaginOptions.banerItem,
          'data-title': title
        });

        wrapper.append(core.createAccordionizerNodeOverlay(title))
        wrapper.append(core.createAccordionizerNodeLabel(title))
        wrapper.append(core.createAccordionizerNodeImg(title, src));
        return wrapper;
      },

      createAccordionizerNodeOverlay: function(title) {
        var overlay = $('<div />', {
          'class': core.plaginOptions.banerItem + '-overlay',
          'html': title
        });
        return overlay;
      },

      createAccordionizerNodeLabel: function(title) {
        var label = $('<div />', {
          'class': core.plaginOptions.banerItem + '-label',
          'html': title
        });
        return label;
      },

      createAccordionizerNodeImg: function(title, src) {
        var image = $('<img />', {
          'alt': title,
          'src': src
        });

        image = core.addCssAccordionizerNodeImg(image);
        return image;
      },

      addCssAccordionizerNodeImg: function(image) {
        image.css({
          'position': 'absolute',
          'display': 'none',
          'z-index': '1'
        });

        return image;
      },

      paintOnCanvas: function() {
        var $images = core.$plaginContainer.find('img');

        $images.each(function(){
          var $image = $(this);
          var imgWidth = $image.width();
          var imgHeight = $image.height();
          var imgName = $image.attr('alt');

          var $canvas = core.getCanvas(imgWidth, imgHeight, imgName);

          var context = $canvas.get(0).getContext('2d');

          context.drawImage($image.get(0), 0, 0);

          var imageData = context.getImageData(0, 0, imgWidth, imgHeight);

          core.grayscale(imageData);

          context.putImageData(imageData, 0, 0);
          $canvas.insertAfter($image);
        });
      },

      getCanvas: function(imgWidth, imgHeight, imgName) {
        var canvas = $('<canvas />');
        canvas.attr({
          'width': imgWidth,
          'height': imgHeight,
          'data-rel': imgName
        });
        canvas.css({
          position: 'absolute'
        });
        return canvas;
      },

      grayscale: function(imageData) {
        var pix = imageData.data;
        for (var i = 0; i < pix.length; i += 4) {
          var grayscale = pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;
          pix[i] = pix[i + 1] = pix[i + 2] = grayscale;
        }
      },

      setEvents: function() {
        var $elements = core.$plaginContainer.find('.banner-item'),
          slideWidth = core.$plaginContainer.width() - (core.plaginOptions.tabWidth + 1) * (core.elements.length - 1) - 1;

        $elements.each(function(){
          $(this).on('mousedown', function(){
            var $this = $(this);
            if(!$this.is('.active')) {
              if(core.$plaginContainer.attr('data-animated') != 'true') {
                core.$plaginContainer.attr('data-animated', 'true');
                core.wrap($this.siblings('.active'));
                core.unwrap($this, slideWidth);
                core.setLoop();
              }
            } else {
              return false;
            }
          });
        });
      },

      setLoop: function() {
        if(core.plaginOptions.scroll.auto) {
          clearInterval(window.interval);

          window.interval = setInterval(function() {
            var $activeElement = core.$plaginContainer.children('.active');
            if($activeElement.is(':last-child')) {
              core.$plaginContainer.children('.banner-item:first-child').trigger('mousedown');
            } else {
              $activeElement.next().trigger('mousedown');
            }
          }, core.plaginOptions.scroll.timeout);
        }
      },

      convertBaseNodeToAccordionizeNode: function(baseNodeArray) {
        for (var index in baseNodeArray) {
          var node = $(baseNodeArray[index]);

          var accordionizeNode = new AccordionizeNode({tagName: node.prop('tagName'),
            src: node.attr('src'),
            alt: node.attr('alt')});
          core.elements.push(accordionizeNode);
        }
      },

      unwrap: function($slide, slideWidth) {
        setTimeout(function() {
          core.setDataForAnimate($slide, slideWidth);
          $slide.addClass('active');

          $slide.find('.banner-item-overlay').fadeOut(400);

          setTimeout(function() {
            core.fadeInElementsForUnwrap($slide);
          }, 400)
        }, 300);
      },

      wrap: function($slide) {
        setTimeout(function() {
          core.setDataForAnimate($slide, core.plaginOptions.tabWidth);
          $slide.removeClass('active');

          setTimeout(function(){
            core.fadeInElementsForWrap($slide);
          }, 400);
        }, 300);

        $slide.find('.banner-item-label').fadeOut(300);
      },

      setDataForAnimate: function(slide, width) {
        slide.animate({ 'width': width + 'px' }, 400,
          function() {
            core.$plaginContainer.attr('data-animated', 'false');
          }
        );
      },

      fadeInElementsForUnwrap: function(slide) {
        slide.find('.banner-item-label').fadeIn(300);
        slide.find('img').fadeIn(300);
      },

      fadeInElementsForWrap: function(slide) {
        slide.find('img').fadeOut(300);
        slide.find('.banner-item-overlay').fadeIn(400);
      }
    }

    core.init(this);
  }

  function AccordionizeNode(accordionizeNode) {
    $.extend(this, accordionizeNode);
  }
})(jQuery);
