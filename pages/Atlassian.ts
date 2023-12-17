import { Locator, Page, expect } from "@playwright/test";
import { JobInfo } from "../types/JobInfo";

class Atlassian {
    page: Page;

    elements: {
        jobTables: Locator | null;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            jobTables: this.page.locator(".careers").getByRole("table")
        };
    }

    async goToPage(jobName:string) {
        const jobUrl = jobName.replace(" ", "%20");
        await this.page.goto(`https://www.atlassian.com/company/careers/all-jobs?team=&location=New%20Zealand%2CAustralia&search=${jobUrl}`);
        await expect(this.page.getByRole("heading", {name:"Browse jobs"})).toBeVisible();
    }

    async getAllJobsForTable(table: Locator | null) {
        if (table === null) {
            throw new Error("Job results not initialised");
        }

        const jobResults = table.getByRole("row");
        const jobInfo: JobInfo[] = [];

        //ignore 1st row (headers)
        for (let i = 1 ; i < await jobResults.count(); i++) {
            const linkAndPosition = jobResults.nth(i).getByRole("link");
            const locationCell = jobResults.nth(i).getByRole("cell").nth(1);

            const position = await linkAndPosition.textContent();
            const city = await locationCell.textContent();
            const link = await linkAndPosition.getAttribute("href");

            jobInfo.push({
                title: position,
                location: city,
                link: "https://www.atlassian.com/" + link,
            }) 
        }   

        return jobInfo;
    }

    async getAllJobs() {
        const jobTables = this.elements.jobTables;
        let res:JobInfo[] = [];

        if (!jobTables) {
            return [];
        }

        for (let i = 0 ; i < await jobTables.count(); i++) {
            const thisTable = await this.getAllJobsForTable(jobTables.nth(i));
            res = res.concat(thisTable);
        }

        return res;
    }
}

export default Atlassian;
