import { api, LightningElement, track } from "lwc";

export default class UnitConverter extends LightningElement {
  @api conversionType; // 'length', 'weight', 'temperature'
  @api allowUnitSelection = false;
  @api precision = 2;
  @api hideLabels = false;
  @api fromLabel = "From";
  @api toLabel = "To";
  @api disabled = false;
  @api disableFrom = false;
  @api disableTo = false;

  @track _valueFrom = 0;
  @track _valueTo = 0;
  @track _fromUnit = "m";
  @track _toUnit = "m";

  @api
  get fromUnit() {
    return this._fromUnit;
  }
  set fromUnit(value) {
    this._fromUnit = value;
  }
  @api
  get toUnit() {
    return this._toUnit;
  }
  set toUnit(value) {
    this._toUnit = value;
  }

  @api
  set valueFrom(val) {
    this._valueFrom = val;
  }
  get valueFrom() {
    return this._valueFrom;
  }

  @api
  set valueTo(val) {
    this._valueTo = val;
  }
  get valueTo() {
    return this._valueTo;
  }

  get inputVariant() {
    return this.hideLabels ? "label-hidden" : "standard";
  }

  get fromDisabled() {
    return this.disabled || this.disableFrom;
  }

  get toDisabled() {
    return this.disabled || this.disableTo;
  }

  @api
  get factors() {
    return this.conversionFactors[this.conversionType];
  }
  set factors(value) {
    // check if the value is a valid object with at least one key-value pair
    if (value && typeof value === "object" && Object.keys(value).length > 0) {
      this.conversionFactors[this.conversionType] = value;
    }
  }

  // Conversion factors to base units (meters, grams, celsius)
  conversionFactors = {
    length: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.34
    },
    weight: {
      mg: 0.001,
      g: 1,
      kg: 1000,
      oz: 28.3495,
      lb: 453.592,
      ton: 1000000
    }
  };

  _toFloat(value) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  convertUnits(value, fromUnit, toUnit, type) {
    if (!value || !fromUnit || !toUnit || !type) {
      return 0;
    }

    if (type === "temperature") {
      return this.convertTemperature(value, fromUnit, toUnit);
    }

    const factors = this.conversionFactors[type];
    if (!factors || !factors[fromUnit] || !factors[toUnit]) {
      return 0;
    }

    // Convert to base unit, then to target unit
    const baseValue = value * factors[fromUnit];

    const result = this._toFloat(
      (baseValue / factors[toUnit]).toFixed(this.precision)
    );
    return result;
  }

  convertTemperature(value, fromUnit, toUnit) {
    let celsius;

    // Convert to Celsius first
    switch (fromUnit) {
      case "c":
        celsius = value;
        break;
      case "f":
        celsius = this._toFloat(
          (((value - 32) * 5) / 9).toFixed(this.precision)
        );
        break;
      case "k":
        celsius = this._toFloat((value - 273.15).toFixed(this.precision));
        break;
      default:
        return 0;
    }

    // Convert from Celsius to target
    switch (toUnit) {
      case "c":
        return celsius;
      case "f":
        return this._toFloat(((celsius * 9) / 5 + 32).toFixed(this.precision));
      case "k":
        return this._toFloat((celsius + 273.15).toFixed(this.precision));
      default:
        return 0;
    }
  }

  handleFromValueChange(event) {
    // prevent conversion from happening if the value is not changed
    if (this._valueFrom === parseFloat(event.target.value)) {
      return;
    }

    this._valueFrom = parseFloat(event.target.value) || 0;
    this._valueTo = this.convertUnits(
      this._valueFrom,
      this._fromUnit,
      this._toUnit,
      this.conversionType
    );

    this.dispatchConversionEvent({
      from: { unit: this._fromUnit, value: this._valueFrom },
      to: { unit: this._toUnit, value: this._valueTo }
    });
  }

  handleToValueChange(event) {
    // prevent conversion from happening if the value is not changed
    if (this._valueTo === parseFloat(event.target.value)) {
      return;
    }

    this._valueTo = parseFloat(event.target.value) || 0;
    this._valueFrom = this.convertUnits(
      this._valueTo,
      this._toUnit,
      this._fromUnit,
      this.conversionType
    );

    this.dispatchConversionEvent({
      from: { unit: this._toUnit, value: this._valueTo },
      to: { unit: this._fromUnit, value: this._valueFrom }
    });
  }

  dispatchConversionEvent(detail) {
    this.dispatchEvent(
      new CustomEvent("conversion", {
        detail
      })
    );
  }

  @api
  get value() {
    return {
      from: { unit: this._fromUnit, value: this._valueFrom },
      to: { unit: this._toUnit, value: this._valueTo }
    };
  }
}
