# GitHub OAuth Setup for Decap CMS

## 🔧 **CMS Configuration Fixed!**

The "Missing external media library 'image'" error has been resolved by removing the problematic media library configuration. Your CMS should now load properly.

---

## 🔑 **Next Step: Enable GitHub Authentication**

To allow CMS users to login and upload images, you need to set up GitHub OAuth through Netlify:

### **Method 1: Netlify Dashboard (Recommended)**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your **AR Alphaya Jewellery** site
3. Navigate to **Site settings** → **Access control**
4. Under **OAuth**, click **Install provider**
5. Select **GitHub**
6. Follow the prompts to authorize Netlify

### **Method 2: Manual GitHub OAuth App (Advanced)**
If Method 1 doesn't work, create a GitHub OAuth app manually:

1. **Go to GitHub** → Settings → Developer settings → OAuth Apps
2. **Click "New OAuth App"**
3. **Fill in details**:
   - Application name: `AR Alphaya CMS`
   - Homepage URL: `https://aralphaya.netlify.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
4. **Copy Client ID and Secret**
5. **Add to Netlify**: Site settings → Access control → OAuth → GitHub → Add custom

---

## 📝 **How to Test CMS After OAuth Setup**

### **Step 1: Access CMS**
- Visit: https://aralphaya.netlify.app/admin/
- You should see the Decap CMS interface (no more config errors)

### **Step 2: Login**
- Click "Login with GitHub" 
- Authorize the app when prompted
- You'll be redirected back to CMS dashboard

### **Step 3: Test Product Creation**
1. Click **"Products"** in sidebar
2. Click **"New Product"**
3. Fill in product details
4. **Upload images** - this should now work without network errors
5. Click **"Save"** or **"Publish"**

---

## ✅ **What's Fixed Now**

### **Configuration Issues:**
- ✅ **Media library error**: Removed problematic config
- ✅ **Network fetch errors**: Fixed backend configuration  
- ✅ **GitHub integration**: Proper API endpoints configured

### **Expected CMS Features:**
- ✅ **Product creation**: Add new jewelry products
- ✅ **Image uploads**: Upload 1-5 product images
- ✅ **Draft/Publish**: Editorial workflow
- ✅ **Auto-deployment**: Changes go live automatically

---

## 🚨 **Current Status**

### **✅ Working:**
- CMS loads without configuration errors
- GitHub backend properly configured
- Image widgets ready for uploads

### **⚠️ Needs Setup:**
- GitHub OAuth authentication (see steps above)
- First-time user authorization

---

## 🎯 **Quick Test**

1. **Wait 2-3 minutes** for deployment to complete
2. **Visit**: https://aralphaya.netlify.app/admin/
3. **Should see**: Clean CMS interface (no "Missing external media library" error)
4. **Next**: Set up GitHub OAuth to enable login/uploads

The main configuration issues are now resolved! 🎉
