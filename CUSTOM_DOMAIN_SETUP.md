# Custom Domain Setup on Render

## Frontend (Static Site)
1. Go to Render Dashboard → `unified-learning-lab` service
2. Settings → Custom Domains → Add Custom Domain
3. Enter: `learninglab.com` and `www.learninglab.com`

### DNS Configuration:
```
Type: CNAME
Name: www
Value: unified-learning-lab.onrender.com

Type: A
Name: @
Value: [Render's IP addresses - provided by Render]
```

## Backend (Web Service)
1. Go to Render Dashboard → `unified-learning-lab-backend` service
2. Settings → Custom Domains → Add Custom Domain
3. Enter: `api.learninglab.com`

### DNS Configuration:
```
Type: CNAME
Name: api
Value: unified-learning-lab-backend.onrender.com
```

## Update Environment Variables

### Backend (.env):
```
CORS_ORIGIN=https://learninglab.com,https://www.learninglab.com
FRONTEND_URL=https://learninglab.com
```

### Frontend (.env):
```
VITE_BACKEND_URL=https://api.learninglab.com/api
```

## SSL Certificate
Render automatically provides SSL certificates for custom domains.