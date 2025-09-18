# Unit Converter LWC

![NPM Version](https://img.shields.io/npm/v/@wisefoxme/unit-converter-lwc?style=flat-square) ![License](https://img.shields.io/github/license/wisefoxme/unit-converter-lwc) ![Downloads](https://img.shields.io/npm/dy/%40wisefoxme%2Funit-converter-lwc)

A Lightning Web Component (LWC) for converting units of measurement. This component allows users to convert values between different units such as length, weight, and temperature.

## API

- `@api fromUnit`: The unit to convert from (e.g., "m" for meters).
- `@api toUnit`: The unit to convert to (e.g., "km" for kilometers).
- `@api conversionType`: The type of conversion (e.g., "length", "weight", "temperature").
- `@api value`: An object containing the `from` and `to` values along with their respective units.
- `@api precision`: The number of decimal places to round the converted value to (default is 2).
- `@api hideLabels`: A boolean to hide or show the unit labels (default is false).
- `@api fromLabel`: Custom label for the "from" input field.
- `@api toLabel`: Custom label for the "to" input field.
- `@api disableFrom`: A boolean to disable or enable the "from" input field (default is false).
- `@api disableTo`: A boolean to disable or enable the "to" input field (default is false).
- `@api disabled`: A boolean to disable or enable the input fields (default is false).

## Events

`conversion`: Fired when a conversion is performed. The event detail contains the `from` and `to` values along with their respective units:

```json
{
  "from": { "unit": "m", "value": 1500 },
  "to": { "unit": "km", "value": 1.5 }
}
```
