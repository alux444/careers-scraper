import { Page } from "@playwright/test";
import IMC from "./IMC";
import Optiver from "./Optiver";

class POM {
    Imc: IMC;
    Optiver: Optiver;

    constructor(page: Page) {
        this.Imc = new IMC(page);
        this.Optiver = new Optiver(page);
    }

    getImc() {
        return this.Imc;
    }

    getOptiver() {
        return this.Optiver;
    }
}

export default POM;
