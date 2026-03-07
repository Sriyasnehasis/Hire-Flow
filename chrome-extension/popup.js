document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("resumeUpload");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const resultDiv = document.getElementById("result");
  const uploadStatus = document.getElementById("uploadStatus");

  // --- 1. ANALYSIS & SAVE LOGIC ---
  const performAnalysis = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Ensure we are actually on LinkedIn
    if (!tab.url || !tab.url.includes("linkedin.com")) {
      resultDiv.innerText = "Please open a LinkedIn job page.";
      return;
    }

    resultDiv.innerText = "Extracting job data...";

    chrome.tabs.sendMessage(tab.id, { action: "getJobData" }, async (response) => {
      if (chrome.runtime.lastError || !response) {
        resultDiv.innerText = "Error: Refresh LinkedIn and try again.";
        return;
      }

      try {
        // Fetch User Profile to get resume text
        const userRes = await fetch("http://localhost:8000/auth/user/1");
        const userData = await userRes.json();

        if (!userData.resume_text) {
          resultDiv.innerText = "Upload a resume first!";
          return;
        }

        resultDiv.innerText = "Saving & Analyzing...";

        // 1. SAVE to PostgreSQL (Key-Value Storage)
        await fetch("http://localhost:8000/jobs/save-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: response.title,
            company: response.company,
            location: response.location,
            description: response.description,
            contact_email: response.contact_email,
            is_scraped: true
          })
        });

        // 2. GET AI Match Score
        const aiRes = await fetch("http://localhost:8000/jobs/analyze-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume_text: userData.resume_text,
            job_description: response.description
          })
        });

        let result = await aiRes.json();
        if (typeof result === 'string') result = JSON.parse(result);

        if (result && result.score !== undefined) {
          resultDiv.innerHTML = `
            <div style="margin-top:10px; border: 1px solid #ddd; padding: 10px; border-radius: 4px; background: #f9f9f9;">
              <strong style="color: #0073b1;">ATS Match: ${result.score}%</strong><br>
              <span style="font-size:11px; color:#28a745;">Saved: ${response.company || 'Job'}</span>
              <p style="font-size:11px; color:#555; margin-top:5px;">${result.feedback || ""}</p>
            </div>
          `;
        }
      } catch (error) {
        console.error("Popup Error:", error);
        resultDiv.innerText = "Backend offline. Check FastAPI.";
      }
    });
  };

  // --- 2. BUTTON ASSIGNMENTS ---
  if (analyzeBtn) analyzeBtn.onclick = performAnalysis;

  if (uploadBtn && fileInput) {
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploadStatus.style.color = "blue";
      uploadStatus.innerText = "Uploading...";

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/auth/user/1/resume", {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          uploadStatus.style.color = "green";
          uploadStatus.innerText = "✅ Upload Success!";
          performAnalysis(); // Re-analyze automatically
        } else {
          uploadStatus.innerText = "❌ Upload failed.";
        }
      } catch (err) {
        uploadStatus.innerText = "Connection error.";
      }
    };
  }

  if (dashboardBtn) {
    dashboardBtn.onclick = () => {
      chrome.tabs.create({ url: 'dashboard.html' });
    };
  }
});