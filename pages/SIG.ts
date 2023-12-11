import { Locator, Page, expect } from "@playwright/test";
import { JobInfo } from "../types/JobInfo";

class SIG {
    page: Page;
    amountOfPages: number;

    elements: {
        jobResults: Locator | null;
        paginationButtons: Locator | null;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            jobResults: this.page.locator(".jobs-list-item"),
            paginationButtons: this.page.locator("[aria-label^='Page ']"),
        };
    }

    async goToPage() {
        await this.page.goto(`https://careers.sig.com/sig-sydney-jobs/`);
        await expect(this.page).toHaveURL(`https://careers.sig.com/sig-sydney-jobs/`);
    }

    async filterToStudents() {
        await expect(this.page.getByRole("button", {name: "Job Type"})).toBeVisible();
        await this.page.getByRole("button", {name: "Job Type"}).click();
        await expect(this.page.getByText("Recent Graduate/Student")).toBeVisible();
        await this.page.getByText("Recent Graduate/Student").click();
        await expect(this.page.locator('span:has-text("Recent Graduate/Student").facet-tag')).toBeVisible();
    }

    async getPageLength() {
        if (this.elements.paginationButtons === null) {
            return 1;
        }

        const pageLength = await this.elements.paginationButtons.count();
        this.amountOfPages = pageLength;
        //-1 to exclude the "next page button"
        return pageLength;
    }

    async getAllJobsThisPage() {
        if (this.elements.jobResults === null) {
            throw new Error("Job results not initialised");
        }

        const jobResults = this.elements.jobResults;
        const jobInfo: JobInfo[] = [];

        for (let i = 0 ; i < await jobResults.count(); i++) {
            let position:string|undefined|null= await jobResults.nth(i).locator(".job-title").textContent();
            position = position?.trim().replace(/^\s+|\s+$/g, "");
            if (position === null || position === undefined) {
                throw new Error("Job title not found");
            }

            let location:string|undefined|null= await jobResults.nth(i).locator(".job-location").textContent();
            location = location?.trim().replace(/^\s+|\s+$/g, "");
            location = location?.replace(/\n/g, '');
            if (location === null || location === undefined) {
                throw new Error("Job location not found");
            }

            const link = await jobResults.nth(i).getByRole("link").getAttribute("href");

            jobInfo.push({
                title: position,
                location: location,
                link: link,
            }) 
        }   
        return jobInfo;
    }

    async getAllPagesJobs() {
        const res: JobInfo[] = [];

        await this.page.waitForTimeout(2000)
        const pageLength = await this.getPageLength();

        const jobs = await this.getAllJobsThisPage();
        res.push(...jobs);

        if (pageLength === 1) {
            return res;
        }

        for (let i = 1; i < pageLength; i++) {
            await this.goToPageNumber(i + 1);
            const jobs = await this.getAllJobsThisPage();
            res.push(...jobs);
        }

        return res;
    }

    async goToPageNumber(pageNumber: number) {
        if (this.elements.paginationButtons === null || this.amountOfPages === 1) {
            return;
        }

        if (pageNumber < 0 || pageNumber > this.amountOfPages) {
            throw new Error("Page number out of bounds");
        }

        await this.page
            .locator(`[aria-label='Page ${pageNumber}']`)
            .scrollIntoViewIfNeeded();

        await this.page.locator(`[aria-label='Page ${pageNumber}']`).click();

        await expect(
            this.page.locator(`[aria-label='Page ${pageNumber}']`)
        ).toHaveAttribute("aria-current", "true");
    }
}

export default SIG;
