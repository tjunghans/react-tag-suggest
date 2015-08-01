'use strict';

var React = require('react/addons');

module.exports = React.createClass({
  displayName: 'suggestion-item',
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
      React.DOM.div({ className: className },
        React.DOM.a({ className: 'suggestion' }, this.props.label),
        React.DOM.a({ className: 'set-input' }, String.fromCharCode(8598))
        )
    );
  }
});
