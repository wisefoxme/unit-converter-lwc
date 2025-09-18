import { LightningElement } from "lwc";

export default class Sample extends LightningElement {
  lastChange = "";

  handleChange(event) {
    const from = event.detail.from;
    const to = event.detail.to;

    this.lastChange = `Value changed from ${from} to ${to}`;
  }
}
