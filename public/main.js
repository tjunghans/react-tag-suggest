'use strict';

var React = require('react');
var tagSuggestComponent = require('../');

var items = ['Java', 'Java Flash', 'JavaScript', 'Html', 'Java Script',
  'css', 'photoshop', 'project management', 'sales', 'photography',
  'football', 'dj', 'video editing', 'mac os x', 'Adobe Photoshop'];

var tagInput = React.render(React.createElement(tagSuggestComponent),
  document.querySelector('#content'));

