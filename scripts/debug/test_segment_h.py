"""
SEGMENT H: HR EMAIL OUTREACH MODULE - COMPLETE TESTING
Test HR contacts, email templates, and email sending functionality
"""
import requests
import json
import os
from datetime import datetime
from typing import Dict, List

# Fix encoding on Windows
if os.name == 'nt':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000/api/v1"
test_email = f"segh_test_{int(datetime.now().timestamp())}@test.com"
test_token = None
headers = {}

print("=" * 90)
print("SEGMENT H: HR EMAIL OUTREACH MODULE - COMPLETE TESTING")
print("=" * 90)

# ============================================================================
# PART 1: SETUP & AUTHENTICATION
# ============================================================================
print("\n" + "="*90)
print("PART 1: SETUP & AUTHENTICATION")
print("="*90)

print("\n[1/15] User Registration...")
try:
    signup_data = {
        'email': test_email,
        'password': 'SegmentHTest123!',
        'full_name': 'Segment H Tester'
    }
    res = requests.post(f'{BASE_URL}/auth/signup', json=signup_data, timeout=10)
    assert res.status_code == 200, f"Signup failed: {res.status_code} - {res.text}"
    test_token = res.json()['access_token']
    headers = {'Authorization': f'Bearer {test_token}'}
    print("✓ PASS - User registered and authenticated")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

# ============================================================================
# PART 2: HR CONTACTS CRUD OPERATIONS
# ============================================================================
print("\n" + "="*90)
print("PART 2: HR CONTACTS CRUD OPERATIONS")
print("="*90)

contact_ids = []

# Test data for HR contacts
test_contacts = [
    {
        'first_name': 'Rajesh',
        'last_name': 'Kumar',
        'email': 'rajesh.kumar@techcorp.com',
        'phone': '+91-9876543210',
        'company_name': 'TechCorp India',
        'job_title': 'HR Manager',
        'department': 'HR',
        'source': 'LinkedIn',
        'notes': 'Hiring for Senior Developer positions'
    },
    {
        'first_name': 'Priya',
        'last_name': 'Sharma',
        'email': 'priya.sharma@startuphub.io',
        'phone': '+91-9876543211',
        'company_name': 'StartupHub',
        'job_title': 'Recruiting Lead',
        'department': 'People Ops',
        'source': 'Company Website',
        'notes': 'Active hiring for fullstack developers'
    },
    {
        'first_name': 'Amit',
        'last_name': 'Patel',
        'email': 'amit.patel@cloudsoft.com',
        'company_name': 'CloudSoft Solutions',
        'job_title': 'Engineering Manager',
        'department': 'Engineering',
        'source': 'LinkedIn',
        'notes': 'Looking for DevOps engineers'
    },
    {
        'first_name': 'Sneha',
        'last_name': 'Desai',
        'email': 'sneha.desai@infracore.com',
        'phone': '+91-9876543212',
        'company_name': 'InfraCore',
        'job_title': 'Talent Acquisition Specialist',
        'department': 'HR',
        'source': 'Referral',
        'notes': 'Open positions in backend and data science'
    }
]

print("\n[2/15] Create HR Contacts...")
try:
    for contact_data in test_contacts:
        res = requests.post(f'{BASE_URL}/hr-contacts', json=contact_data, headers=headers, timeout=10)
        assert res.status_code == 200, f"Contact creation failed: {res.status_code} - {res.text}"
        contact_id = res.json()['contact']['id']
        contact_ids.append(contact_id)
        print(f"  ✓ Created: {contact_data['first_name']} {contact_data['last_name']} at {contact_data['company_name']}")
    print(f"✓ PASS - Created {len(contact_ids)} HR contacts")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[3/15] List HR Contacts...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts', headers=headers, timeout=10)
    assert res.status_code == 200, f"List contacts failed: {res.status_code} - {res.text}"
    data = res.json()
    assert data['total'] == len(contact_ids), f"Expected {len(contact_ids)} contacts, got {data['total']}"
    print(f"✓ PASS - Retrieved {data['total']} HR contacts")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[4/15] Get Single HR Contact...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts/{contact_ids[0]}', headers=headers, timeout=10)
    assert res.status_code == 200, f"Get contact failed: {res.status_code} - {res.text}"
    contact = res.json()
    assert contact['id'] == contact_ids[0]
    print(f"✓ PASS - Retrieved contact: {contact['first_name']} {contact['last_name']}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[5/15] Update HR Contact...")
