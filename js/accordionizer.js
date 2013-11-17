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

      // TODO: Рефакторинг получения названий сущности плагина и класса конейнера -----
      data: {
        // containerClassName: core.getContainerClassName(core.data.$container),
        containerClassName: '',
        // instanceClassName: core.getInstanceClassName(core.data.$container),
        instanceClassName: '',
      },

      parsedDOM: {
        elements: {
          tagName: [],
          src: [],
          alt: [],
          count: 0
        }
      },
      // TODO: Рефакторинг получения названий сущности плагина и класса конейнера -----
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
              var grayscale = pix[i] * .3 + pix[i+1] * .59 + pix[i+2] * .11;

              pix[i] = grayscale;
              pix[i+1] = grayscale;
              pix[i+2] = grayscale;
            }

            context.putImageData(imageData, 0, 0);
            $canvas.insertAfter($image);
          });
              
        }
      },

      /**
       * Получаем класс контейнера
       */

      getContainerClassName: function($container) {
        return $container.attr('class');
      },

      /**
       * Собираем класс для текущей сущности плагина
       */

      buildInstanceClassName: function($container) {
        var className = {
            prefix: core.defaultOptions.classPrefix,
            id: core.generateInstanceId(),
            postfix: '__' + core.getContainerClassName($container)
          }

        return className.prefix + className.id + className.postfix;
      },

      /**
       * Проверяем полученный класс на уникальность
       */

      //TODO: Реализовать рабочую проверку на уникальность -----
      getInstanceClassName: function($container) {
        // while($('body').find('.' + className).length) {
        //   var className = core.buildInstanceClassName($container);
        // }

        return core.buildInstanceClassName($container);
      },

      /**
       * Генерируем ID для текущей сущности
       */

      generateInstanceId: function() {
        return Math.floor(Math.random() * (99999 - 0 + 1)) + 0;

      },

      /**
       * Устанавливаем автоматическую прокрутку
       */

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

      /**
       * Инициализация плагина
       */

      // TODO: Рефакторинг -------------------------------------------
      init: function($container, defaultOptions, externalOptions) {
        core.writeContainerNamesData($container);
        core.parse($container);
        core.buildDOM($container);
        core.grayscale.createCanvas($container);
        core.setEvents($container);
        $container.children('.banner-item').first().trigger('mousedown');
      },

      /**
       *  Парсим DOM элементы, находящиеся в контейнере
       */

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

      /**
       * Собираем новую DOM структуру
       */

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
        // $(builtElements).appendTo($container);
        $container.append(builtElements);
        // $container.addClass(core.data.instanceClassName);
      },

      /**
       * Прикручиваем анимацию
       */

       //TODO: Рефакторинг ----------------------------------------------
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

      /**
       * Анимация разворачивания
       */

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

            // $slide
            //   .find('canvas')
            //   .fadeOut(300);

            $slide
              .find('img')
              .fadeIn(300);
          }, 400)
        }, 300);

      },

      /**
       * Анимация сворачивания
       */

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
            // $slide
            //   .find('canvas')
            //   .fadeIn(300);

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
