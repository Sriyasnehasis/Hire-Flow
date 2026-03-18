document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("resumeUpload");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const resultDiv = document.getElementById("result");
  const uploadStatus = document.getElementById("uploadStatus");

  // New element for showing the mini-score card
  const analysisResultCard = document.getElementById("analysisResult");

  const API_BASE = "http://localhost:8000";

  // --- 1. ANALYSIS & SAVE LOGIC ---
  const performAnalysis = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Validate LinkedIn URL
    if (!tab.url || !tab.url.includes("linkedin.com/jobs")) {
      resultDiv.innerText = "⚠️ Please open a LinkedIn Job post.";
      resultDiv.style.color = "orange";
      return;
    }

    resultDiv.innerText = "🔍 Extracting job data...";
    analysisResultCard.style.display = "none";

    // Request data from content.js
    chrome.tabs.sendMessage(tab.id, { action: "getJobData" }, async (response) => {
      if (chrome.runtime.lastError || !response) {
        resultDiv.innerText = "❌ Error: Refresh LinkedIn and try again.";
        return;
      }

      try {
        // A. Verify user has a resume uploaded
        const userRes = await fetch(`${API_BASE}/auth/user/1`);
        if (!userRes.ok) {
          resultDiv.innerText = "❌ Backend error. Is the API running?";
          resultDiv.style.color = "red";
          return;
        }
        const userData = await userRes.json();

        if (!userData.resume_text) {
          resultDiv.innerText = "📄 Please upload your resume first!";
          resultDiv.style.color = "orange";
          return;
        }

        resultDiv.innerText = "⚙️ Processing AI Match...";

        // B. Save the Scraped Job to PostgreSQL
        const saveRes = await fetch(`${API_BASE}/jobs/save-job`, {
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

        if (!saveRes.ok) {
          console.error("Save job failed:", await saveRes.text());
          resultDiv.innerText = "⚠️ Could not save job. Backend error.";
          return;
        }

        // C. Trigger AI Analysis
        const aiRes = await fetch(`${API_BASE}/jobs/analyze-resume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume_text: userData.resume_text,
            job_description: response.description
          })
        });

        if (!aiRes.ok) {
          console.error("Analysis failed:", await aiRes.text());
          resultDiv.innerText = "⚠️ Backend offline. Is FastAPI running?";
          return;
        }

        let result = await aiRes.json();
        // Handle double-stringified JSON if the backend sends it that way
        if (typeof result === 'string') result = JSON.parse(result);

        if (result && result.score !== undefined) {
          resultDiv.innerText = "✅ Analysis Complete!";
          
          // D. Show the Mini-Score Card
          analysisResultCard.style.display = "block";
          analysisResultCard.innerHTML = `
            <div style="text-align:center;">
              <span style="font-size: 24px; font-weight: bold; color: #0073b1;">${result.score}%</span>
              <div style="font-size: 12px; font-weight: 600; color: #555;">ATS MATCH SCORE</div>
            </div>
            <div style="margin-top: 8px; border-top: 1px solid #eee; padding-top: 8px;">
              <small><strong>Insights:</strong> ${result.feedback || "Check the dashboard for details."}</small>
            </div>
          `;
        }
      } catch (error) {
        console.error("Popup Error:", error);
        resultDiv.innerText = "🔴 Backend offline. Is FastAPI running?";
      }
    });
  };

  // --- 2. RESUME UPLOAD LOGIC ---
  if (uploadBtn && fileInput) {
    uploadBtn.onclick = () => fileInput.click();
    
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploadStatus.style.color = "#0073b1";
      uploadStatus.innerText = "⏳ Uploading resume...";

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${API_BASE}/auth/user/1/resume`, {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          uploadStatus.style.color = "green";
          uploadStatus.innerText = "✅ Resume Synced!";
          performAnalysis(); // Automatically start analysis with the new resume
        } else {
          uploadStatus.innerText = "❌ Upload failed.";
        }
      } catch (err) {
        uploadStatus.innerText = "❌ Connection Error.";
      }
    };
  }

  // --- 3. DASHBOARD NAVIGATION ---
  if (dashboardBtn) {
    dashboardBtn.onclick = () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
    };
  }

  // Assign the main action
  if (analyzeBtn) analyzeBtn.onclick = performAnalysis;
});