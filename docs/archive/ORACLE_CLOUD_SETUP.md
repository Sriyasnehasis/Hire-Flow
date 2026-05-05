# 🚀 ORACLE CLOUD FREE TIER SETUP GUIDE

**Cost**: $0 FOREVER ✅  
**Time**: ~20 minutes  
**No credit card needed**

---

## ✨ WHY ORACLE CLOUD?

- ✅ Free forever (not just 1 year)
- ✅ 4 GB RAM VM included
- ✅ 50 GB storage included
- ✅ 10 Mbps uplink bandwidth
- ✅ No credit card needed
- ✅ Perfect for hobby/learning projects
- ✅ Works perfectly with Hostinger DNS

---

## 📋 WHAT YOU'LL GET

```
FREE EVERY MONTH:
├─ 1x VM with 4 GB RAM
├─ 2x vCPU (cores)
├─ 50 GB storage
├─ 10 Mbps upload bandwidth
└─ FOREVER (no expiration!)
```

---

## 🎯 SETUP STEPS

### **STEP 1: Create Oracle Cloud Account**

1. Go to: https://www.oracle.com/cloud/free/
2. Click **"Sign Up"** button (top right)
3. Enter email address
4. Create Oracle account (username + password)
5. **Confirm email** (check inbox for verification link)
6. Fill in account details:
   - First name, Last name
   - Country
   - Phone number
7. Click **"Create Account"**

⏱️ **Time**: 5 minutes

---

### **STEP 2: Set Up Free Tier Account**

After account created:

1. Email verification link arrives
2. Click link to verify email
3. Accept the **"Free Tier"** offer
4. Choose data center closest to you (e.g., "India - Mumbai", "US - Virginia")
5. Complete setup wizard
6. Dashboard loads!

✅ **You now have $0 credit to use!**

⏱️ **Time**: 5 minutes

---

### **STEP 3: Create Virtual Machine (Linux Server)**

#### In Oracle Cloud Dashboard:

1. Click **"Compute"** in left menu → **"Instances"**
2. Click **"Create Instance"** button
3. Fill in details:

```
Name: extract-resume-app
Image: Ubuntu 22.04 (Free Tier Eligible ✅)
Shape: Ampere (Free Tier ✅)
  - Memory: 4 GB
  - vCPU: 2 cores
  - Cost: FREE!
```

4. In **"Networking"** section:
   - Create new VCN (Virtual Cloud Network) OR use default
   - Assign public IP: **CHECK THIS BOX** ✅

5. Click **"Create"** button
6. Wait 1-2 minutes for VM to start

✅ **Your Linux server is now running!**

⏱️ **Time**: 5 minutes

---

### **STEP 4: Get Your Server's IP Address**

1. In Oracle Dashboard, go to **Compute → Instances**
2. Click your instance **"extract-resume-app"**
3. Look for **"Public IP Address"** (copy this!)
   - Example: `143.47.123.45`

💾 **SAVE THIS IP** - you'll need it later!

⏱️ **Time**: 2 minutes

---

### **STEP 5: Connect to Server (SSH)**

You need to access your server to install Docker and deploy the app.

#### On Windows PowerShell:

```powershell
# First time: set SSH key
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\oracle_key

# Save the public key:
# File: C:\Users\YourUsername\.ssh\oracle_key.pub
# Copy the contents of this file
```

#### In Oracle Cloud Dashboard:

1. Go to **Compute → Instances**
2. Click **"extract-resume-app"**
3. Look for **"SSH Key"** section
4. Click **"Import SSH Key"**
5. Paste the contents of `oracle_key.pub`
6. Click **"Import"**

#### Connect to your server:

```powershell
ssh -i $env:USERPROFILE\.ssh\oracle_key ubuntu@YOUR_IP_ADDRESS

# Example:
# ssh -i C:\Users\sriya\.ssh\oracle_key ubuntu@143.47.123.45
```

✅ **You're now logged into your server!**

⏱️ **Time**: 5 minutes

---

## 🐳 DEPLOY YOUR APP (Week 3)

Once you're logged into the server:

