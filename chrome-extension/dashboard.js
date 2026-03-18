document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT UI ELEMENTS
    const matchedContainer = document.getElementById('matchedSkills');
    const missingContainer = document.getElementById('missingSkills');
    const jobListContainer = document.getElementById('jobMatches'); 
    const userNameSpan = document.getElementById('userName');
    const aiFeedbackBox = document.getElementById('aiFeedback');
    const applyBtn = document.getElementById('applyBtn');
    const domainSelect = document.getElementById('domainSelect');
    const status = document.getElementById('status');

    async function initDashboard() {
        const userId = 1; // Default User ID for local development
        const API_BASE = "http://localhost:8000";
        
        try {
            // STEP 1: Fetch User Info (for the greeting)
            const userRes = await fetch(`${API_BASE}/auth/user/${userId}`);
            if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
            const userData = await userRes.json();
            if (userData.username) userNameSpan.innerText = userData.username;

            // STEP 2: Fetch Detailed Skill & Gap Analysis
            // This pulls from the new /jobs/user-analysis/ endpoint we created
            const analysisRes = await fetch(`${API_BASE}/jobs/user-analysis/${userId}`);
            if (!analysisRes.ok) {
                const errText = await analysisRes.text();
                throw new Error(`Analysis failed (${analysisRes.status}): ${errText.substring(0, 100)}`);
            }
            const data = await analysisRes.json();

            // STEP 3: Render the Professional Radar Chart
            const ctx = document.getElementById('skillsChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: Object.keys(data.chart_data || {}),
                    datasets: [{
                        label: 'Profile Strength (%)',
                        data: Object.values(data.chart_data || {}),
                        backgroundColor: 'rgba(0, 115, 177, 0.2)', // LinkedIn Blue Transparent
                        borderColor: '#0073b1', // LinkedIn Blue Solid
                        borderWidth: 2,
                        pointBackgroundColor: '#0073b1',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: { 
                            beginAtZero: true, 
                            max: 100, 
                            ticks: { display: false, stepSize: 20 },
                            grid: { color: '#e0e0e0' }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });

            // STEP 4: Render Skill Badges (Matched vs Missing)
            aiFeedbackBox.innerText = data.feedback || "Analysis complete.";

            matchedContainer.innerHTML = data.matched_skills.length > 0 
                ? data.matched_skills.map(s => `<span class="pill matched">${s.toUpperCase()}</span>`).join('')
                : "<em>No specific matches found for this role.</em>";

            missingContainer.innerHTML = data.missing_skills.length > 0 
                ? data.missing_skills.map(s => `<span class="pill missing">${s.toUpperCase()}</span>`).join('')
                : "<strong>Profile perfectly matches this JD! 🚀</strong>";

            // STEP 5: Fetch Job Recommendations List
            const recRes = await fetch(`${API_BASE}/jobs/recommendations/${userId}`);
            if (!recRes.ok) {
                const errText = await recRes.text();
                throw new Error(`Recommendations failed (${recRes.status}): ${errText.substring(0, 100)}`);
            }
            const recData = await recRes.json();
            
            // Handle both array and object response formats
            const recommendations = Array.isArray(recData) ? recData : (recData.recommendations || []);

            if (!recommendations || recommendations.length === 0) {
                jobListContainer.innerHTML = "<p style='color:#666;'>📌 Use the extension on LinkedIn to start scraping jobs and matching!</p>";
            } else {
                jobListContainer.innerHTML = recommendations.map(job => `
                    <div class="job-card">
                        <div class="job-info">
                            <h4>${job.title}</h4>
                            <p>🏢 <strong>${job.company}</strong></p>
                            <p><small>Missing ${job.missing_count} skills required for this role.</small></p>
                        </div>
                        <div style="text-align: right;">
                            <div class="score-badge">${job.score}% Match</div>
                            <button class="apply-btn" style="margin-top:5px; background:var(--primary); color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" 
                                onclick="window.location.href='mailto:recruiter@example.com?subject=Application for ${job.title}'">
                                Apply
                            </button>
                        </div>
                    </div>
                `).join('');
            }

        } catch (err) {
            console.error("Dashboard Load Error:", err);
            // Show user-friendly error message
            const errorMsg = err.message || "Unknown error occurred";
            aiFeedbackBox.innerHTML = `<p style='color:red;'><strong>⚠️ Error:</strong> ${errorMsg}</p><p style='font-size:12px;'>Make sure your FastAPI backend is running: <code>uvicorn main:app --reload</code></p>`;
            
            // Show placeholder for recommendations
            jobListContainer.innerHTML = "<p style='color:#888;'>Unable to load recommendations. Check backend status.</p>";
            matchedContainer.innerHTML = "<p style='font-size:12px; color:#888;'>Waiting for backend...</p>";
            missingContainer.innerHTML = "<p style='font-size:12px; color:#888;'>Waiting for backend...</p>";
        }
    }

    // BULK APPLY LOGIC
    if (applyBtn) {
        applyBtn.onclick = async () => {
            const domain = domainSelect.value;
            status.innerText = `Searching for ${domain} vacancies...`;
            try {
                const res = await fetch(`http://localhost:8000/jobs/bulk-apply?user_id=1&domain=${domain}`, { method: 'POST' });
                const result = await res.json();
                status.innerText = "✅ " + (result.message || "Bulk apply simulation complete!");
                status.style.color = "green";
            } catch (error) {
                status.innerText = "❌ Connection failed.";
                status.style.color = "red";
            }
        };
    }

    initDashboard();
});