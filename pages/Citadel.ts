import { Locator, Page, expect } from "@playwright/test";
import { JobInfo } from "../types/JobInfo";

class Citadel {
    page: Page;

    elements: {
        jobResults: Locator | null;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            jobResults: this.page.locator("#careers-table-filter-wrap").getByRole("row"),
        };
    }

    async goToPage() {
        await this.page.goto(`https://www.citadel.com/careers/open-opportunities/students/`);
        await expect(this.page).toHaveURL(`https://www.citadel.com/careers/open-opportunities/students/`);
    }

    async getAllJobs() {
        if (this.elements.jobResults === null) {
            throw new Error("Job results not initialised");
        }

        await this.page.waitForTimeout(2000);

        const jobResults = this.elements.jobResults;
        const jobInfo: JobInfo[] = [];

        for (let i = 0 ; i < await jobResults.count(); i++) {
            const position = await jobResults.nth(i).locator(".heading-inner").textContent();
            const city = await jobResults.nth(i).locator("span").last().textContent();
            const link = await jobResults.nth(i).locator(".heading-inner").getByRole("link").getAttribute("href");

            jobInfo.push({
                title: position,
                location: city,
                link: link,
            }) 
        }   
        return jobInfo;
        }
}

export default Citadel;
