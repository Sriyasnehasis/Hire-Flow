// content.js - Runs directly in the LinkedIn browser tab
console.log("ExtractResume AI: Content Script Active");

/**
 * Scrapes job information from the active LinkedIn Job Page.
 * Uses multiple selectors to ensure stability against UI updates.
 */
function getLinkedInJobData() {
    // 1. Extract Job Title (Primary and Fallback selectors)
    const title = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText.trim() || 
                  document.querySelector("h1.t-24")?.innerText.trim() || 
                  document.querySelector(".t-24.t-bold")?.innerText.trim() || "Unknown Title";

    // 2. Extract Company Name
    const company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText.trim() || 
                    document.querySelector(".jobs-unified-top-card__company-name")?.innerText.trim() || 
                    document.querySelector(".app-shared-outline")?.innerText.trim() || "Unknown Company";

    // 3. Extract Location
    const location = document.querySelector(".job-details-jobs-unified-top-card__bullet")?.innerText.trim() || 
                     document.querySelector(".jobs-unified-top-card__bullet")?.innerText.trim() || "Remote/Not Specified";

    // 4. Extract Full Job Description (Required for AI skill gap analysis)
    const description = document.querySelector("#job-details")?.innerText.trim() || 
                        document.querySelector(".jobs-description__container")?.innerText.trim() || 
                        document.querySelector(".show-more-less-html__markup")?.innerText.trim() || "";

    // 5. Extract Contact Email using Regex
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const emailsFound = description.match(emailRegex);
    const contactEmail = emailsFound ? emailsFound[0] : null;

    // 6. Construct the JSON object for the FastAPI backend
    const jobData = {
        title: title,
        company: company,
        location: location,
        description: description,
        contact_email: contactEmail,
        is_scraped: true  // Crucial: Matches your updated Pydantic schema in jobs.py
    };

    console.log("Extracted Data for Backend:", jobData);
    return jobData;
}

/**
 * Message Listener: Waits for "getJobData" signal from popup.js
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getJobData") {
        const extractedData = getLinkedInJobData();
        sendResponse(extractedData);
    }
    // Return true to keep the message channel open for async responses
    return true;
});