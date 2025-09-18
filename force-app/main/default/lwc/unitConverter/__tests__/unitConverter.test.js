import { createElement } from "@lwc/engine-dom";
import UnitConverter from "c/unitConverter";

describe("c-unit-converter", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("rendering", () => {
    it("should show up the two inputs", () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });

      // Act
      document.body.appendChild(element);

      // Assert
      const inputs = element.shadowRoot.querySelectorAll("lightning-input");
      expect(inputs.length).toBe(2);
    });

    it("should hide labels when hideLabels is true", () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.hideLabels = true;

      // Act
      document.body.appendChild(element);

      // Assert
      const inputs = element.shadowRoot.querySelectorAll("lightning-input");
      expect(inputs[0].variant).toBe("label-hidden");
      expect(inputs[1].variant).toBe("label-hidden");
    });

    it("should show labels when hideLabels is false", () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.hideLabels = false;

      // Act
      document.body.appendChild(element);

      // Assert
      const inputs = element.shadowRoot.querySelectorAll("lightning-input");
      expect(inputs[0].variant).toBe("standard");
      expect(inputs[1].variant).toBe("standard");

      // assert labels
      expect(inputs[0].label).toBe("From");
      expect(inputs[1].label).toBe("To");
    });

    it("should show custom labels when fromLabel and toLabel are set", () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.hideLabels = false;
      element.fromLabel = "Custom From";
      element.toLabel = "Custom To";

      // Act
      document.body.appendChild(element);

      // Assert
      const inputs = element.shadowRoot.querySelectorAll("lightning-input");
      expect(inputs[0].label).toBe("Custom From");
      expect(inputs[1].label).toBe("Custom To");
    });

    it("should disable both inputs when disabled is true", () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.disabled = true;

      // Act
      document.body.appendChild(element);

      // Assert
      const inputs = element.shadowRoot.querySelectorAll("lightning-input");
      expect(inputs[0].disabled).toBe(true);
      expect(inputs[1].disabled).toBe(true);
    });

    it("should disable only the from input when disableFrom is true", () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.disableFrom = true;

      // Act
      document.body.appendChild(element);

      // Assert
      const inputs = element.shadowRoot.querySelectorAll("lightning-input");
      expect(inputs[0].disabled).toBe(true);
      expect(inputs[1].disabled).toBe(false);
    });

    it("should disable only the to input when disableTo is true", () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.disableTo = true;

      // Act
      document.body.appendChild(element);

      // Assert
      const inputs = element.shadowRoot.querySelectorAll("lightning-input");
      expect(inputs[0].disabled).toBe(false);
      expect(inputs[1].disabled).toBe(true);
    });
  });

  describe("behavior", () => {
    it("should convert length units correctly", async () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.conversionType = "length";
      element.fromUnit = "m";
      element.toUnit = "km";

      document.body.appendChild(element);

      const inputFrom = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-from"]'
      );
      const inputTo = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-to"]'
      );

      // Act
      inputFrom.value = 1500;
      inputFrom.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputTo.value).toBe(1.5);

      const { from, to } = element.value;
      expect(from.value).toBe(1500);
      expect(to.value).toBe(1.5);
      expect(from.unit).toBe("m");
      expect(to.unit).toBe("km");

      // convert back
      inputTo.value = 2;
      inputTo.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputFrom.value).toBe(2000);
    });

    it("should convert weight units correctly", async () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.conversionType = "weight";
      element.fromUnit = "g";
      element.toUnit = "kg";

      document.body.appendChild(element);

      const inputFrom = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-from"]'
      );
      const inputTo = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-to"]'
      );

      // Act
      inputFrom.value = 2500;
      inputFrom.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputTo.value).toBe(2.5);

      // convert back
      inputTo.value = 1;
      inputTo.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputFrom.value).toBe(1000);
    });

    it("should convert temperature units correctly", async () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.conversionType = "temperature";
      element.fromUnit = "c";
      element.toUnit = "f";

      document.body.appendChild(element);

      const inputFrom = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-from"]'
      );
      const inputTo = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-to"]'
      );

      // Act
      inputFrom.value = 100;
      inputFrom.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputTo.value).toBe(212);

      // convert back
      inputTo.value = 32;
      inputTo.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputFrom.value).toBe(0);
    });

    it("should assert that the event is fired with correct detail", async () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.conversionType = "length";
      element.fromUnit = "m";
      element.toUnit = "km";

      document.body.appendChild(element);

      const inputFrom = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-from"]'
      );
      const inputTo = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-to"]'
      );

      // listen for conversion event
      const conversionHandler = jest.fn();
      element.addEventListener("conversion", conversionHandler);

      // Act
      inputFrom.value = 1500;
      inputFrom.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert that conversion event was fired
      expect(conversionHandler).toHaveBeenCalled();
      expect(conversionHandler.mock.calls[0][0].detail.from).toEqual({
        unit: "m",
        value: 1500
      });
      expect(conversionHandler.mock.calls[0][0].detail.to).toEqual({
        unit: "km",
        value: 1.5
      });

      // Assert
      expect(inputTo.value).toBe(1.5);

      const { from, to } = element.value;
      expect(from.value).toBe(1500);
      expect(to.value).toBe(1.5);
      expect(from.unit).toBe("m");
      expect(to.unit).toBe("km");

      jest.clearAllMocks();

      // convert back
      inputTo.value = 2;
      inputTo.dispatchEvent(new CustomEvent("change"));
      await Promise.resolve();

      // Assert that conversion event was fired
      expect(conversionHandler).toHaveBeenCalled();
      expect(conversionHandler.mock.calls[0][0].detail.from).toEqual({
        unit: "km",
        value: 2
      });
      expect(conversionHandler.mock.calls[0][0].detail.to).toEqual({
        unit: "m",
        value: 2000
      });

      // Assert
      expect(inputFrom.value).toBe(2000);
    });

    it("should not convert when the same value is entered", async () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.conversionType = "length";
      element.fromUnit = "m";
      element.toUnit = "km";

      document.body.appendChild(element);

      const inputFrom = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-from"]'
      );
      const inputTo = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-to"]'
      );

      // listen for conversion event
      const conversionHandler = jest.fn();
      element.addEventListener("conversion", conversionHandler);

      // Act
      inputFrom.value = 1500;
      inputFrom.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert that conversion event was fired
      expect(conversionHandler).toHaveBeenCalledTimes(1);
      expect(inputTo.value).toBe(1.5);

      jest.clearAllMocks();

      // Enter the same value again
      inputFrom.value = 1500;
      inputFrom.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert that conversion event was not fired again
      expect(conversionHandler).not.toHaveBeenCalled();
      expect(inputTo.value).toBe(1.5);
    });

    it("should handle custom conversion factors through the @api factors", async () => {
      // Arrange
      const element = createElement("c-unit-converter", {
        is: UnitConverter
      });
      element.conversionType = "custom";
      element.fromUnit = "a";
      element.toUnit = "b";
      element.factors = { a: 1, b: 1 / 2 }; // 1 a = 2 b

      document.body.appendChild(element);

      const inputFrom = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-from"]'
      );
      const inputTo = element.shadowRoot.querySelector(
        'lightning-input[data-id="input-to"]'
      );

      // Act
      inputFrom.value = 3;
      inputFrom.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputTo.value).toBe(6);

      // Assert that the events contain the correct details
      const { from, to } = element.value;
      expect(from.value).toBe(3);
      expect(to.value).toBe(6);
      expect(from.unit).toBe("a");
      expect(to.unit).toBe("b");

      // convert back
      inputTo.value = 4;
      inputTo.dispatchEvent(new CustomEvent("change"));

      await Promise.resolve();

      // Assert
      expect(inputFrom.value).toBe(2);

      // Assert that the events contain the correct details
      const result = element.value;
      expect(result.from.value).toBe(2);
      expect(result.to.value).toBe(4);
      expect(result.from.unit).toBe("a");
      expect(result.to.unit).toBe("b");
    });
  });
});
