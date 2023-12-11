import { Locator, Page, expect } from "@playwright/test";
import { JobInfo } from "../types/JobInfo";

class Optiver {
    page: Page;

    elements: {
        searchBar: Locator | null;
        jobResults: Locator | null;
        moreButton: Locator | null;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            searchBar: this.page.getByRole("textbox", {
                name: "for example: Trader",
            }),
            jobResults: this.page.locator(".item-posttype-job"),
            moreButton: this.page.getByRole("link", {name:"Load more"}),
        };
    }

    async goToPage() {
        await this.page.goto("https://optiver.com/working-at-optiver/career-opportunities/");
        await expect(this.page).toHaveURL("https://optiver.com/working-at-optiver/career-opportunities/");
    }

    async fillSearchBar(searchTerm: string) {
        if (this.elements.searchBar === null) {
            throw new Error("Search bar not initialised");
        }

        await expect(this.elements.searchBar).toBeVisible();
        await this.elements.searchBar.fill(searchTerm);
        await expect(this.elements.searchBar).toHaveValue(searchTerm);
    }

    async switchToJobType(jobType:JobType) {
        const allLevels = this.page.getByRole("combobox", {name: "All Levels"});
        const internship = this.page.getByRole("combobox", {name: "Internship"});
        const studentAndGraduate = this.page.getByRole("combobox", {name: "Student and Graduate"});
        const experienced = this.page.getByRole("combobox", {name: "Experienced"});

        await expect(allLevels.or(internship).or(studentAndGraduate).or(experienced)).toBeVisible();

        if (await allLevels.isVisible()) {
            await allLevels.click();
        }

        if (await internship.isVisible()) {
            await internship.click();
        }

        if (await studentAndGraduate.isVisible()) {
            await studentAndGraduate.click();
        }

        if (await experienced.isVisible()) {
            await experienced.click();
        }

        await this.page.getByRole("searchbox", {name:"search"}).fill(jobType);
        await this.page.getByRole("searchbox", {name:"search"}).press("Enter");
    }

    async clickLoadMore() {
        if (this.elements.moreButton === null) {
            throw new Error("More button not initialised");
        }

        let moreIsVisible = await this.elements.moreButton.isVisible();

        while (moreIsVisible) {
            await this.elements.moreButton.click();
            await this.page.waitForTimeout(3000);
            moreIsVisible = await this.elements.moreButton.isVisible();
        }
    }

    async getAllJobs() {
        if (this.elements.jobResults === null) {
            throw new Error("Job results not initialised");
        }

        await this.page.waitForTimeout(2000);
        await this.clickLoadMore();

        const jobResults = await this.elements.jobResults;
        const jobInfo: JobInfo[] = [];

        for (let i = 0 ; i < await jobResults.count(); i++) {
            let title:string|undefined|null= await jobResults.nth(i).getByRole("heading").textContent();
            title = title?.trim().replace(/^\s+|\s+$/g, "");
            if (title === null || title === undefined) {
                throw new Error("Job title not found");
            }

            let location:string|undefined|null= await jobResults.nth(i).locator(".text-s").textContent();
            location = location?.trim().replace(/^\s+|\s+$/g, "");
            if (location === null || location === undefined) {
                throw new Error("Job location not found");
            }

            const link = await jobResults.nth(i).getByRole("heading").getByRole("link").getAttribute("href")

            jobInfo.push({
                title,
                location,
                link,
            });
        }

        console.log(jobInfo);

        return jobInfo;
    }
}

type JobType = "Internship" | "Student and Graduate" | "Experienced" | "All Levels";

export default Optiver;
