'use strict';

var bean = require('bean');
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

function selectHighlighted(state, highlighted) {
  var suggestions = state.suggestions.slice();
  if (state.highlighted !== -1) {
    suggestions[state.highlighted].cssClass = '';
  }
  suggestions[highlighted].cssClass = 'highlight';
  return {
    highlighted: highlighted,
    suggestions: suggestions,
    userInput: suggestions[highlighted].label
  };
}

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
    cssClass: React.PropTypes.string,
    suggester: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      suggestions: [],
      highlighted: -1,
      userInput: ''
    };
  },
  render: function () {
    var self = this;
    var cssClass = this.props.cssClass ? ' ' + this.props.cssClass : '';

    var tagInput = React.createElement(tagInputComponent, {
      hasSuggestions: this.state.suggestions.length > 0,
      userInput: this.state.userInput,
      onInputChange: function (input) {
        self.setState({
          userInput: input,
          highlighted: -1
        });
        if (self.props.suggester) {
          self.props.suggester(input, function (err, suggestions) {
            /*jslint unparam: true*/
            self.setState({suggestions: suggestions.map(function (suggestion) {
              return { label: suggestion, highlighted: false };
            })});
          });
        }
      },
      onTagChange: function (tags) {
        console.log(tags);
      }
    });

    var list;
    if (this.state.suggestions.length) {
      list = React.createElement(listComponent, {
        items: this.state.suggestions,
        itemComponent: itemComponent,
        onItemClick: function (item) {
          self.setState({
            userInput: item.label,
            highlighted: -1,
            suggestions: []
          });
        }
      });
    }

    return (
      React.DOM.div({
        className: 'tag-suggest' + cssClass
      }, tagInput, list)
    );
  },
  componentDidMount: function () {
    bean.on(document, 'keyup', this._onDocumentKeyUp);
  },
  componentWillUnmount: function () {
    bean.off(document, 'keyup', this._onDocumentKeyUp);
  },
  _onDocumentKeyUp: function (event) {
    if (this.state.suggestions.length === 0) {
      return;
    }

    if (event.keyCode === 40) { // down arrow
      // next
      this.setState(function (prev) {
        var highlighted = prev.highlighted === (prev.suggestions.length - 1)
          ? 0 : prev.highlighted + 1;

        return selectHighlighted(prev, highlighted);
      });
    } else if (event.keyCode === 38) { // down arrow
      // prev
      this.setState(function (prev) {
        var highlighted = (prev.highlighted === -1 || prev.highlighted === 0)
          ? prev.suggestions.length - 1 : prev.highlighted - 1;

        return selectHighlighted(prev, highlighted);
      });
    } else if (event.keyCode === 13) { // enter
      // select
      this.setState({
        suggestions: []
      });
    }

  }
});
