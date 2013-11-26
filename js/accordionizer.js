(function($){
  $.fn.accordionize = function(options) {
    var core = {
      defaultOptions: $.extend({
        tabWidth: 80,
        scroll: {
          timeout: 7000,
          auto: true
        },
        classPrefix: 'accordionized'
      }, options),

      data: {
        containerClassName: '',
        instanceClassName: ''
      },

      parsedDOM: {
        elements: {
          tagName: [],
          src: [],
          alt: [],
          count: 0
        }
      },

      writeContainerNamesData: function($container){
        core.data.containerClassName = core.getContainerClassName($container);
        core.data.instanceClassName = core.getInstanceClassName($container);
      },

      grayscale: {
        createCanvas: function($container) {
          var $images = $container.find('img');

          $images.each(function(){
            var $image = $(this),
              imgWidth = $image.width(),
              imgHeight = $image.height(),
              imgName = $image.attr('alt'),
              $canvas = $('<canvas />')
                .attr({
                  'width': imgWidth,
                  'height': imgHeight,
                  'data-rel': imgName
                })
                .css({
                  position: 'absolute'
                });

            var context = $canvas.get(0).getContext('2d');

            context.drawImage($image.get(0), 0, 0);

            var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
              pix = imageData.data;

            for (var i = 0; i < pix.length; i += 4) {
              var grayscale = pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;
              pix[i] = grayscale;
              pix[i + 1] = grayscale;
              pix[i + 2] = grayscale;
            }

            context.putImageData(imageData, 0, 0);
            $canvas.insertAfter($image);
          });
        }
      },

      getContainerClassName: function($container) {
        return $container.attr('class');
      },

      buildInstanceClassName: function($container) {
        var className = {
            prefix: core.defaultOptions.classPrefix,
            id: core.generateInstanceId(),
            postfix: '__' + core.getContainerClassName($container)
          }

        return className.prefix + className.id + className.postfix;
      },

      getInstanceClassName: function($container) {
        return core.buildInstanceClassName($container);
      },

      generateInstanceId: function() {
        return Math.floor(Math.random() * (99999 - 0 + 1)) + 0;
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

      init: function($container, defaultOptions, externalOptions) {
        core.writeContainerNamesData($container);
        core.parse($container);
        core.buildDOM($container);
        core.grayscale.createCanvas($container);
        core.setEvents($container);
        $container.children('.banner-item').first().trigger('mousedown');
      },

      parse: function($container) {
        var images = $container.find('img');

        for (var i = 0; i < images.length; i++) {
          var $element = $(images[i]),
            tagName = $element.prop('tagName'),
            src = $element.attr('src'),
            alt = $element.attr('alt');

          core.parsedDOM.elements.tagName.push(tagName);
          core.parsedDOM.elements.src.push(src);
          core.parsedDOM.elements.alt.push(alt);
          core.parsedDOM.elements.count++;
        }
        images.remove();
      },

      buildDOM: function($container) {
        var builtElements = [];
        for(var i = 0; i < core.parsedDOM.elements.count; i++) {
          var title = core.parsedDOM.elements.alt[i],
            src = core.parsedDOM.elements.src[i],
            tagName = core.parsedDOM.elements.tagName[i],
            $wrapper = $('<div />',{
              'class': 'banner-item',
              'data-title': title
            }),
            $overlay = $('<div />', {
              'class': 'banner-item-overlay',
              'html': title
            }),
            $label = $('<div />', {
              'class': 'banner-item-label',
              'html': title
            }),
            $image = $('<img />', {
              'src': src,
              'alt': title
            });

          $image.css({
            'position': 'absolute',
            'display': 'none',
            'z-index': '1'
          });

          $wrapper
            .append($overlay)
            .append($label)
            .append($image);

          builtElements.push($wrapper);
        }
        $container.append(builtElements);
      },

      setEvents: function($container) {
        var $elements = $container.find('.banner-item'),
          slideWidth = $container.width() - (core.defaultOptions.tabWidth + 1) * (core.parsedDOM.elements.count - 1) - 1;

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

      unwrap: function($container, $slide, slideWidth) {
        setTimeout(function(){
          $slide
            .animate({
              'width': slideWidth + 'px'
            }, 400, function(){
              $container.attr('data-animated', 'false');
            })
            .addClass('active');

          $slide
            .find('.banner-item-overlay')
            .fadeOut(400);

          setTimeout(function(){
            $slide
              .find('.banner-item-label')
              .fadeIn(300);
            $slide
              .find('img')
              .fadeIn(300);
          }, 400)
        }, 300);

      },

      wrap: function($container, $slide) {
        setTimeout(function(){
          $slide
            .animate({
              'width': core.defaultOptions.tabWidth + 'px'
            }, 400, function(){
              $container.attr('data-animated', 'false');
            })
            .removeClass('active');


          setTimeout(function(){
            $slide
              .find('img')
              .fadeOut(300);

            $slide
              .find('.banner-item-overlay')
              .fadeIn(400);
          }, 400);

        }, 300);

        $slide
          .find('.banner-item-label')
          .fadeOut(300);
      }
     }

    core.init(this, core.defaultOptions, options);
  }
})(jQuery);
