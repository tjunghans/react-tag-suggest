/*globals describe, it, beforeEach, afterEach, Event */
/*jshint maxstatements:false */
'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');
var sinon = require('sinon');
var bean = require('bean');
var tagSuggestComponent = require('../');

function $(selector, context) {
  context = context || document;
  return context.querySelectorAll(selector);
}

describe('component', function () {
  var div;
  var input;

  function render(props) {
    props = props || {};
    React.render(React.createElement(tagSuggestComponent, props), div);
    input = $('input.new-tag', div)[0];
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
    div = null;
    input = null;
  });

  it('renders component', function () {
    render();

    assert.equal($('div.tag-suggest', div).length, 1);
  });

  it('calls suggester if set', function () {
    var spy = sinon.spy();
    render({
      suggester: spy
    });

    TestUtils.Simulate.change(input, { target: { value: 'jav' } });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, 'jav');
  });

  describe('render with suggestions', function () {
    beforeEach(function () {
      render({
        suggester: function (input, cb) {
          /*jslint unparam: true*/
          cb(null, ['java', 'java jdk', 'java operator', 'javascript']);
        }
      });
    });

    function assertInputValue(value) {
      assert.equal(input.value, value);
    }

    it('shows suggestions', function () {
      TestUtils.Simulate.change(input, { target: { value: 'jav' } });

      assert.equal($('ul li', div).length, 4);
    });

    it('highlights next suggestion', function () {
      TestUtils.Simulate.change(input, { target: { value: 'jav' } });

      bean.fire(document, 'keyup', {keyCode: 40});

      assert($('ul li', div)[0].classList.contains('highlight'));
      assertInputValue('java');

      bean.fire(document, 'keyup', {keyCode: 40});

      assert($('ul li', div)[1].classList.contains('highlight'));
      assertInputValue('java jdk');
    });

    it('highlights previous suggestion', function () {
      TestUtils.Simulate.change(input, { target: { value: 'jav' } });

      bean.fire(document, 'keyup', {keyCode: 38}); // key up to last suggestion

      assert($('ul li', div)[3].classList.contains('highlight'));
      assertInputValue('javascript');

      // do round trip
      bean.fire(document, 'keyup', {keyCode: 38});

      assertInputValue('java operator');

      bean.fire(document, 'keyup', {keyCode: 38});

      assertInputValue('java jdk');

      bean.fire(document, 'keyup', {keyCode: 38});

      assertInputValue('java');

      bean.fire(document, 'keyup', {keyCode: 38});

      assertInputValue('javascript');
      assert($('ul li', div)[3].classList.contains('highlight'));
    });

    it('selects suggestion', function () {
      TestUtils.Simulate.change(input, { target: { value: 'jav' } });

      bean.fire(document, 'keyup', {keyCode: 40}); // key down to 1. suggestion
      bean.fire(document, 'keyup', {keyCode: 13}); // enter to select

      assert.equal($('ul', div).length, 0);
      assertInputValue('java');
    });

    it('adds suggestion on click on value', function () {
      TestUtils.Simulate.change(input, { target: { value: 'jav' } });

      TestUtils.Simulate.click($('ul li a.suggestion')[1]);

      assert.equal($('ul', div).length, 0);
      assert.equal($('.pill', div).length, 1);
      assert.equal($('.pill .tag', div)[0].textContent, 'java jdk');
      assertInputValue('');
    });

    it('uses suggestion as input on click on arrow', function () {
      TestUtils.Simulate.change(input, { target: { value: 'jav' } });

      TestUtils.Simulate.click($('ul li a.set-input')[1]);

      assert.equal($('ul', div).length, 0);
      assert.equal($('.pill', div).length, 0);
      assertInputValue('java jdk');
    });

    it('uses suggestion on enter', function () {
      TestUtils.Simulate.change(input, { target: { value: 'jav' } });

      bean.fire(document, 'keyup', {keyCode: 40});
      bean.fire(input, 'keyup', {keyCode: 13});

      assertInputValue('java');
    });
  });

});

