'use strict';

var React = require('react');
var tagInputComponent = require('../');
var list = require('react-simple-list');

var items = ['Java', 'Java Flash', 'JavaScript', 'Html', 'Java Script',
  'css', 'photoshop', 'project management', 'sales', 'photography',
  'football', 'dj', 'video editing', 'mac os x', 'Adobe Photoshop'];

function renderItems(items, onItemClick) {
  return React.render(React.createElement(list, {
    items: items,
    onItemClick: onItemClick
  }),
    document.querySelector('#list'));
}

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

var itemList;
var tagInput = React.render(React.createElement(tagInputComponent, {
  onInputChange: function (input, callback) {
    findSuggestions(input, function (err, res) {
      if (err) { return; }
      itemList = renderItems(res, function (item) {
        tagInput.setInput(item);
      });
    });
  },
  onInputKeyUp: function (event) {
    if (event.keyCode === 40) { // down arrow
      if (itemList) {
        itemList.highlightNext();
      }
    }
    if (event.keyCode === 38) { // down arrow
      if (itemList) {
        itemList.highlightPrev();
      }
    }
    if (event.keyCode === 13) { // enter
      if (itemList.state.highlighted > -1) {
        tagInput.setInput(itemList.props.items[itemList.state.highlighted]);
      }
    }
    console.log(event.keyCode);
  },
  onTagChange: function (tags) {
    console.log(tags);
  }
}),
  document.querySelector('#content'));

