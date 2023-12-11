import { test, expect, Page } from "@playwright/test";
import POM from "../pages/pom";
import fs from "fs";
import { JobInfo } from "../types/JobInfo";

let positionName = "Software Engineer";
let areaName = "Sydney";
let onlyInterns = true;
let pom:POM;
let page:Page;

let results:JobInfo[];

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    pom = new POM(page);
    results = [];
})

test.afterAll(async () => {
    // await page.pause();

    if (results === undefined || !results[0]) {
        return;
    }

    const jsonString = JSON.stringify(results, null, 2);
    fs.writeFile("output.txt", jsonString, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
        console.log("Object saved to output.txt");
    });
});

test("scrape IMC @IMC @all", async () => {
    const imc = pom.getImc();
    await imc.goToPage();
    await imc.fillSearchBar(positionName + " " + areaName);
    await imc.clickSearchButton();

    await expect(
        page.getByText("Search results", { exact: true })
    ).toBeVisible();

    if (onlyInterns) {
        await imc.selectOnlyInterns();
    }

    const res = await imc.getAllPagesJobs();
    results = results.concat(res);
});

test("scrape optiver @Optiver @all", async () => {
    const optiver = pom.getOptiver();
    await optiver.goToPage();
    await optiver.fillSearchBar(positionName);

    if (onlyInterns) {
        await optiver.switchToJobType("Internship");
    }

    const res = await optiver.getAllJobs();
    results = results.concat(res);
});

test("scrape jane street @JaneStreet @all", async () => {
    const janeStreet = pom.getJaneStreet();
    let choice = onlyInterns ? "Internship" : "All";
    await janeStreet.goToPage(choice);
    const res = await janeStreet.getAllJobs();
    results = results.concat(res);
});

// test("scrape citadel", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape sig", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape atlassian", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape google", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape amazon", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape canva", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape slack", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape seek", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape microsoft", async ({ page }) => {
//     await page.goto("https://playwright.dev/");
// });
