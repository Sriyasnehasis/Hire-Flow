import requests
import json

print("=== SEGMENT B END-TO-END VALIDATION ===\n")

# Test 1: Signup
print("TEST 1: SIGNUP")
signup_data = {
    'email': 'segb_testuser@test.com',
    'password': 'TestPass123!',
    'full_name': 'SegB Tester'
}
res = requests.post('http://localhost:8000/api/v1/auth/signup', json=signup_data)
print(f"Status: {res.status_code}")
data = res.json()
token = data.get('access_token')
print(f"Token OK: {token[:30]}...")
print()

if res.status_code == 200:
    headers = {'Authorization': f'Bearer {token}'}
    
    # Test 2: Get profile
    print("TEST 2: GET /users/me")
    res2 = requests.get('http://localhost:8000/api/v1/users/me', headers=headers)
    print(f"Status: {res2.status_code}")
    user_data = res2.json()
    print(f"User: ID={user_data.get('id')}, Email={user_data.get('email')}")
    print()
    
    # Test 3: Get profile data (before update)
    print("TEST 3: GET /users/me/profile-data (BEFORE)")
    res3 = requests.get('http://localhost:8000/api/v1/users/me/profile-data', headers=headers)
    print(f"Status: {res3.status_code}")
    profile_before = res3.json()
    print(f"Before: {json.dumps(profile_before, indent=2)}")
    print()
    
    # Test 4: Update profile data
    print("TEST 4: PATCH /users/me/profile-data")
    update_data = {
        'educational_qualification': 'BS Computer Science',
        'years_of_experience': 5.5,
        'current_company': 'Tech Corp',
        'primary_skills': ['Python', 'React', 'FastAPI'],
        'preferred_roles': ['Senior Developer'],
        'research_interests': ['AI'],
        'certifications': ['AWS']
    }
    res4 = requests.patch('http://localhost:8000/api/v1/users/me/profile-data', json=update_data, headers=headers)
    print(f"Status: {res4.status_code}")
    profile_updated = res4.json()
    print(f"Updated: {json.dumps(profile_updated, indent=2)}")
    print()
    
    # Test 5: Verify persistence
    print("TEST 5: VERIFY PERSISTENCE")
    res5 = requests.get('http://localhost:8000/api/v1/users/me/profile-data', headers=headers)
    print(f"Status: {res5.status_code}")
    profile_verified = res5.json()
    is_saved = (profile_verified.get('educational_qualification') == 'BS Computer Science' and 
                profile_verified.get('years_of_experience') == 5.5 and
                profile_verified.get('current_company') == 'Tech Corp')
    print(f"Verified: {json.dumps(profile_verified, indent=2)}")
    print()
    
    if is_saved:
        print("✅ SEGMENT B: END-TO-END TEST PASSED!")
        print("   - Signup works")
        print("   - Profile retrieval works")
        print("   - Profile update persists to database")
        print("   - Data retrieval confirms persistence")
    else:
        print("❌ Data was not persisted correctly")
