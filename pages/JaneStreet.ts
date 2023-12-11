import { Locator, Page, expect } from "@playwright/test";
import { JobInfo } from "../types/JobInfo";

class JaneStreet {
    page: Page;

    elements: {
        jobResults: Locator | null;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            jobResults: this.page.locator(".jobs-container").getByRole("link"),
        };
    }

    async goToPage(jobType:JobType) {
        let type;

        switch (jobType) {
            case "Internship":
                type = "internship";
                break;
            case "Graduate":
                type = "full-time-new-grad"
                break;
            default:
                type = "students-and-new-grads";
        }

        await this.page.goto(`https://www.janestreet.com/join-jane-street/open-roles/?type=${type}&location=hong-kong`);
        await expect(this.page).toHaveURL(`https://www.janestreet.com/join-jane-street/open-roles/?type=${type}&location=hong-kong`);
    }

    async getAllJobs() {
        if (this.elements.jobResults === null) {
            throw new Error("Job results not initialised");
        }

        await this.page.waitForTimeout(2000);

        const jobResults = await this.elements.jobResults;
        const jobInfo: JobInfo[] = [];

        for (let i = 0 ; i < await jobResults.count(); i++) {
            const position = await jobResults.nth(i).locator(".position").textContent();
            const city = await jobResults.nth(i).locator(".city").textContent();
            const type = await jobResults.nth(i).locator(".type").textContent();
            const duration = await jobResults.nth(i).locator(".duration").textContent();
            const link = await jobResults.nth(i).getAttribute("href");

            jobInfo.push({
                title: position + " " + type,
                location: city + " " + duration,
                link: "https://www.janestreet.com" + link,
            }) 
        }   
        return jobInfo;
        }
}

type JobType = "Internship" | "Graduate" | string;

export default JaneStreet;
