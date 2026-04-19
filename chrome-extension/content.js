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
                  document.querySelector(".t-24.t-bold")?.innerText.trim() || 
                  document.querySelector("[data-job-title]")?.innerText.trim() || "Unknown Title";

    // 2. Extract Company Name
    const company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText.trim() || 
                    document.querySelector(".jobs-unified-top-card__company-name")?.innerText.trim() || 
                    document.querySelector("a[data-company-id]")?.innerText.trim() || "Unknown Company";

    // 3. Extract Location
    const location = document.querySelector(".job-details-jobs-unified-top-card__bullet")?.innerText.trim() || 
                     document.querySelector(".jobs-unified-top-card__bullet")?.innerText.trim() || 
                     document.querySelector("[data-job-location]")?.innerText.trim() || "Remote/Not Specified";

    // 4. Extract Full Job Description (Required for AI skill gap analysis)
    const description = document.querySelector("#job-details")?.innerText.trim() || 
                        document.querySelector(".jobs-description__container")?.innerText.trim() || 
                        document.querySelector(".show-more-less-html__markup")?.innerText.trim() || 
                        document.querySelector("[class*='description']")?.innerText.trim() || "";

    // 5. Extract Contact Email using Regex
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const emailsFound = description.match(emailRegex);
    const contactEmail = emailsFound ? emailsFound[0] : null;

    // 6. Get current URL for job ID/reference
    const jobUrl = window.location.href;
    const jobId = new URL(jobUrl).pathname.split('/').pop() || null;

    // 7. Construct the JSON object for the FastAPI backend
    const jobData = {
        title: title,
        company: company,
        location: location,
        description: description,
        contact_email: contactEmail,
        job_url: jobUrl,
        job_id: jobId,
        is_scraped: true  // Crucial: Matches your updated Pydantic schema in jobs.py
    };

    console.log("Extracted Data for Backend:", jobData);
    return jobData;
}

/**
 * Injects the ExtractResume button into LinkedIn job page
 */
function injectAnalyzeButton() {
    // Don't inject if already exists
    if (document.getElementById('extract-resume-btn')) return;
    
    // Find the right place to inject (usually the top of job details)
    const topCard = document.querySelector(".job-details-jobs-unified-top-card");
    const jobDetails = document.querySelector(".jobs-details-top-card__saved-button-container");
    
    if (!topCard && !jobDetails) {
        console.log("Could not find LinkedIn job container");
        return;
    }
    
    // Create beautiful button
    const button = document.createElement('button');
    button.id = 'extract-resume-btn';
    button.innerHTML = '⚡ Analyze with ExtractResume AI';
    button.style.cssText = `
        background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        margin: 12px 0;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.2)';
    });
    
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const jobData = getLinkedInJobData();
        
        // Open extension popup
        chrome.runtime.sendMessage({
            action: "jobDataExtracted",
            jobData: jobData
        }, response => {
            if (response) {
                console.log("Job data sent to popup:", response);
            }
        });
    });
    
    // Inject the button
    if (jobDetails) {
        jobDetails.parentElement.insertBefore(button, jobDetails);
    } else if (topCard) {
        topCard.appendChild(button);
    }
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

/**
 * Auto-inject button when page loads
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAnalyzeButton);
} else {
    injectAnalyzeButton();
}

// Re-inject if page content changes (LinkedIn uses dynamic loading)
const observer = new MutationObserver(() => {
    if (!document.getElementById('extract-resume-btn')) {
        injectAnalyzeButton();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("ExtractResume AI: Content script loaded and ready!");