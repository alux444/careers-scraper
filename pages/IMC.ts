import { Locator, Page, expect } from "@playwright/test";

class IMC {
    page: Page;
    amountOfPages: number;
    currentPage: number;

    elements: {
        searchBar: Locator | null;
        searchButton: Locator | null;
        jobResults: Locator | null;
        paginationButtons: Locator | null;
    };

    constructor(page: Page) {
        this.page = page;
        this.amountOfPages = 1;
        this.currentPage = -1;
        this.elements = {
            searchBar: this.page.getByRole("textbox", {
                name: "Search for Job title or location",
            }),
            searchButton: this.page.getByRole("button", {
                name: "Search Jobs",
            }),
            jobResults: this.page.locator(".jobs-list-item"),
            paginationButtons: this.page.locator(
                "[data-ph-at-id='pagination-page-number-link']"
            ),
        };
    }

    async goToPage() {
        await this.page.goto("https://careers.imc.com/ap/en/");
        await expect(this.page).toHaveURL("https://careers.imc.com/ap/en/");
    }

    async fillSearchBar(searchTerm: string) {
        if (this.elements.searchBar === null) {
            throw new Error("Search bar not initialised");
        }

        await expect(this.elements.searchBar).toBeVisible();
        await this.elements.searchBar.fill(searchTerm);
        await expect(this.elements.searchBar).toHaveValue(searchTerm);
    }

    async selectOnlyInterns() {
        await this.page.getByRole("button", {name: "Job Type"}).click();
        await expect(this.page.getByRole("checkbox", {name: "Internships"})).toBeVisible();
        const results = await this.page.locator('[data-ph-at-id="facet-results-item"]')
        const internships = await results.locator('span:has-text("Internships")')
        
        await internships.click();
        expect(this.page.locator('[data-ph-at-id="clear-all-facet-tags-text"]')).toBeVisible();
        await this.getPageLength();
        await this.page.waitForTimeout(2000);
    }

    async clickSearchButton() {
        if (this.elements.searchButton === null) {
            throw new Error("Search button not initialised");
        }

        await expect(this.elements.searchButton).toBeVisible();
        await this.elements.searchButton.click();
    }

    async getPageLength() {
        if (this.elements.paginationButtons === null) {
            return 1;
        }

        const pageLength = await this.elements.paginationButtons.count();
        this.amountOfPages = pageLength;
        return pageLength;
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
        ).toHaveAttribute("aria-selected", "true");
    }

    async getAllJobsThisPage() {
        const res: JobInfo[] = [];
        await this.page.waitForLoadState("load");
        const allJobs = this.elements.jobResults;

        if (allJobs === null) {
            throw new Error("Job results not initialised");
        }

        for (let i = 0; i < (await allJobs.count()); i++) {
            const job = allJobs.nth(i);
            const jobInfo = await this.getJobInfo(job);
            res.push(jobInfo);
        }

        return res;
    }

    async getJobInfo(jobResult: Locator) {
        const jobInfo: JobInfo = {
            title: null,
            location: null,
            link: null,
        };

        const title = jobResult.locator("span[role='heading']");
        const location = jobResult.locator(".job-location");
        const link = jobResult.locator("[data-ph-at-id='job-link']");

        let titleText: string | null | undefined = await title.textContent();
        titleText = titleText?.trim().replace(/^\s+|\s+$/g, "");

        if (titleText === null || titleText === undefined) {
            throw new Error("Job title not found");
        }

        jobInfo.title = titleText;
        jobInfo.location = await location.textContent();
        jobInfo.link = await link.getAttribute("href");

        return jobInfo;
    }

    async getAllPagesJobs() {
        const res: JobInfo[] = [];
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
}

type JobInfo = {
    title: string | null;
    location: string | null;
    link: string | null;
};

export default IMC;
