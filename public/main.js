'use strict';

var React = require('react');
var tagSuggestComponent = require('../');

// DEV START
var items = ['Java', 'Java Flash', 'JavaScript', 'Html', 'Java Script',
  'css', 'photoshop', 'project management', 'sales', 'photography',
  'football', 'dj', 'video editing', 'mac os x', 'Adobe Photoshop', 'Testing',
  'Flash', 'Sales Support', 'Hardware Support', 'Strategic planning'];

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

