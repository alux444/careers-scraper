import { Page } from "@playwright/test";
import IMC from "./IMC";
import Optiver from "./Optiver";
import JaneStreet from "./JaneStreet";
import Citadel from "./Citadel";

class POM {
    Imc: IMC;
    Optiver: Optiver;
    JaneStreet: JaneStreet;
    Citadel: Citadel;

    constructor(page: Page) {
        this.Imc = new IMC(page);
        this.Optiver = new Optiver(page);
        this.JaneStreet = new JaneStreet(page);
        this.Citadel = new Citadel(page);
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
    
    getCitadel() {
        return this.Citadel;
    }
}

export default POM;
