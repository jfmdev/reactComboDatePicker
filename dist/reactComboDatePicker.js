'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * reactComboDatePicker v1.0.1
 * http://github.com/jfmdev/reactComboDatePicker
 * «Copyright 2016 Jose F. Maldonado»
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var ComboDatePicker = function (_React$Component) {
    _inherits(ComboDatePicker, _React$Component);

    // ----- Main methods ----- //

    /**
     * Constructor function.
     */
    function ComboDatePicker(props) {
        _classCallCheck(this, ComboDatePicker);

        var _this = _possibleConstructorReturn(this, (ComboDatePicker.__proto__ || Object.getPrototypeOf(ComboDatePicker)).call(this, props));

        _this.state = {};

        // Save callback.
        _this.changeCallback = props.onChange;

        // Initialize model.
        _this.model = ComboDatePicker.parseDate(props.date, props.timezone);

        // Initialize attributes variables.
        _this.attrsDate = props.attrsDate || {};
        _this.attrsMonth = props.attrsMonth || {};
        _this.attrsYear = props.attrsYear || {};

        // Initialize order.
        if (typeof props.order != 'string') {
            _this.order = 'dmy';
        } else {
            _this.order = props.order.toLowerCase();
        }

        // Initialize minimal and maximum values.
        _this.minDate = ComboDatePicker.parseDate(props.minDate, props.timezone);
        if (_this.minDate == null) {
            var now = new Date();
            _this.minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        }
        _this.maxDate = ComboDatePicker.parseDate(props.maxDate, props.timezone);
        if (_this.maxDate == null) {
            _this.maxDate = new Date();
        }

        // Verify if selected date is in the valid range.
        if (_this.model != null && _this.model < _this.minDate) _this.model = _this.minDate;
        if (_this.model != null && _this.model > _this.maxDate) _this.model = _this.maxDate;

        // Initialize place holders.
        _this.placeHolders = [null, null, null];
        if (props.placeholder !== undefined && props.placeholder !== null && (typeof props.placeholder == 'string' || Array.isArray(props.placeholder))) {
            var holders = typeof props.placeholder == 'string' ? props.placeholder.split(',') : props.placeholder;
            if (holders.length == 3) {
                _this.placeHolders = holders;
            }
        }

        // Initialize list of months names.
        _this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (props.months !== undefined && props.months !== null) {
            if (typeof props.months == 'string') {
                var months = props.months.split(',');
                if (months.length == 12) _this.monthNames = months;
            }
            if (Array.isArray(props.months) && props.months.length == 12) {
                _this.monthNames = props.months;
            }
        }

        // Initialize list of years.
        _this.yearList = [];
        for (var i = _this.minDate.getFullYear(); i <= _this.maxDate.getFullYear(); i++) {
            _this.yearList.push({ value: i, name: i });
        }

        // Verify if the order of the years must be reversed.
        if (typeof props.yearOrder == 'string' && props.yearOrder.indexOf('des') == 0) {
            _this.yearList.reverse();
        }

        // Invoke callback.
        if (_this.changeCallback) {
            _this.changeCallback(_this, _this.model);
        }
        return _this;
    }

    /**
     * Rendering function.
     *
     * @return {object} A React element.
     */


    _createClass(ComboDatePicker, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            // Generate list of days and months.
            var monthList = this.getMonthList();
            var dateList = this.getDateList();

            // Define child select elements.
            var selects = {
                'd': React.createElement(ComboDatePicker.MySelect, { attrs: this.attrsDate,
                    type: 'date', model: this.model, items: dateList, placeholder: this.placeHolders[2],
                    ref: function ref(c) {
                        return _this2._date = c;
                    }, onChange: this.updateModel.bind(this) }),
                'm': React.createElement(ComboDatePicker.MySelect, { attrs: this.attrsMonth,
                    type: 'month', model: this.model, items: monthList, placeholder: this.placeHolders[1],
                    ref: function ref(c) {
                        return _this2._month = c;
                    }, onChange: this.updateModel.bind(this) }),
                'y': React.createElement(ComboDatePicker.MySelect, { attrs: this.attrsYear,
                    type: 'year', model: this.model, items: this.yearList, placeholder: this.placeHolders[0],
                    ref: function ref(c) {
                        return _this2._year = c;
                    }, onChange: this.updateModel.bind(this) })
            };

            // Return result.
            return React.createElement(
                'span',
                null,
                selects[this.order.charAt(0)],
                selects[this.order.charAt(1)],
                selects[this.order.charAt(2)]
            );
        }

        // ---- Misc methods ----- //

        /**
         * Get a list of valid dates to be picked according to the current selections of month and year.
         *
         * @return {array} An arrays of objects with the properties 'value' and 'name'.
         */

    }, {
        key: 'getDateList',
        value: function getDateList() {
            // Start date is 1, unless the selected month and year matchs the minimum date.
            var start = 1;
            if (this.model != null && this.model.getMonth() == this.minDate.getMonth() && this.model.getFullYear() == this.minDate.getFullYear()) {
                start = this.minDate.getDate();
            }

            // End date is 30 or 31 (28 or 29 in February), unless the selected month and year matchs the maximum date.
            var end = this.model != null ? ComboDatePicker.maxDate(this.model.getMonth() + 1, this.model.getFullYear()) : 31;
            if (this.model != null && this.model.getMonth() == this.maxDate.getMonth() && this.model.getFullYear() == this.maxDate.getFullYear()) {
                end = this.maxDate.getDate();
            }

            // Generate list.
            var dates = [];
            for (var i = start; i <= end; i++) {
                dates.push({ value: i, name: i });
            }
            return dates;
        }
    }, {
        key: 'getMonthList',


        /**
         * Get a list of valid months to be picked according to the current selection of year.
         *
         * @return {array} An arrays of objects with the properties 'value' and 'name'.
         */
        value: function getMonthList() {
            // Some months can not be choosed if the year matchs with the year of the minimum or maximum dates.
            var start = this.model != null && this.model.getFullYear() == this.minDate.getFullYear() ? this.minDate.getMonth() : 0;
            var end = this.model != null && this.model.getFullYear() == this.maxDate.getFullYear() ? this.maxDate.getMonth() : 11;

            // Generate list.
            var months = [];
            for (var i = start; i <= end; i++) {
                months.push({ value: i, name: this.monthNames[i] });
            }
            return months;
        }
    }, {
        key: 'updateModel',


        /**
         * Updates the model when one of the child components changes.
         */
        value: function updateModel() {
            // Get combo boxes values.
            var date = this._date.getValue();
            var month = this._month.getValue();
            var year = this._year.getValue();

            // Verify all values are defined.
            if (ComboDatePicker.isValidValue(date) && ComboDatePicker.isValidValue(month) && ComboDatePicker.isValidValue(year)) {
                // Validate max day of month.
                var maxDate = ComboDatePicker.maxDate(month + 1, year);
                if (date > maxDate) {
                    date = maxDate;
                }

                // Update model.
                this.model = new Date();
                this.model.setFullYear(year);
                this.model.setMonth(month);
                this.model.setDate(date);

                // Validate min and max dates.
                if (this.model < this.minDate) this.model = this.minDate;
                if (this.model > this.maxDate) this.model = this.maxDate;
            } else {
                // Reset model.
                this.model = null;
            }

            // Hide or show days and months according to the min and max dates.
            this._date.setItems(this.getDateList());
            this._month.setItems(this.getMonthList());
            this._year.forceUpdate(); // Force update in order to remove/disable the placeholder.

            // Invoke callback.
            if (this.changeCallback) {
                this.changeCallback(this, this.model);
            }
        }

        /**
         * Gets the element's current value.
         *
         * @return {Date} A date.
         */

    }, {
        key: 'getValue',
        value: function getValue() {
            return this.model;
        }

        // ----- Static methods ----- //

        /**
         * Verifies if a option value is valid.
         *
         * @param {string} myValue The value to test.
         * @return {boolean} A boolean indicating if is valid or not.
         */

    }], [{
        key: 'isValidValue',
        value: function isValidValue(myValue) {
            return myValue !== undefined && myValue !== null && myValue !== '' && !isNaN(myValue);
        }

        /**
         * Function for parse a date.
         *
         * @param {string|number} myDate A string or a number representing a date.
         * @param {number} myTimezone A number indicating the timezone offset.
         * @return {Date} The parsed date.
         */

    }, {
        key: 'parseDate',
        value: function parseDate(myDate, myTimezone) {
            var res = null;
            if (myDate !== undefined && myDate !== null) {
                if (myDate instanceof Date) {
                    res = myDate;
                } else {
                    if (typeof myDate == 'number' || typeof myDate == 'string') {
                        // Parse date.
                        res = new Date(isNaN(myDate) ? myDate : parseInt(myDate, 10));

                        // Adjust timezone.
                        res = this.adjustTimezone(res, myTimezone);
                    }
                }
            }
            return res;
        }

        /**
         * Function for change the timezone of a date.
         *
         * @param {Date} myDate A date object.
         * @param {number} myTimezone A number indicating the timezone offset.
         * @return {Date} The date with the timezone adjusted.
         */

    }, {
        key: 'adjustTimezone',
        value: function adjustTimezone(myDate, myTimezone) {
            var offset = isNaN(myTimezone) ? new Date().getTimezoneOffset() : parseFloat(myTimezone) * 60;
            return new Date(myDate.getTime() + offset * 60 * 1000);
        }

        /**
         * Get the number of days of a month (in a particular year).
         *
         * @param {number} month The month's number.
         * @param {number} year The year
         * @return {number} The number of days of a month.
         */

    }, {
        key: 'maxDate',
        value: function maxDate(month, year) {
            var res = 31;
            if (month != null) {
                if (month == 4 || month == 6 || month == 9 || month == 11) {
                    res = 30;
                }
                if (year != null && month == 2) {
                    res = year % 4 == 0 && year % 100 != 0 ? 29 : 28;
                }
            }
            return res;
        }
    }]);

    return ComboDatePicker;
}(React.Component);