### **Install Docker**

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
exit  # Logout and log back in
```

### **Deploy Your App**

1. Clone your GitHub repo:

```bash
git clone https://github.com/YOUR_USERNAME/ExtractResume-Ecosystem.git
cd ExtractResume-Ecosystem
```

2. Create `.env` file with database credentials:

```bash
nano .env
```

Add:

```
DATABASE_URL=postgresql://user:password@localhost:5432/extract_resume
MONGODB_URL=mongodb://localhost:27017
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-api-key
```

3. Start the app:

```bash
docker-compose up -d
```

4. Check if running:

```bash
docker ps
```

✅ **App is now running on your server!**

---

## 🌐 POINT HOSTINGER DNS TO ORACLE SERVER

### When app is deployed and running (Week 3):

1. Copy your Oracle server's **Public IP Address**
   - Example: `143.47.123.45`

2. Go to **Hostinger Control Panel**
3. Find **DNS Management** for your domain
4. Find the **A Record** (usually empty or pointing to `127.0.0.1`)
5. Change it to your Oracle IP:
   ```
   A Record → 143.47.123.45
   ```
6. Click **Save**
7. Wait 5-30 minutes for DNS to propagate

✅ **Your domain now points to your app!**

Users can visit `yourdomain.com` and see your website! 🎉

---

## 🔐 SECURITY CHECKLIST

Before going live, do this:

- [ ] Change SSH key permissions:

```bash
chmod 600 ~/.ssh/oracle_key
chmod 700 ~/.ssh
```

- [ ] Set up firewall:

```bash
sudo ufw enable
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
```

- [ ] Create SSL certificate (HTTPS):

```bash
# Run this after deploying app
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

---

## 📊 MONITORING YOUR SERVER

### Check if app is running:

```bash
docker ps
```

### Check logs:

```bash
docker logs -f backend     # Check backend logs
docker logs -f frontend    # Check frontend logs
```

### Monitor CPU/Memory:

```bash
docker stats
```

### Restart app:

```bash
docker-compose restart
```

---

## 🆘 TROUBLESHOOTING

### App won't start?

```bash
docker logs backend
# Check error messages
```

### Database connection error?

```bash
# Check .env file has correct credentials
cat .env

# Check if PostgreSQL is running
docker ps | grep postgres
```

### Port already in use?

```bash
# Change docker-compose.yml ports
# E.g., 8000:8000 → 8001:8000
```

### Can't connect via SSH?

1. Check security group allows port 22
2. Check IP address is correct
3. Check SSH key has correct permissions: `chmod 600 ~/.ssh/oracle_key`

---

## 📋 ORACLE CLOUD FREE TIER LIMITS

```
✅ INCLUDED (FREE):
- 1x VM with 2 vCPU, 4 GB RAM
- 50 GB block storage
- 10 Mbps upload bandwidth
- 1x Load Balancer (optional)
- PostgreSQL 19.x (optional)

⚠️ LIMITS TO WATCH:
- Only 10 Mbps upload (= ~1.25 MB/s)
  - This is faster than most home internet!
- Monitor costs in dashboard
  - Always free = $0/month
```

---

## 🎯 YOUR TIMELINE

**This week** (March 30 - April 6):

- [ ] Sign up for Oracle Cloud
- [ ] Create VM
- [ ] Save IP address
- [ ] Test SSH connection

**Week 3** (April 14-20):

- [ ] Deploy app to Oracle server
- [ ] Update Hostinger DNS
- [ ] Test yourdomain.com works
- [ ] Go LIVE! 🎉

---

## 🚀 NEXT STEPS

1. **Right now**: Sign up for Oracle Cloud free tier
2. **Create VM** with 4GB RAM (takes 2 mins)
3. **Save the IP address** somewhere safe
4. **Test SSH connection** to verify it works
5. **During Week 3**: Deploy app and manage DNS

---

## 📞 NEED HELP?

**Oracle Cloud Documentation**: https://docs.oracle.com/

**If deployment fails during Week 3, I'll help you debug!**

---

## 🎉 YOU'RE ALL SET!

**Summary**:

- ✅ Free hosting forever (Oracle Cloud)
- ✅ Free domain management (Hostinger)
- ✅ Deploy for $0
- ✅ Website live by April 30

**Estimated time to complete**:

- Sign-up + setup: ~20 minutes (do it NOW!)
- Deploy app: ~30 minutes (do it Week 3)

---

**Ready to start?** 🚀

👉 Go to https://www.oracle.com/cloud/free/ and click **"Sign Up"** now!

If you have any questions during setup, ask me immediately. I'll help! 💪
