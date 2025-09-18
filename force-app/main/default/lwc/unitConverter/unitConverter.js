import { api, LightningElement, track } from "lwc";

export default class UnitConverter extends LightningElement {
  @api fromUnit;
  @api toUnit;
  @api conversionType; // 'length', 'weight', 'temperature'
  @api allowUnitSelection = false;
  @api precision = 2;

  @track _valueFrom = 0;
  @track _valueTo = 0;

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
    if (!value || !fromUnit || !toUnit || !type) return 0;

    if (type === "temperature") {
      return this.convertTemperature(value, fromUnit, toUnit);
    }

    const factors = this.conversionFactors[type];
    if (!factors || !factors[fromUnit] || !factors[toUnit]) return 0;

    // Convert to base unit, then to target unit
    const baseValue = value * factors[fromUnit];

    return this._toFloat((baseValue / factors[toUnit]).toFixed(this.precision));
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
    this._valueFrom = parseFloat(event.target.value) || 0;
    this._valueTo = this.convertUnits(
      this._valueFrom,
      this.fromUnit,
      this.toUnit,
      this.conversionType
    );
  }

  handleToValueChange(event) {
    this._valueTo = parseFloat(event.target.value) || 0;
    this._valueFrom = this.convertUnits(
      this._valueTo,
      this.toUnit,
      this.fromUnit,
      this.conversionType
    );
  }

  @api
  get value() {
    return { from: this._valueFrom, to: this._valueTo };
  }
}
