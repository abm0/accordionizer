## accordionizer
[![Code Climate](https://codeclimate.com/github/i-dranichnikov/accordionizer.png)](https://codeclimate.com/github/i-dranichnikov/accordionizer)

## Usage
Create simple div container, and fill it with img tags.
Specifying the tag attributes: src and alt.
Example:
```html
<div class="simple-class">
  <img src="img/new-york.jpg" alt="New York">
  <img src="img/sydney.jpg" alt="Sydney">
  <img src="img/bern.jpg" alt="Bern">
  <img src="img/cologne.jpg" alt="Cologne">
  <img src="img/chicago.jpg" alt="Chicago">
</div>
```
After found using jQuery container and initialize plugin.
```js
$('.main-banner').accordionize();
```

## Config Options
- __tabWidth__, type: Number, default: 80
- __scroll__, type: Object
  - __timeout__, type: Number, default: 7000
  - __auto__, type: Boolean, default: true

## Dependence
* [jQuery](http://jquery.com/), version >= 1.10.2

## Authors
- __Igor Dranichnikov__, _[github](https://github.com/i-dranichnikov), [linkedin](http://ru.linkedin.com/pub/igor-dranichnikov/87/62b/305)_
- __Aleksey Leshko__, _[github](https://github.com/AlekseyLeshko), [linkedin](http://ru.linkedin.com/pub/aleksey-leshko/71/780/b69)_

## License
Copyright (c) 2013 Igor Dranichnikov, Aleksey Leshko Licensed under the The MIT License (MIT)
