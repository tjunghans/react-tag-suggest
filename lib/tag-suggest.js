'use strict';

var bean = require('bean');
var React = require('react/addons');
var tagInputComponent = require('tag-input');
var listComponent = require('react-simple-list');
var itemComponent = require('./suggestion-item');

React.initializeTouchEvents(true);

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
      userInput: '',
      tags: []
    };
  },
  render: function () {
    var self = this;
    var cssClass = this.props.cssClass ? ' ' + this.props.cssClass : '';
    var tagInput = React.createElement(tagInputComponent, {
      userInput: this.state.userInput,
      tags: this.state.tags,
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
        self.setState({
          tags: tags
        });
        console.log(tags);
      }
    });

    var list;
    if (this.state.suggestions.length) {
      list = React.createElement(listComponent, {
        items: this.state.suggestions,
        itemComponent: itemComponent,
        onItemClick: function (event, item) {
          if (event.target.classList.contains('set-input')) {
            var userInput = item.label;
            self.setState({
              userInput: userInput,
              highlighted: -1,
              suggestions: []
            });
          } else if (event.target.classList.contains('suggestion')) {
            if (self.state.tags.indexOf(item.label) === -1) {
              var newTags = self.state.tags.slice();
              newTags.push(item.label);
              self.setState({
                tags: newTags,
                userInput: '',
                highlighted: -1,
                suggestions: []
              });
            }
          }
        }
      });

    }

    return (
      React.DOM.div({
        className: 'tag-suggest' + cssClass,
        ref: 'tagSuggestion'
      }, tagInput, list)
    );
  },
  componentDidMount: function () {
    bean.on(document, 'keyup', this._onDocumentKeyUp);
  },
  componentWillUnmount: function () {
    bean.off(document, 'keyup', this._onDocumentKeyUp);
  },
  componentDidUpdate: function () {
    var c = React.findDOMNode(this.refs.tagSuggestion);
    var input = c.querySelector('.new-tag');
    var suggestions = c.querySelector('ul');
    if (suggestions) {
      var left;
      if (c.offsetWidth < (suggestions.offsetWidth + input.offsetLeft)) {
        left = c.offsetWidth - suggestions.offsetWidth;
      } else {
        left = input.offsetLeft;
      }
      suggestions.style.left = left + 'px';
    }
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
