// This script runs directly on LinkedIn pages
console.log("ExtractResume AI: Content Script Active");

function getLinkedInJobData() {
    // 1. Extract Job Title
    const title = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText.trim() || 
                  document.querySelector(".t-24.t-bold")?.innerText.trim() || "Unknown Title";

    // 2. Extract Company Name
    const company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText.trim() || 
                    document.querySelector(".jobs-unified-top-card__company-name")?.innerText.trim() || "Unknown Company";

    // 3. Extract Location
    const location = document.querySelector(".job-details-jobs-unified-top-card__bullet")?.innerText.trim() || 
                     document.querySelector(".jobs-unified-top-card__bullet")?.innerText.trim() || "Remote/Not Specified";

    // 4. Extract Full Job Description
    const description = document.querySelector("#job-details")?.innerText.trim() || 
                        document.querySelector(".jobs-description__container")?.innerText.trim() || "";

    // 5. Logic to find Email inside the JD (Key-Value extraction)
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const emailsFound = description.match(emailRegex);
    const contactEmail = emailsFound ? emailsFound[0] : null;

    // 6. Return as a clean JSON-like object
    const jobData = {
        title: title,
        company: company,
        location: location,
        description: description,
        contact_email: contactEmail,
        source: "LinkedIn",
        scraped_at: new Date().toISOString()
    };

    console.log("Extracted Data Object:", jobData);
    return jobData;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getJobData") {
        const data = getLinkedInJobData();
        sendResponse(data);
    }
    return true;
});