(function($){
  $.fn.accordionize = function(options) {
    var core = {
      init: function($container, defaultOptions, externalOptions) {
        core.findAndConvertBaseNode($container);
        core.buildAccordionizerNode($container);
        core.paintOnCanvas($container);
        core.setEvents($container);
        $container.children('.banner-item').first().trigger('mousedown');
      },

      defaultOptions: $.extend({
        tabWidth: 80,
        scroll: {
          timeout: 7000,
          auto: true
        },
        classPrefix: 'accordionized',
        banerItem: 'banner-item'
      }, options),

      elements: [],

      findAndConvertBaseNode: function($container) {
        var objImages = $container.find('img');
        var imageArray = objImages.toArray();

        core.convertBaseNodeToAccordionizeNode(imageArray);
        objImages.remove();
      },

      buildAccordionizerNode: function($container) {
        var builtElements = [];
        for(var i = 0; i < core.elements.length; i++) {
          var wrapper = core.createAccordionizerNodeWrapper(core.elements[i]);
          builtElements.push(wrapper);
        }
        $container.append(builtElements);
      },

      createAccordionizerNodeWrapper: function(accordionizerNode) {
        var title = accordionizerNode.alt;
        var src = accordionizerNode.src;

        var wrapper = $('<div />',{
          'class': core.defaultOptions.banerItem,
          'data-title': title
        });

        wrapper.append(core.createAccordionizerNodeOverlay(title))
        wrapper.append(core.createAccordionizerNodeLabel(title))
        wrapper.append(core.createAccordionizerNodeImg(title, src));
        return wrapper;
      },

      createAccordionizerNodeOverlay: function(title) {
        var overlay = $('<div />', {
          'class': core.defaultOptions.banerItem + '-overlay',
          'html': title
        });
        return overlay;
      },

      createAccordionizerNodeLabel: function(title) {
        var label = $('<div />', {
          'class': core.defaultOptions.banerItem + '-label',
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

      paintOnCanvas: function($container) {
        var $images = $container.find('img');

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

      setEvents: function($container) {
        var $elements = $container.find('.banner-item'),
          slideWidth = $container.width() - (core.defaultOptions.tabWidth + 1) * (core.elements.length - 1) - 1;

        $elements.each(function(){
          $(this).on('mousedown', function(){
            var $this = $(this);
            if(!$this.is('.active')) {
              if($container.attr('data-animated') != 'true') {
                $container.attr('data-animated', 'true');
                core.wrap($container, $this.siblings('.active'));
                core.unwrap($container, $this, slideWidth);
                core.setLoop($container);
              }
            } else {
              return false;
            }
          });
        });
      },

      setLoop: function($container) {
        if(core.defaultOptions.scroll.auto) {
          clearInterval(window.interval);

          window.interval = setInterval(function() {
            var $activeElement = $container.children('.active');
            if($activeElement.is(':last-child')) {
              $container.children('.banner-item:first-child').trigger('mousedown');
            } else {
              $activeElement.next().trigger('mousedown');
            }
          }, core.defaultOptions.scroll.timeout);
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

      unwrap: function($container, $slide, slideWidth) {
        setTimeout(function() {
          core.setDataForAnimate($container, $slide, slideWidth);
          $slide.addClass('active');

          $slide.find('.banner-item-overlay').fadeOut(400);

          setTimeout(function() {
            core.fadeInElementsForUnwrap($slide);
          }, 400)
        }, 300);
      },

      wrap: function($container, $slide) {
        setTimeout(function() {
          core.setDataForAnimate($container, $slide, core.defaultOptions.tabWidth);
          $slide.removeClass('active');

          setTimeout(function(){
            core.fadeInElementsForWrap($slide);
          }, 400);
        }, 300);

        $slide.find('.banner-item-label').fadeOut(300);
      },

      setDataForAnimate: function(container, slide, width) {
        slide.animate({ 'width': width + 'px' }, 400,
          function() {
            container.attr('data-animated', 'false');
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

    core.init(this, core.defaultOptions, options);
  }

  function AccordionizeNode(accordionizeNode) {
    $.extend(this, accordionizeNode);
  }
})(jQuery);
