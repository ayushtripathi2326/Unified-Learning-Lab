# MongoDB Atlas Migration Guide

## 🌐 Setting Up MongoDB Atlas

### Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas:**

   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account (M0 Sandbox cluster - Free forever)

2. **Create a New Cluster:**
   - Click "Build a Cluster"
   - Choose "Shared" (Free tier)
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region closest to your users
   - Click "Create Cluster" (takes 3-5 minutes)

### Step 2: Configure Database Access

1. **Create Database User:**

   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `learninglab_user` (or your choice)
   - Password: Generate a strong password (save it securely!)
   - Database User Privileges: Select "Read and write to any database"
   - Click "Add User"

2. **Important:** Save your credentials:
   ```
   Username: learninglab_user
   Password: [your-generated-password]
   ```

### Step 3: Configure Network Access

1. **Whitelist IP Addresses:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

### Step 4: Get Connection String

1. **Get Connection String:**

   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select Driver: "Node.js" and Version: "5.5 or later"
   - Copy the connection string (looks like):

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **Modify Connection String:**
   ```
   mongodb+srv://learninglab_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/learning-lab?retryWrites=true&w=majority
   ```
   Replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - Add `/learning-lab` after `.mongodb.net` to specify the database name

### Step 5: Update Your Application

1. **Update `.env` file in backend folder:**

   ```env
   # Replace the local MongoDB URI with Atlas URI
   MONGODB_URI=mongodb+srv://learninglab_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/learning-lab?retryWrites=true&w=majority
   ```

2. **Update `.env.example` for reference:**
   ```env
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learning-lab?retryWrites=true&w=majority
   ```

### Step 6: Migrate Existing Data (Optional)

If you have data in local MongoDB that you want to migrate:

#### Option A: Using MongoDB Compass (GUI)

1. **Export from Local:**

   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Select `learning-lab` database
   - For each collection, click "Export Collection"
   - Export as JSON

2. **Import to Atlas:**
   - Connect to your Atlas cluster in Compass
   - Create `learning-lab` database
   - Import each JSON file to corresponding collection

#### Option B: Using mongodump/mongorestore (Command Line)

```bash
# Export from local MongoDB
mongodump --db=learning-lab --out=./backup

# Import to MongoDB Atlas
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/learning-lab" ./backup/learning-lab
```

#### Option C: Using MongoDB Atlas Import Tool

1. Go to your cluster in Atlas
2. Click "Collections" → "Add My Own Data"
3. Create database: `learning-lab`
4. Upload JSON/CSV files

### Step 7: Test Connection

1. **Start your backend server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Check the logs:**

   - You should see: "MongoDB Connected Successfully"
   - If there's an error, check your connection string and credentials

3. **Test with Postman or cURL:**

   ```bash
   # Health check
   curl http://localhost:5000/health

   # Register a test user
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "Test123!@#"
     }'
   ```

### Step 8: Security Best Practices

1. **Environment Variables:**

   - Never commit `.env` file to Git
   - Use different credentials for development and production
   - Rotate passwords regularly

2. **Network Security:**

   - In production, whitelist only specific IP addresses
   - Remove "0.0.0.0/0" access

3. **Database User Permissions:**

   - Use read-only users for analytics
   - Use separate users for different services

4. **Connection String Security:**
   - URL encode special characters in password
   - Use environment variables, never hardcode

### Common Issues & Solutions

#### Issue 1: "MongoServerError: bad auth"

**Solution:**

- Check username and password are correct
- Ensure password is URL-encoded (e.g., `@` becomes `%40`)
- Verify user has correct database privileges

#### Issue 2: "MongooseServerSelectionError: connect ETIMEDOUT"

**Solution:**

- Check network access whitelist in Atlas
- Ensure IP address is allowed (or use 0.0.0.0/0 for testing)
- Check firewall settings

#### Issue 3: "MongooseServerSelectionError: getaddrinfo ENOTFOUND"

**Solution:**

- Check connection string is correct
- Ensure cluster name is correct
- Check internet connection

#### Issue 4: Special Characters in Password

**Solution:**

- URL encode the password
- Example: If password is `P@ssw0rd!`, encode as `P%40ssw0rd%21`
- Or use MongoDB Compass to generate connection string

### URL Encoding Reference

| Character | Encoded |
| --------- | ------- |
| @         | %40     |
| :         | %3A     |
| /         | %2F     |
| ?         | %3F     |
| #         | %23     |
| [         | %5B     |
| ]         | %5D     |
| !         | %21     |
| $         | %24     |
| &         | %26     |
| '         | %27     |
| (         | %28     |
| )         | %29     |
| \*        | %2A     |
| +         | %2B     |
| ,         | %2C     |
| ;         | %3B     |
| =         | %3D     |

### Monitoring & Maintenance

1. **Atlas Dashboard:**

   - Monitor database performance
   - Check connection metrics
   - Set up alerts for high usage

2. **Backup:**

   - Atlas provides automatic daily backups (Free tier: 2 days retention)
   - Enable continuous backups for production

3. **Performance:**
   - Create indexes for frequently queried fields
   - Monitor slow queries in Atlas dashboard
   - Upgrade to paid tier if needed for more storage/performance

### Atlas Free Tier Limits

- **Storage:** 512 MB
- **RAM:** Shared
- **vCPU:** Shared
- **Connections:** 500 concurrent
- **Backups:** Last 2 days

For production apps, consider upgrading to M10+ for:

- Dedicated resources
- Better performance
- More storage
- Longer backup retention
- 24/7 support

### Cost Estimation (If Upgrading)

- **M10 (Development):** $0.08/hour (~$57/month)
- **M20 (Production):** $0.20/hour (~$144/month)
- **M30 (High Traffic):** $0.54/hour (~$389/month)

### Deployment Checklist

- [ ] Created MongoDB Atlas cluster
- [ ] Created database user with strong password
- [ ] Configured network access (IP whitelist)
- [ ] Obtained connection string
- [ ] Updated `.env` with Atlas URI
- [ ] Tested connection locally
- [ ] Migrated existing data (if any)
- [ ] Tested all API endpoints
- [ ] Updated documentation
- [ ] Committed changes to Git (excluding .env)
- [ ] Set up production environment variables
- [ ] Configured monitoring and alerts

### Next Steps After Migration

1. **Update Documentation:**

   - Update README.md with Atlas setup instructions
   - Document connection string format

2. **CI/CD:**

   - Add Atlas URI to CI/CD environment variables
   - Test deployment pipeline

3. **Monitoring:**

   - Set up Atlas alerts
   - Monitor connection pool usage
   - Track query performance

4. **Scaling:**
   - Plan for data growth
   - Consider sharding strategy if needed
   - Monitor free tier limits

---

**🎉 Congratulations!** Your application is now using MongoDB Atlas cloud database!

For support: https://www.mongodb.com/docs/atlas/
