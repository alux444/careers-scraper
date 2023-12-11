import { Page } from "@playwright/test";
import IMC from "./IMC";
import Optiver from "./Optiver";
import JaneStreet from "./JaneStreet";

class POM {
    Imc: IMC;
    Optiver: Optiver;
    JaneStreet: JaneStreet;

    constructor(page: Page) {
        this.Imc = new IMC(page);
        this.Optiver = new Optiver(page);
        this.JaneStreet = new JaneStreet(page);
    }

    getImc() {
        return this.Imc;
    }

    getOptiver() {
        return this.Optiver;
    }

    getJaneStreet() {
        return this.JaneStreet;
    }
}

export default POM;
