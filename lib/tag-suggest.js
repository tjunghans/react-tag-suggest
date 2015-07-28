'use strict';

var React = require('react/addons');
var tagInputComponent = require('tag-input');
var listComponent = require('react-simple-list');
//var request = require('request');

/*
request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})
*/

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

var itemComponent = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    highlighted: React.PropTypes.bool
  },
  render: function () {
    var className;
    if (this.props.highlighted) {
      className = 'highlighted';
    }
    return (
      React.DOM.span({ className: className }, this.props.label)
    );
  }
});

module.exports = React.createClass({
  displayName: 'tag-suggest',
  propTypes: {
    cssClass: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      items: [],
      highlighted: -1
    };
  },
  render: function () {
    var self = this;
    var cssClass = this.props.cssClass ? ' ' + this.props.cssClass : '';

    var tagInput = React.createElement(tagInputComponent, {
      onInputChange: function (input) {
        findSuggestions(input, function (err, items) {

          self.setState({items: items.map(function (item) {
            return { label: item, highlighted: false };
          })});
        });
      },
      onInputKeyUp: function (event) {
        if (event.keyCode === 40) { // down arrow
          // next
          self.setState(function (prev) {
            var items = prev.items.slice();
            var highlighted = prev.highlighted ===
              (prev.items.length - 1) ? 0 : prev.highlighted + 1;
            if (prev.highlighted !== -1) {
              items[prev.highlighted].cssClass = '';
            }
            items[highlighted].cssClass = 'highlight';
            return {
              highlighted: highlighted,
              items: items
            };
          });
        }
        if (event.keyCode === 38) { // down arrow
          // prev
          self.setState(function (prev) {
            var items = prev.items.slice();
            var highlighted = prev.highlighted ===
              0 ? prev.items.length - 1 : prev.highlighted - 1;
            if (prev.highlighted !== -1) {
              items[prev.highlighted].cssClass = '';
            }
            items[highlighted].cssClass = 'highlight';
            return {
              highlighted: highlighted,
              items: items
            };
          });
        }
        if (event.keyCode === 13) { // enter
          // select
        }
        console.log(event.keyCode);
      },
      onTagChange: function (tags) {
        console.log(tags);
      }
    });

    var list;
    if (this.state.items.length) {
      list = React.createElement(listComponent, {
        items: this.state.items,
        itemComponent: itemComponent
      });
    }

    return (
      React.DOM.div({
        className: 'tag-suggest' + cssClass
      }, tagInput, list)
    );
  }
});
