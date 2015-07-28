'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'pill',
  propTypes: {
    cssClass: React.PropTypes.string,
    key: React.PropTypes.string,
    onClick: React.PropTypes.func,
    tag: React.PropTypes.string
  },
  render: function () {
    return (
      React.DOM.span({
        key: this.props.key,
        className: 'pill' + this.props.cssClass
      },
        React.DOM.span({ className: 'tag' }, this.props.tag),
        React.DOM.a({ className: 'remove', onClick: this.props.onClick },
          String.fromCharCode(215))
        )
    );
  }
});
