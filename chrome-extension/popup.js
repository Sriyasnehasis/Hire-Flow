document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("resumeUpload");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const applyBtn = document.getElementById("applyBtn");
  const resultDiv = document.getElementById("result");
  const uploadStatus = document.getElementById("uploadStatus");
  const userIdInput = document.getElementById("userIdInput");
  const saveUserBtn = document.getElementById("saveUserBtn");
  const userStatus = document.getElementById("userStatus");
  const apiBaseInput = document.getElementById("apiBaseInput");
  const saveApiBtn = document.getElementById("saveApiBtn");
  const apiStatus = document.getElementById("apiStatus");

  // Store current job data for apply flow
  let currentJobData = null;

  // New element for showing the mini-score card
  const analysisResultCard = document.getElementById("analysisResult");

  const DEFAULT_API_BASE = "http://localhost:8000/api/v1";

  const normalizeApiBase = (value) => {
    const normalized = (value || "").trim().replace(/\/$/, "");
    return normalized || DEFAULT_API_BASE;
  };

  const getApiBase = async () => {
    const data = await chrome.storage.local.get(["apiBase"]);
    return normalizeApiBase(data.apiBase);
  };

  const saveApiBase = async () => {
    const value = normalizeApiBase(apiBaseInput.value);
    await chrome.storage.local.set({ apiBase: value });
    apiBaseInput.value = value;
    apiStatus.innerText = `API base set to ${value}`;
    apiStatus.style.color = "#1e8e3e";
  };

  const getActiveUserId = async () => {
    const data = await chrome.storage.local.get(["activeUserId"]);
    const value = Number(data.activeUserId);
    return Number.isInteger(value) && value > 0 ? value : 1;
  };

  const saveActiveUserId = async () => {
    const value = Number(userIdInput.value);
    if (!Number.isInteger(value) || value <= 0) {
      userStatus.innerText = "Please enter a valid positive User ID.";
      userStatus.style.color = "#d93025";
      return;
    }

    await chrome.storage.local.set({ activeUserId: value });
    userStatus.innerText = `Active User ID set to ${value}`;
    userStatus.style.color = "#1e8e3e";
  };

  const initializeUserId = async () => {
    const userId = await getActiveUserId();
    userIdInput.value = String(userId);
    userStatus.innerText = `Using User ID ${userId}`;
    userStatus.style.color = "#555";
  };

  const initializeApiBase = async () => {
    const apiBase = await getApiBase();
    apiBaseInput.value = apiBase;
    apiStatus.innerText = `Using API base ${apiBase}`;
    apiStatus.style.color = "#555";
  };

  // --- 1. ANALYSIS & SAVE LOGIC ---
  const performAnalysis = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeUserId = await getActiveUserId();
    const apiBase = await getApiBase();

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
        const userRes = await fetch(`${apiBase}/auth/user/${activeUserId}`);
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
        const saveRes = await fetch(`${apiBase}/jobs/save-job`, {
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
        const aiRes = await fetch(`${apiBase}/jobs/analyze-resume`, {
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
          
          // D. Show the Beautiful Score Card
          analysisResultCard.classList.add('show');
          
          const score = Math.round(result.score);
          const matchedCount = result.matched_skills ? result.matched_skills.length : 0;
          const gapCount = result.missing_skills ? result.missing_skills.length : 0;
          
          // Update score display
          document.getElementById('scoreValue').innerText = score + '%';
          document.getElementById('scoreFill').style.width = score + '%';
          document.getElementById('matchedCount').innerText = matchedCount;
          document.getElementById('gapCount').innerText = gapCount;
          
          // Add feedback
          const feedbackElement = document.createElement('div');
          feedbackElement.style.marginTop = '12px';
          feedbackElement.style.padding = '10px 8px';
          feedbackElement.style.background = '#F5F5F5';
          feedbackElement.style.borderRadius = '6px';
          feedbackElement.style.fontSize = '12px';
          feedbackElement.style.lineHeight = '1.5';
          feedbackElement.style.color = '#4B5563';
          feedbackElement.innerHTML = `<strong>Feedback:</strong> ${result.feedback || 'View dashboard for full analysis.'}`;
          
          if (!analysisResultCard.querySelector('[style*="marginTop: 12px"]')) {
            analysisResultCard.appendChild(feedbackElement);
          }
          
          // Store job data and show apply button
          currentJobData = response;
          applyBtn.style.display = 'block';
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
        const activeUserId = await getActiveUserId();
        const apiBase = await getApiBase();
        const res = await fetch(`${apiBase}/auth/user/${activeUserId}/resume`, {
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

  // --- 3. APPLY TO JOB LOGIC ---
  if (applyBtn) {
    applyBtn.onclick = async () => {
      if (!currentJobData) {
        alert("No job data available. Please analyze a job first.");
        return;
      }

      applyBtn.disabled = true;
      applyBtn.innerText = "⏳ Applying...";

      try {
        const activeUserId = await getActiveUserId();
        const apiBase = await getApiBase();
        const token = await chrome.storage.local.get(["authToken"]);

        const applyRes = await fetch(`${apiBase}/jobs/save-and-apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.authToken || ""}`
          },
          body: JSON.stringify({
            title: currentJobData.title,
            company: currentJobData.company,
            location: currentJobData.location,
            description: currentJobData.description,
            contact_email: currentJobData.contact_email,
            is_scraped: true
          })
        });

        if (applyRes.ok) {
          const result = await applyRes.json();
          resultDiv.innerText = `✅ Applied to ${result.company}! Match: ${result.match_score}%`;
          resultDiv.style.color = "#10B981";
          applyBtn.innerText = "✅ Applied!";
          applyBtn.style.opacity = "0.6";
          applyBtn.disabled = true;
        } else {
          const error = await applyRes.json();
          resultDiv.innerText = `❌ Error: ${error.detail || 'Could not apply'}`;
          resultDiv.style.color = "#EF4444";
          applyBtn.disabled = false;
          applyBtn.innerText = "✅ Apply to This Job";
        }
      } catch (err) {
        resultDiv.innerText = "❌ Connection error. Is the API running?";
        resultDiv.style.color = "#EF4444";
        applyBtn.disabled = false;
        applyBtn.innerText = "✅ Apply to This Job";
      }
    };
  }

  // --- 4. DASHBOARD NAVIGATION ---
  if (dashboardBtn) {
    dashboardBtn.onclick = () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
    };
  }

  if (saveUserBtn) {
    saveUserBtn.onclick = saveActiveUserId;
  }

  if (saveApiBtn) {
    saveApiBtn.onclick = saveApiBase;
  }

  // Assign the main action
  if (analyzeBtn) analyzeBtn.onclick = performAnalysis;
  initializeUserId();
  initializeApiBase();
});