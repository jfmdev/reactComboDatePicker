reactComboDatePicker
====================

_Select dates with combo boxes_

**reactComboDatePicker** is an React component to select dates using combo boxes.

[See the live demos and read the docs](http://jfmdev.github.io/reactComboDatePicker/ "reactComboDatePicker - Live demos and docs")

> Note that this project is a fork [ngComboDatePicker](https://github.com/jfmdev/ngComboDatePicker), an Angular implementation of this component.


Usage
-----

In order to use this component:

**1)** Include the library (located in the `dist` folder) in the header of your HTML files, after including React:

```html
<script type="text/javascript" src="react.min.js"></script>
<script type="text/javascript" src="react-dom.min.js"></script>
<script type="text/javascript" src="reactComboDatePicker.min.js"></script>
```

**2)** Then use the component `ComboDatePicker` in your code:

```javascript
ReactDOM.render(
    <ComboDatePicker />,
    document.getElementById('root')
);
```


Attributes
----------

The _reactComboDatePicker_ component supports the following attributes:

Name | Description
------------- | ----
`date`  | A Date object, a string or a number representing the initial date of the picker.
`minDate`  | A Date object, a string or a number representing the minimum date that can be picked. By default the minimum date is 100 years before the current day.
`maxDate`  | A Date object, a string or a number representing the maximum date that can be picked. By default the maximum date is the current day.
`months`  | A string (comma separated) or an array with the names of the twelve months. 
`order`  | A string with the characters "d", "m" and "y" indicating in which order the combo boxes must be displayed. By default, the combo boxes are displayed in the order "dmy".
`attrsDate`  | An object with HTML attributes to add to the `select` element for the date. 
`attrsMonth`  | An object with HTML attributes to add to the `select` element for the month. 
`attrsYear`  | An object with HTML attributes to add to the `select` element for the year. 
`yearOrder`  | A string indicating if the years must be sorted in "ascending" or "descending" order. 
`timezone`  | A number indicating timezone to be used when converting a string or an integer to a date. By default the timezone of the client is used. 
`placeholder`  | A string (comma separated) or an array with the placeholders for the year, month and date combo boxes (in that order). 
`onChange`  | A callback function invoked each time that the date, represented by the pickers, changes. 

Compilation
-----------

Since the project uses [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) and [ES6](http://es6-features.org/), you should use [Babel](https://babeljs.io/) to recompile the file `reactComboDatePicker.js` (from the `source` folder) every time you modify it, using the command: `babel source --out-dir dist`

License
-------

reactComboDatePicker is free software; you can redistribute it and/or
modify it under the terms of the Mozilla Public
License v2.0. You should have received a copy of the MPL 2.0 along with this library, otherwise you can obtain one at <http://mozilla.org/MPL/2.0/>.
