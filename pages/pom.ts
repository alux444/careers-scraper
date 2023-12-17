import { Page } from "@playwright/test";
import IMC from "./IMC";
import Optiver from "./Optiver";
import JaneStreet from "./JaneStreet";
import Citadel from "./Citadel";
import SIG from "./SIG";
import Atlassian from "./Atlassian";

class POM {
    Imc: IMC;
    Optiver: Optiver;
    JaneStreet: JaneStreet;
    Citadel: Citadel;
    SIG: SIG;
    Atlassian: Atlassian;

    constructor(page: Page) {
        this.Imc = new IMC(page);
        this.Optiver = new Optiver(page);
        this.JaneStreet = new JaneStreet(page);
        this.Citadel = new Citadel(page);
        this.SIG = new SIG(page);
        this.Atlassian = new Atlassian(page);
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

    getSIG() {
        return this.SIG;
    }

    getAtlassian() {
        return this.Atlassian;
    }
}

export default POM;
