"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _svgContents = _react2.default.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "120",
    height: "120",
    viewBox: "0 0 120 120"
  },
  _react2.default.createElement("rect", {
    x: "10",
    y: "10",
    width: "100",
    height: "100"
  })
);

_react2.default.createElement(Icon, { svgName: "foo", svgContents: _svgContents
});

var Test = function Test() {
  _classCallCheck(this, Test);
};