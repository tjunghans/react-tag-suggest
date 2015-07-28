/*globals describe, it, beforeEach, afterEach, Event */
/*jshint maxstatements:false */
'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');
var sinon = require('sinon');
var tagSuggestComponent = require('../');

function $(selector, context) {
  context = context || document;
  return context.querySelectorAll(selector);
}

describe('component', function () {
  var div;
  function render(props) {
    props = props || {};
    React.render(React.createElement(tagSuggestComponent, props), div);
  }

  beforeEach(function () {
    div = document.createElement("div");
    document.body.appendChild(div);
  });

  afterEach(function () {
    if (div) {
      React.unmountComponentAtNode(div);
      div.parentNode.removeChild(div);
    }
  });

  it('renders component', function () {
    render();

    assert.equal($('div.tag-suggest', div).length, 1);
  });
});

