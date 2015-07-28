'use strict';

var React = require('react/addons');
var tagInputComponent = require('tag-input');
var listComponent = require('react-simple-list');


module.exports = React.createClass({
  displayName: 'tag-suggest',
  propTypes: {
    cssClass: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      items: []
    };
  },
  render: function () {
    var cssClass = this.props.cssClass ? ' ' + this.props.cssClass : '';
    return (
      React.DOM.div({
        className: 'tag-suggest' + cssClass
      }, React.createElement(tagInputComponent, {
        onInputChange: function (input) {
          console.log(input);
        },
        onTagChange: function (tags) {
          console.log(tags);
        }
      }))
    );
  }
});
