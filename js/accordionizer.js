(function($){
	$.fn.accordionize = function(options) {
		var core = {
			defaultOptions: $.extend({
				tabWidth: 80,
				scroll: {
					timeout: 7000,
					auto: true,
				},
				classPrefix: 'accordionized'
			}, options),

			// TODO: Рефакторинг получения названий сущности плагина и класса конейнера -----
			data: {
				// containerClassName: core.getContainerClassName(core.data.$container), 
				containerClassName: '',
				// instanceClassName: core.getInstanceClassName(core.data.$container),
				instanceClassName: '',
				idMin: 0,
				idMax: 99999
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

			//TODO: Придумать реализовать рабочую проверку на уникальность -----
			getInstanceClassName: function($container) {
				// while($('body').find('.' + className).length) {
				// 	var className = core.buildInstanceClassName($container);
				// }

				return core.buildInstanceClassName($container);
			},

			/**
			 * Генерируем ID для текущей сущности
			 */

			generateInstanceId: function() {
				return Math.floor(Math.random() * (core.data.idMax - core.data.idMin + 1)) + core.data.idMin;

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

			build: function() {
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

					$wrapper
						.append($overlay)
						.append($label)
						.append($image);

					builtElements.push($wrapper);
				}
				return $(builtElements);
			},

			/**
			 * Прикручиваем анимацию 
			 */

			 //TODO: Рефакторинг ----------------------------------------------
			setEvents: function($container) {
				var $this = $(this),
					$elements = core.build(),
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

					$container.append($(this));
				});
				$container.addClass(core.data.instanceClassName);
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

					$slide
						.find('.banner-item-overlay')
						.fadeIn(400);
				}, 300);

				$slide
					.find('.banner-item-label')
					.fadeOut(300);
			}
 		}

		core.init(this, core.defaultOptions, options);
	}
})(jQuery);
