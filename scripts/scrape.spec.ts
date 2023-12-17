import { test, expect, Page } from "@playwright/test";
import POM from "../pages/pom";
import fs from "fs";
import { JobInfo } from "../types/JobInfo";

let positionName = "Software Engineer";
let onlyInterns = true;
let pom:POM;
let page:Page;

let results:JobInfo[];
//npx playwright test --grep @all
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
    fs.writeFile("results.txt", jsonString, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
        console.log("Results saved.");
    });
});

test("scrape IMC @IMC @all", async () => {
    const imc = pom.getImc();
    await imc.goToPage();
    await imc.fillSearchBar(positionName);
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

test("scrape citadel @Citadel @all", async () => {
    const citadel = pom.getCitadel();
    await citadel.goToPage();
    const res = await citadel.getAllJobs();
    results = results.concat(res);
});

test("scrape sig @SIG @all", async () => {
    const sig = pom.getSIG();
    await sig.goToPage();
    await sig.filterToStudents();
    const res = await sig.getAllPagesJobs();
    results = results.concat(res);
});

test("scrape atlassian @Atlassian @all", async () => {
    const atlassian = pom.getAtlassian();
    await atlassian.goToPage(positionName);
    const res = await atlassian.getAllJobs();
    results = results.concat(res);
});

// test("scrape google", async () => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape amazon", async () => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape canva", async () => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape slack", async () => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape seek", async () => {
//     await page.goto("https://playwright.dev/");
// });

// test("scrape microsoft", async () => {
//     await page.goto("https://playwright.dev/");
// });
