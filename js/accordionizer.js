(function($){
  $.fn.accordionize = function(options) {
    var core = {
      init: function($container, defaultOptions, externalOptions) {
        core.writeContainerNamesData($container);
        core.findAndConvertBaseNode($container);
        core.buildDOM($container);
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
        classPrefix: 'accordionized'
      }, options),

      data: {
        containerClassName: '',
        instanceClassName: ''
      },

      elements: [],

      writeContainerNamesData: function($container){
        core.data.containerClassName = $container.attr(attrClass);
        core.data.instanceClassName = core.buildInstanceClassName($container);
      },

      findAndConvertBaseNode: function($container) {
        var objImages = $container.find(tagImg);
        var imageArray = objImages.toArray();

        core.convertBaseNodeToAccordionizeNode(imageArray);
        objImages.remove();
      },

      buildDOM: function($container) {
        var builtElements = [];
        for(var i = 0; i < core.elements.length; i++) {
          var title = core.elements[i].alt
            src = core.elements[i].src,
            tagName = core.elements[i].tagName,
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

      paintOnCanvas: function($container) {
        var $images = $container.find(tagImg);

        $images.each(function(){
          var $image = $(this);
          var imgWidth = $image.width();
          var imgHeight = $image.height();
          var imgName = $image.attr(attrAlt);
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
        return $(tagCanvas)
            .attr({
              'width': imgWidth,
              'height': imgHeight,
              'data-rel': imgName
            })
            .css({
              position: positionVal
            });
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

      buildInstanceClassName: function($container) {
        var className = {
            prefix: core.defaultOptions.classPrefix,
            id: core.generateInstanceId(),
            postfix: '__' + $container.attr(attrClass)
          }

        return className.prefix + className.id + className.postfix;
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

      convertBaseNodeToAccordionizeNode: function(baseNodeArray) {
        for (var index in baseNodeArray) {
          var node = $(baseNodeArray[index]);

          var accordionizeNode = new AccordionizeNode({tagName: node.prop(propTagName),
            src: node.attr(attrSrc),
            alt: node.attr(attrAlt)});
          core.elements.push(accordionizeNode);
        }
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
              .find(tagImg)
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
              .find(tagImg)
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

  function AccordionizeNode(accordionizeNode) {
    $.extend(this, accordionizeNode);
  }

  var propTagName = "tagName";
  var attrSrc = "src";
  var attrAlt = "alt";
  var tagImg = "img";
  var attrClass = "class";
  var tagCanvas = "<canvas />";
  var positionVal = "absolute";
})(jQuery);