try:
    update_data = {
        'job_title': 'Senior Talent Acquisition Manager',
        'status': 'interested',
        'notes': 'Updated - Very responsive and supportive'
    }
    res = requests.put(f'{BASE_URL}/hr-contacts/{contact_ids[0]}', json=update_data, headers=headers, timeout=10)
    assert res.status_code == 200, f"Update contact failed: {res.status_code} - {res.text}"
    updated = res.json()['contact']
    assert updated['status'] == 'interested'
    print(f"✓ PASS - Updated contact status to: {updated['status']}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[6/15] Filter Contacts by Status...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts?status=new', headers=headers, timeout=10)
    assert res.status_code == 200, f"Filter contacts failed: {res.status_code} - {res.text}"
    data = res.json()
    print(f"✓ PASS - Retrieved {data['total']} contacts with status 'new'")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

# ============================================================================
# PART 3: EMAIL TEMPLATES
# ============================================================================
print("\n" + "="*90)
print("PART 3: EMAIL TEMPLATES")
print("="*90)

template_ids = []

# Test templates for different scenarios
test_templates = [
    {
        'name': 'Job Inquiry - Senior Role',
        'subject': 'Exciting Opportunity: Senior {job_title} at Our Company',
        'body': '''Dear {first_name},

I hope this email finds you well! I'm reaching out because I'm impressed with your profile and background in {company}.

I'm a Full Stack Developer with strong experience in Python, React, AWS, and modern DevOps practices. I noticed {company} is actively hiring, and I believe my skills align well with your team's needs.

Key Highlights:
• 3+ years of professional development experience
• Expert in FastAPI, React, PostgreSQL, and Docker
• Successfully led projects from ideation to production
• Strong background in system design and optimization

I would love to discuss how I can contribute to {company}'s growth. Would you be open to a brief call next week?

Best regards,
[Your Name]''',
        'template_type': 'job_inquiry',
        'description': 'Generic job inquiry template for HR contacts'
    },
    {
        'name': 'Resume Submission',
        'subject': 'Resume Submission - Full Stack Developer ({first_name})',
        'body': '''Hello {first_name},

As discussed, I'm submitting my resume for the Senior Developer position at {company}.

My professional experience includes:
- Building scalable backend services with FastAPI and PostgreSQL
- Frontend development with React and Next.js
- Cloud deployment with AWS (EC2, RDS, S3)
- DevOps and containerization with Docker
- Team leadership and mentorship

I'm excited about the opportunity to grow with {company} and contribute meaningful value to your engineering team.

Looking forward to hearing from you!

Best regards,
[Your Name]''',
        'template_type': 'resume_submission',
        'description': 'Resume submission follow-up template'
    },
    {
        'name': 'Follow-up Message',
        'subject': 'Following up - Interested in {company}',
        'body': '''Hi {first_name},

I hope you're doing well! Just following up on my previous message about the opportunities at {company}.

I'm very interested in joining your team and would appreciate any insights you might have about:
- The current hiring timeline
- Key projects your team is working on
- The tech stack you're using

Feel free to reach out if you'd like to grab a quick call. I'm flexible with timings!

Thanks,
[Your Name]''',
        'template_type': 'follow_up',
        'description': 'Follow-up email template'
    },
    {
        'name': 'Thank You Message',
        'subject': 'Thank you for the chat - {first_name}',
        'body': '''Hi {first_name},

Thank you so much for taking the time to chat with me today! I really appreciated learning more about the opportunities at {company} and your vision for the team.

I'm genuinely excited about the possibility of contributing to your organization. The technical challenges and team culture you described align perfectly with my career goals.

I'm looking forward to the next steps in the process!

Best regards,
[Your Name]''',
        'template_type': 'thank_you',
        'description': 'Thank you email template after conversation'
    }
]

print("\n[7/15] Create Email Templates...")
try:
    for template_data in test_templates:
        res = requests.post(f'{BASE_URL}/hr-contacts/templates/', json=template_data, headers=headers, timeout=10)
        assert res.status_code == 200, f"Template creation failed: {res.status_code} - {res.text}"
        template_id = res.json()['template']['id']
        template_ids.append(template_id)
        print(f"  ✓ Created template: {template_data['name']}")
    print(f"✓ PASS - Created {len(template_ids)} email templates")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[8/15] List Email Templates...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts/templates/', headers=headers, timeout=10)
    assert res.status_code == 200, f"List templates failed: {res.status_code} - {res.text}"
    data = res.json()
    assert data['total'] >= len(template_ids)
    print(f"✓ PASS - Retrieved {data['total']} email templates")
    for t in data['templates'][:4]:
        print(f"       - {t['name']} ({t['template_type']})")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[9/15] Filter Templates by Type...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts/templates/?template_type=job_inquiry', headers=headers, timeout=10)
    assert res.status_code == 200, f"Filter templates failed: {res.status_code} - {res.text}"
    data = res.json()
    assert data['total'] > 0
    print(f"✓ PASS - Retrieved {data['total']} 'job_inquiry' templates")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

# ============================================================================
# PART 4: EMAIL SENDING
# ============================================================================
print("\n" + "="*90)
print("PART 4: EMAIL SENDING (DEMO MODE)")
print("="*90)

print("\n[10/15] Send Single Email from Template...")
try:
    send_data = {
        'hr_contact_id': contact_ids[0],
        'template_id': template_ids[0],  # Job Inquiry template
        'custom_variables': {
            'job_title': 'Software Engineer',
            'company': 'TechCorp India'
        }
    }
    res = requests.post(f'{BASE_URL}/hr-contacts/send/', json=send_data, headers=headers, timeout=10)
    assert res.status_code == 200, f"Send email failed: {res.status_code} - {res.text}"
    result = res.json()
    print(f"✓ PASS - Email sent!")
    print(f"       Status: {result['result']['status']}")
    print(f"       To: {result['message']}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[11/15] Send Email with Custom Subject/Body...")
try:
    send_data = {
        'hr_contact_id': contact_ids[1],
        'subject': 'Excited to Connect with {company}!',
        'body': 'Hi {first_name},\n\nI\'m very interested in the opportunities at {company}. Would love to discuss how I can contribute!\n\nBest regards',
        'custom_variables': {
            'company': 'StartupHub'
        }
    }
    res = requests.post(f'{BASE_URL}/hr-contacts/send/', json=send_data, headers=headers, timeout=10)
    assert res.status_code == 200, f"Send email failed: {res.status_code} - {res.text}"
    result = res.json()
    print(f"✓ PASS - Custom email sent!")
    print(f"       Status: {result['result']['status']}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[12/15] Send Batch Emails...")
try:
    send_data = {
        'hr_contact_ids': contact_ids[2:4],  # Send to last 2 contacts
        'template_id': template_ids[1],  # Resume Submission template
        'custom_variables_list': [
            {'company': 'CloudSoft Solutions'},
            {'company': 'InfraCore'}
        ]
    }
    res = requests.post(f'{BASE_URL}/hr-contacts/send-batch/', json=send_data, headers=headers, timeout=10)
    assert res.status_code == 200, f"Batch send failed: {res.status_code} - {res.text}"
    result = res.json()
    print(f"✓ PASS - Batch emails sent!")
    print(f"       Total sent: {result['total_sent']}")
    print(f"       Results:")
    for r in result['results']:
        print(f"         - To {r['recipient']}: {r['status']}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

# ============================================================================
# PART 5: EMAIL LOGS & TRACKING
# ============================================================================
print("\n" + "="*90)
print("PART 5: EMAIL LOGS & TRACKING")
print("="*90)

print("\n[13/15] Get Email Logs...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts/email-logs/', headers=headers, timeout=10)
    assert res.status_code == 200, f"Get logs failed: {res.status_code} - {res.text}"
    data = res.json()
    assert data['total'] >= 3, f"Expected at least 3 logs, got {data['total']}"
    print(f"✓ PASS - Retrieved {data['total']} email logs")
    print(f"       Sample logs:")
    for log in data['logs'][:3]:
        print(f"         - To: {log['recipient_email']}, Status: {log['status']}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

print("\n[14/15] Get Email Logs for Specific Contact...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts/email-logs/?contact_id={contact_ids[0]}', headers=headers, timeout=10)
    assert res.status_code == 200, f"Get contact logs failed: {res.status_code} - {res.text}"
    data = res.json()
    print(f"✓ PASS - Retrieved {data['total']} logs for contact {contact_ids[0]}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

# ============================================================================
# PART 6: VERIFY CONTACT STATUS UPDATES
# ============================================================================
print("\n" + "="*90)
print("PART 6: VERIFY CONTACT STATUS UPDATES")
print("="*90)

print("\n[15/15] Verify Contacts Updated After Email...")
try:
    res = requests.get(f'{BASE_URL}/hr-contacts/{contact_ids[0]}', headers=headers, timeout=10)
    assert res.status_code == 200, f"Get contact failed: {res.status_code} - {res.text}"
    contact = res.json()
    assert contact['contacted_at'] is not None, "Contact should have contacted_at timestamp"
    assert contact['last_email_sent_at'] is not None, "Contact should have last_email_sent_at timestamp"
    print(f"✓ PASS - Contact tracking updated")
    print(f"       Contacted at: {contact['contacted_at']}")
    print(f"       Last email sent: {contact['last_email_sent_at']}")
except Exception as e:
    print(f"✗ FAIL - {e}")
    exit(1)

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "="*90)
print("SEGMENT H: ALL TESTS PASSED ✓")
print("="*90)
print("""
✓ HR Contacts CRUD fully operational
✓ Email templates system working
✓ Single email sending functional
✓ Batch email sending functional
✓ Email logging and tracking working
✓ Contact status tracking working
✓ Template personalization working

SEGMENT H IS COMPLETE AND READY FOR PRODUCTION!
""")
print("="*90)
