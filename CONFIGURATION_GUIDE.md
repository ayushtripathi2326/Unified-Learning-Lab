# 🎛️ Configuration Guide

## Overview

Your website now uses a centralized configuration system for easy management and customization. All settings are in `frontend/src/config/`.

---

## 📁 Configuration Files

### 1. **routes.config.js** - Route Management

Add/remove/modify routes without touching App.jsx:

```javascript
{
  path: '/new-feature',
  component: 'NewFeature',  // Component name
  public: true,             // Anyone can access
  protected: true,          // Requires login
  adminOnly: true,          // Admin only
  title: 'New Feature',
  category: 'tool'          // Optional grouping
}
```

**To add a new route:**
1. Add entry to `routes.config.js`
2. Create component in `pages/`
3. Add import to `routeGenerator.js`

---

### 2. **navigation.config.js** - Sidebar & Navbar

Manage all navigation links:

```javascript
// Sidebar link
{
  id: 'my-feature',
  path: '/my-feature',
  icon: '🚀',
  label: 'My Feature',
  requireAuth: true
}

// Section with children
{
  id: 'section',
  label: 'My Section',
  icon: '📁',
  isSection: true,
  children: [...]
}
```

**Icons:** Use emojis or icon library classes

---

### 3. **features.config.js** - Feature Flags

Enable/disable features without code changes:

```javascript
export const features = {
  auth: {
    enabled: true,
    allowRegistration: true,
    passwordReset: true
  },
  
  tools: {
    typingSpeed: true,
    chatbot: true
  }
};
```

**App Settings:**

```javascript
export const appConfig = {
  name: 'Your App Name',
  version: '1.0.0',
  
  api: {
    timeout: 30000,
    retries: 3
  },
  
  ui: {
    itemsPerPage: 10,
    toastDuration: 3000
  }
};
```

---

### 4. **theme.config.js** - Styling & Themes

Customize colors, fonts, spacing:

```javascript
export const themeConfig = {
  colors: {
    light: {
      primary: '#4a90e2',
      secondary: '#66bb6a',
      background: '#f5f7fa'
    },
    dark: {
      primary: '#64b5f6',
      background: '#121212'
    }
  },
  
  typography: {
    fontFamily: {
      primary: "'Inter', sans-serif"
    },
    fontSize: {
      base: '1rem',
      lg: '1.125rem'
    }
  }
};
```

---

## 🚀 Common Tasks

### Add a New Page

1. **Create component:**
   ```bash
   frontend/src/pages/MyNewPage.jsx
   ```

2. **Add to routes.config.js:**
   ```javascript
   {
     path: '/my-new-page',
     component: 'MyNewPage',
     public: true,
     title: 'My New Page'
   }
   ```

3. **Add to routeGenerator.js:**
   ```javascript
   const pageComponents = {
     // ... existing
     MyNewPage: lazy(() => import('../pages/MyNewPage'))
   };
   ```

4. **Add to navigation.config.js (optional):**
   ```javascript
   {
     id: 'my-new-page',
     path: '/my-new-page',
     icon: '🎉',
     label: 'My New Page'
   }
   ```

### Change App Colors

Edit `theme.config.js`:

```javascript
colors: {
  light: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR'
  }
}
```

### Disable a Feature

Edit `features.config.js`:

```javascript
tools: {
  typingSpeed: false  // Disables typing speed
}
```

### Update App Name

Edit `features.config.js`:

```javascript
export const appConfig = {
  name: 'Your New Name',
  version: '2.0.0'
};
```

---

## 📝 Best Practices

1. **Always use config files** - Don't hardcode values
2. **Test after changes** - Run `npm run dev` to verify
3. **Keep organized** - Group related settings
4. **Document changes** - Add comments for complex configs
5. **Version control** - Commit config changes separately

---

## 🔄 Migration Benefits

✅ **Before:** Edit multiple files to add a route  
✅ **After:** Edit one config file

✅ **Before:** Search codebase to change colors  
✅ **After:** Edit theme.config.js

✅ **Before:** Hardcoded feature flags  
✅ **After:** Toggle in features.config.js

---

## 🛠️ Advanced Usage

### Conditional Features

```javascript
// In your component
import { features } from '../config';

if (features.tools.typingSpeed) {
  // Show typing speed feature
}
```

### Dynamic Theming

```javascript
// In your component
import { themeConfig } from '../config';

const styles = {
  color: themeConfig.colors.light.primary
};
```

### Environment-based Config

```javascript
export const appConfig = {
  api: {
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://api.production.com'
      : 'http://localhost:5000'
  }
};
```

---

## 📚 File Structure

```
frontend/src/config/
├── index.js              # Central export
├── routes.config.js      # All routes
├── navigation.config.js  # Sidebar/navbar links
├── features.config.js    # Feature flags & settings
└── theme.config.js       # Colors, fonts, styles
```

---

## 🎯 Quick Reference

| Task | File | Section |
|------|------|---------|
| Add route | routes.config.js | routes array |
| Add sidebar link | navigation.config.js | sidebarLinks |
| Change colors | theme.config.js | colors |
| Toggle feature | features.config.js | features |
| Update app name | features.config.js | appConfig |
| Change font | theme.config.js | typography |

---

## 💡 Tips

- Use descriptive IDs for routes and links
- Keep icon choices consistent
- Test on both light and dark themes
- Use semantic color names (primary, secondary)
- Group related features together
- Add comments for complex configurations

---

## 🐛 Troubleshooting

**Route not working?**
- Check component name matches in routeGenerator.js
- Verify path syntax (starts with /)
- Check protected/public settings

**Sidebar link missing?**
- Verify requireAuth matches user state
- Check adminOnly for admin routes
- Ensure icon is valid

**Theme not applying?**
- Check CSS variable usage
- Verify theme context is wrapping component
- Clear browser cache

---

## 📞 Support

For questions or issues:
- Check existing configurations for examples
- Review component implementation
- Test in development mode first

---

**Happy Configuring! 🎉**
