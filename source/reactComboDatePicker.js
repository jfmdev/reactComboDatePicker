/*
 * reactComboDatePicker v1.0.0
 * http://github.com/jfmdev/reactComboDatePicker
 * «Copyright 2016 Jose F. Maldonado»
 * License: LGPLv3 (http://www.gnu.org/licenses/lgpl-3.0.html)
 */

class ComboDatePicker extends React.Component {
    // ----- Main methods ----- //
  
    /**
     * Constructor function.
     */
    constructor(props) {
        super(props);        
        this.state = {};
        
        // Save callback.
        this.changeCallback = props.onChange;
        
        // Initialize model.
        this.model = ComboDatePicker.parseDate(props.date, props.timezone);
        
        // Initialize attributes variables.
        this.attrsDate = props.attrsDate || {};
        this.attrsMonth = props.attrsMonth || {};
        this.attrsYear = props.attrsYear || {};
            
        // Initialize order.
        if(typeof props.order != 'string') {
            this.order = 'dmy';
        } else {
            this.order = props.order.toLowerCase();
        }

        // Initialize minimal and maximum values.
        this.minDate = ComboDatePicker.parseDate(props.minDate, props.timezone);
        if(this.minDate == null) {
            var now = new Date();
            this.minDate = new Date(now.getFullYear()-100, now.getMonth(), now.getDate(),
                                    now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        }
        this.maxDate = ComboDatePicker.parseDate(props.maxDate, props.timezone);
        if(this.maxDate == null) {
            this.maxDate = new Date();
        }

        // Verify if selected date is in the valid range.
        if(this.model != null && this.model < this.minDate) this.model = this.minDate;
        if(this.model != null && this.model > this.maxDate) this.model = this.maxDate;

        // Initialize place holders.
        this.placeHolders = [null, null, null];
        if(props.placeholder !== undefined && props.placeholder !== null && (typeof props.placeholder == 'string' || Array.isArray(props.placeholder))) {
            var holders = typeof props.placeholder == 'string'? props.placeholder.split(',') : props.placeholder;
            if(holders.length == 3) { this.placeHolders = holders; }
        }

        // Initialize list of months names.
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if(props.months !== undefined && props.months !== null) {
            if(typeof props.months == 'string') {
                var months = props.months.split(',');
                if(months.length == 12) this.monthNames = months;
            }
            if(Array.isArray(props.months) && props.months.length == 12) {
                 this.monthNames = props.months;
            }
        }
        
        // Initialize list of years.
        this.yearList = [];
        for(var i=this.minDate.getFullYear(); i<=this.maxDate.getFullYear(); i++) {
            this.yearList.push({value:i, name:i});
        }

        // Verify if the order of the years must be reversed.
        if(typeof props.yearOrder == 'string' && props.yearOrder.indexOf('des') == 0) {
            this.yearList.reverse();
        }
        
        // Invoke callback.
        if(this.changeCallback) {
            this.changeCallback(this, this.model);
        }
    }
  
    /**
     * Rendering function.
     *
     * @return {object} A React element.
     */
    render() {
        // Generate list of days and months.
        var monthList = this.getMonthList();
        var dateList = this.getDateList();
      
        // Define child select elements.
        var selects = {
            'd': (<ComboDatePicker.MySelect attrs={this.attrsDate}
                    type="date" model={this.model} items={dateList} placeholder={this.placeHolders[2]}
                    ref={(c) => this._date = c} onChange={this.updateModel.bind(this)} />),
            'm': (<ComboDatePicker.MySelect attrs={this.attrsMonth} 
                    type="month" model={this.model} items={monthList} placeholder={this.placeHolders[1]} 
                    ref={(c) => this._month = c} onChange={this.updateModel.bind(this)} />),
            'y': (<ComboDatePicker.MySelect attrs={this.attrsYear}
                    type="year" model={this.model} items={this.yearList} placeholder={this.placeHolders[0]}
                    ref={(c) => this._year = c} onChange={this.updateModel.bind(this)} />)
        }
 
        // Return result.
        return (
            <span>
                {selects[this.order.charAt(0)]}
                {selects[this.order.charAt(1)]}
                {selects[this.order.charAt(2)]}
            </span>
        );
    }
    
    // ---- Misc methods ----- //

    /**
     * Get a list of valid dates to be picked according to the current selections of month and year.
     *
     * @return {array} An arrays of objects with the properties 'value' and 'name'.
     */
    getDateList() {
        // Start date is 1, unless the selected month and year matchs the minimum date.
        var start = 1;
        if(this.model != null && this.model.getMonth() == this.minDate.getMonth() && this.model.getFullYear() == this.minDate.getFullYear()) {
            start = this.minDate.getDate();
        }

        // End date is 30 or 31 (28 or 29 in February), unless the selected month and year matchs the maximum date.
        var end = this.model != null? ComboDatePicker.maxDate(this.model.getMonth()+1, this.model.getFullYear()) : 31;
        if(this.model != null && this.model.getMonth() == this.maxDate.getMonth() && this.model.getFullYear() == this.maxDate.getFullYear()) {
            end = this.maxDate.getDate();
        }

        // Generate list.
        var dates = [];
        for(var i=start; i<=end; i++) {
            dates.push({value:i, name:i});
        }
        return dates;
    };
    
    /**
     * Get a list of valid months to be picked according to the current selection of year.
     *
     * @return {array} An arrays of objects with the properties 'value' and 'name'.
     */
    getMonthList() {
        // Some months can not be choosed if the year matchs with the year of the minimum or maximum dates.
        var start = this.model != null && this.model.getFullYear() == this.minDate.getFullYear()? this.minDate.getMonth() : 0;
        var end = this.model != null && this.model.getFullYear() == this.maxDate.getFullYear()? this.maxDate.getMonth() : 11;

        // Generate list.
        var months = [];
        for(var i=start; i<=end; i++) {
            months.push({value: i, name: this.monthNames[i]});
        }
        return months;
    };
    
    /**
     * Updates the model when one of the child components changes.
     */
    updateModel() {
        // Get combo boxes values.
        var date = this._date.getValue();
        var month = this._month.getValue();
        var year = this._year.getValue();
        
        // Verify all values are defined.
        if(ComboDatePicker.isValidValue(date) && ComboDatePicker.isValidValue(month) && ComboDatePicker.isValidValue(year)) {
            // Validate max day of month.
            var maxDate = ComboDatePicker.maxDate(month+1, year);
            if(date > maxDate) { date = maxDate; }

            // Update model.
            this.model = new Date();
            this.model.setDate(date);
            this.model.setMonth(month);
            this.model.setFullYear(year);
            
            // Validate min and max dates.
            if(this.model < this.minDate) this.model = this.minDate;
            if(this.model > this.maxDate) this.model = this.maxDate;
        } else {
            // Reset model.
            this.model = null;
        }

        // Hide or show days and months according to the min and max dates.
        this._date.setItems(this.getDateList());
        this._month.setItems(this.getMonthList());
        this._year.forceUpdate(); // Force update in order to remove/disable the placeholder.
        
        // Invoke callback.
        if(this.changeCallback) {
            this.changeCallback(this, this.model);
        }
    }
    
    /**
     * Gets the element's current value.
     *
     * @return {Date} A date.
     */
    getValue() {
        return this.model;
    }
    
    // ----- Static methods ----- //
    
    /**
     * Verifies if a option value is valid.
     *
     * @param {string} myValue The value to test.
     * @return {boolean} A boolean indicating if is valid or not.
     */
    static isValidValue(myValue) {
        return myValue !== undefined && myValue !== null && myValue !== '' && !isNaN(myValue);
    }
    
    /**
     * Function for parse a date.
     *
     * @param {string|number} myDate A string or a number representing a date.
     * @param {number} myTimezone A number indicating the timezone offset.
     * @return {Date} The parsed date.
     */
    static parseDate(myDate, myTimezone) {
        var res = null;
        if(myDate !== undefined && myDate !== null) {
            if(myDate instanceof Date) {
                res = myDate;
            } else {
                if(typeof myDate == 'number' || typeof myDate == 'string') {
                    // Parse date.
                    res = new Date(isNaN(myDate)? myDate : parseInt(myDate, 10));
                    
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
    static adjustTimezone(myDate, myTimezone) {
        var offset = isNaN(myTimezone)? new Date().getTimezoneOffset() : parseFloat(myTimezone)*60;
        return new Date(myDate.getTime() + offset*60*1000);                           
    }

    /**
     * Get the number of days of a month (in a particular year).
     *
     * @param {number} month The month's number.
     * @param {number} year The year
     * @return {number} The number of days of a month.
     */
    static maxDate(month, year) {
        var res = 31;
        if(month != null) {
            if(month == 4 || month == 6 || month == 9 || month == 11) {
                res = 30;
            }
            if(year != null && month == 2) {
                res = year % 4 == 0 && year % 100 != 0? 29 : 28;
            }
        }        
        return res;
    }
}

ComboDatePicker.MySelect = class extends React.Component {
    /**
     * Constructor function.
     */
    constructor(props) {
        super(props);        
        this.state = {};
        
        // Set list of items.
        this.state.items = props.items || [];
        
        // Set type and value.
        this.value = null;
        if(props.model) {
            if(props.type == 'd' || props.type == 'date') this.value = props.model.getDate();
            if(props.type == 'm' || props.type == 'month') this.value = props.model.getMonth();
            if(props.type == 'y' || props.type == 'year') this.value = props.model.getFullYear();
        }
        this.type = props.type;

        // Set placeholder.
        this.placeholder = props.placeholder? props.placeholder : null;
        
        // Set attributes.
        this.attributes = props.attrs || {};
        
        // Set callback.
        this.changeCallback = props.onChange;
        
        // Bind event listener.
        this.handleChange = this.handleChange.bind(this);
    }
  
    /**
     * Rendering function.
     *
     * @return {object} A React element.
     */
    render() { 
        // Verify min and max values.
        if(this.value && this.state.items) {
            // Get min and max values (which are at the extremes).
            let min = this.state.items[0].value;
            let max = this.state.items[this.state.items.length - 1].value;
            if(min > max) { let auxi = min; min = max; max = auxi; }
            
            // Compare value with max and min.
            if(this.value < min) this.value = min;
            if(this.value > max) this.value = max;            
        }

        // Generate options.
        var options = [];   
        for(var i=0; i<this.state.items.length; i++) {
            options.push(
                <option value={this.state.items[i].value}
                        selected={this.state.items[i].value == this.value}>
                    {this.state.items[i].name}
                </option>
            );
        }

        // Add empty value if need.
        if(this.placeholder) {
            options.unshift(
                <option value="" {...this.value? {disabled: true} : {}}>{this.placeholder}</option>
            );
        } else {
            if(!this.value) { options.unshift(<option value=""></option>); }          
        }

        // Return value.
        return <select onChange={this.handleChange} {...this.attributes}>{options}</select>;
    }
    
    /**
     * Handles the onChange event from the element.
     *
     * @param {object} ev The event properties.
     */
    handleChange(evt) {
        // Update value.
        this.value = parseInt(evt.target.value, 10);
        
        // Invoke callback.
        if(this.changeCallback) {
            this.changeCallback(this);
        }
    }
    
    /**
     * Gets the element's current value.
     *
     * @return {number} The current selected value.
     */
    getValue() {
        return this.value;
    }
    
    /**
     * Update the list of items.
     *
     * @param {array} items A list of items.
     */
    setItems(items) {      
        this.setState({'items': items});
    }
}
