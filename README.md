# React-Tag-Suggest

[![SemVer]](http://semver.org)
[![License]](https://github.com/tjunghans/react-tag-suggest/blob/master/LICENCE)
[![Build Status](https://travis-ci.org/tjunghans/react-tag-suggest.svg?branch=master)](https://travis-ci.org/tjunghans/react-tag-suggest)

An auto suggest react component that displays an input field for queries. With
each change of the query the suggester is fired and matching results displayed
in a dropdown.

(The styling and functionality is still a bit raw in some places.)


[Demo](http://tangiblej.neocities.org/react-tag-suggest-example.html)


## Install

Install as node dependency:

```
npm install react-tag-suggest --save
```


## Quickstart

To test locally change to node_modules/react-tag-suggest and run:

```
npm start & npm run watch
```


## Commands

- `npm run build` - build production css and js
- `npm run watch` - compile css and js
- `npm run watch:test` - run tests on change
- `npm start` - start static dev server
- `npm test` - run lint and tests


## Usage

```javascript
var React = require('react');
var tagSuggestComponent = require('react-tag-suggest');

// DEV START
var items = ['Java', 'Java Flash', 'JavaScript', 'Html', 'Java Script',
  'css', 'photoshop', 'project management', 'sales', 'photography',
  'football', 'dj', 'video editing', 'mac os x', 'Adobe Photoshop'];

function findSuggestions(query, callback) {
  // Some async action will happen here
  var res;
  if (!query || query.length < 2) {
    callback(null, []);
    return;
  }

  res = items.filter(function (item) {
    return item.toLowerCase().indexOf(query.toLowerCase().trim()) > -1;
  });

  callback(null, res);
}
// DEV END

var tagInput = React.render(React.createElement(tagSuggestComponent, {
  suggester: findSuggestions
}),
  document.querySelector('#content'));

```


## Component Props

- `suggester`: function with two arguments:
  - `query`: search query
  - `callback`: function with two arguments, error and result.

  The suggester would perform an async http request (ajax) and receive a result
  which it passes back to the component via the callback.
- `cssClass`: optional css class


## License

MIT

[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: https://img.shields.io/github/license/mashape/apistatus.svg