ComboDatePicker.MySelect = function (_React$Component2) {
    _inherits(_class, _React$Component2);

    /**
     * Constructor function.
     */
    function _class(props) {
        _classCallCheck(this, _class);

        var _this3 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

        _this3.state = {};

        // Set list of items.
        _this3.state.items = props.items || [];

        // Set type and value.
        _this3.value = null;
        if (props.model) {
            if (props.type == 'd' || props.type == 'date') _this3.value = props.model.getDate();
            if (props.type == 'm' || props.type == 'month') _this3.value = props.model.getMonth();
            if (props.type == 'y' || props.type == 'year') _this3.value = props.model.getFullYear();
        }
        _this3.type = props.type;

        // Set placeholder.
        _this3.placeholder = props.placeholder ? props.placeholder : null;

        // Set attributes.
        _this3.attributes = props.attrs || {};

        // Set callback.
        _this3.changeCallback = props.onChange;

        // Bind event listener.
        _this3.handleChange = _this3.handleChange.bind(_this3);
        return _this3;
    }

    /**
     * Rendering function.
     *
     * @return {object} A React element.
     */


    _createClass(_class, [{
        key: 'render',
        value: function render() {
            // Verify min and max values.
            if (this.value && this.state.items) {
                // Get min and max values (which are at the extremes).
                var min = this.state.items[0].value;
                var max = this.state.items[this.state.items.length - 1].value;
                if (min > max) {
                    var auxi = min;min = max;max = auxi;
                }

                // Compare value with max and min.
                if (this.value < min) this.value = min;
                if (this.value > max) this.value = max;
            }

            // Generate options.
            var options = [];
            for (var i = 0; i < this.state.items.length; i++) {
                options.push(React.createElement(
                    'option',
                    { value: this.state.items[i].value,
                        selected: this.state.items[i].value == this.value },
                    this.state.items[i].name
                ));
            }

            // Add empty value if need.
            if (this.placeholder) {
                options.unshift(React.createElement(
                    'option',
                    _extends({ value: '' }, this.value ? { disabled: true } : {}),
                    this.placeholder
                ));
            } else {
                if (!this.value) {
                    options.unshift(React.createElement('option', { value: '' }));
                }
            }

            // Return value.
            return React.createElement(
                'select',
                _extends({ onChange: this.handleChange }, this.attributes),
                options
            );
        }

        /**
         * Handles the onChange event from the element.
         *
         * @param {object} ev The event properties.
         */

    }, {
        key: 'handleChange',
        value: function handleChange(evt) {
            // Update value.
            this.value = parseInt(evt.target.value, 10);

            // Invoke callback.
            if (this.changeCallback) {
                this.changeCallback(this);
            }
        }

        /**
         * Gets the element's current value.
         *
         * @return {number} The current selected value.
         */

    }, {
        key: 'getValue',
        value: function getValue() {
            return this.value;
        }

        /**
         * Update the list of items.
         *
         * @param {array} items A list of items.
         */

    }, {
        key: 'setItems',
        value: function setItems(items) {
            this.setState({ 'items': items });
        }
    }]);

    return _class;
}(React.Component);