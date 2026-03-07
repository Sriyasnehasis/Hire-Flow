document.addEventListener('DOMContentLoaded', () => {
    const missingContainer = document.getElementById('missingSkillsContainer');
    const jobListContainer = document.getElementById('jobMatches'); 
    const userNameSpan = document.getElementById('userName');
    const applyBtn = document.getElementById('applyBtn');
    const domainSelect = document.getElementById('domainSelect');
    const status = document.getElementById('status');

    async function initDashboard() {
        const userId = 1; // Assuming user ID 1
        
        try {
            // 1. Fetch User Info
            const userRes = await fetch(`http://localhost:8000/auth/user/${userId}`);
            const userData = await userRes.json();
            if (userData.username) userNameSpan.innerText = userData.username;

            // 2. Fetch Skill Analytics (Radar Chart Data)
            const skillRes = await fetch(`http://localhost:8000/jobs/user-skills/${userId}`);
            const skillData = await skillRes.json();

            // Render Radar Chart
            const ctx = document.getElementById('skillsChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: Object.keys(skillData.chart_data || {}),
                    datasets: [{
                        label: 'Proficiency (%)',
                        data: Object.values(skillData.chart_data || {}),
                        backgroundColor: 'rgba(0, 115, 177, 0.2)',
                        borderColor: 'rgba(0, 115, 177, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(0, 115, 177, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: { beginAtZero: true, max: 100, ticks: { stepSize: 20, display: false } }
                    }
                }
            });

            // 3. Render Skill Gaps
            const missing = skillData.missing_skills || [];
            missingContainer.innerHTML = missing.length > 0 
                ? missing.map(skill => `<span class="skill-item">${skill.toUpperCase()}</span>`).join('')
                : "<strong>Profile fully optimized! 🚀</strong>";

            // 4. Fetch Recommended Jobs (Using Scraped Data)
            const jobRes = await fetch(`http://localhost:8000/jobs/recommended/${userId}`);
            const jobs = await jobRes.json();

            if (!jobs || jobs.length === 0) {
                jobListContainer.innerHTML = "<p>No jobs analyzed yet. Go to LinkedIn and use the extension to scrape jobs!</p>";
            } else {
                jobListContainer.innerHTML = jobs.map(job => `
                    <div class="job-card">
                        <div class="job-info">
                            <h4>${job.title}</h4>
                            <p>🏢 <strong>${job.company || 'LinkedIn Recruiter'}</strong> | 📍 ${job.location || 'Remote/Global'}</p>
                            <span style="color: var(--success); font-weight:bold;">AI Match Score: ${job.score}%</span>
                        </div>
                        <button class="apply-btn" onclick="window.location.href='mailto:${job.contact_email || ''}?subject=Application for ${job.title}'">
                            Apply Now
                        </button>
                    </div>
                `).join('');
            }

        } catch (err) {
            console.error("Dashboard Load Error:", err);
            jobListContainer.innerHTML = "<p style='color:red;'>Connection Error: Is the FastAPI server running?</p>";
        }
    }

    // Bulk Apply Button Logic
    if (applyBtn) {
        applyBtn.onclick = async () => {
            const domain = domainSelect.value;
            status.innerText = `Submitting applications for ${domain} roles...`;
            try {
                const res = await fetch(`http://localhost:8000/jobs/bulk-apply?user_id=1&domain=${domain}`, { method: 'POST' });
                const result = await res.json();
                status.innerText = "✅ " + (result.message || "Bulk apply initiated!");
                status.style.color = "green";
            } catch (error) {
                status.innerText = "❌ Failed to connect to backend.";
                status.style.color = "red";
            }
        };
    }

    initDashboard();
});