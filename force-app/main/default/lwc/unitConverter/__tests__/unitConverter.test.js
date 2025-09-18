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
      expect(from).toBe(1500);
      expect(to).toBe(1.5);

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
  });
});
