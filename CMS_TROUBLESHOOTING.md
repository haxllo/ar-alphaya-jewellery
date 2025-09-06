# CMS Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Issue 1: Cannot Access /admin Page

**Symptoms:**
- Page shows "Login with Netlify Identity"
- Cannot sign in
- Page loads but shows error

**Solutions:**
1. **Check Netlify Identity is enabled:**
   - Go to https://app.netlify.com/projects/aralphaya
   - Site Settings → Identity → Should show "Enabled"

2. **Invite yourself to CMS:**
   - Identity → Invite users → Add your email
   - Check email for invitation link
   - Set password when prompted

3. **Clear browser cache:**
   - Hard refresh the /admin page (Ctrl+F5 or Cmd+Shift+R)

### Issue 2: Git Gateway Errors

**Symptoms:**
- Can access CMS but cannot save changes
- "Git Gateway" errors in console
- Changes don't appear on website

**Solutions:**
1. **Verify Git Gateway is enabled:**
   - Netlify Dashboard → Identity → Services → Git Gateway should be "Enabled"

2. **Check repository permissions:**
   - Ensure Netlify has access to your GitHub repository
   - Go to Site Settings → Build & deploy → Repository permissions

### Issue 3: Images Won't Upload

**Symptoms:**
- Image upload fails
- "Upload failed" errors
- Images appear broken on website

**Solutions:**
1. **Check file size:**
   - Keep images under 10MB
   - Use JPG or PNG format

2. **Verify media folder:**
   - Ensure `public/uploads` directory exists
   - Check netlify.toml configuration

3. **Test with smaller image:**
   - Try uploading a small test image first

### Issue 4: Changes Don't Appear on Website

**Symptoms:**
- CMS shows changes saved
- Website still shows old content
- Build seems successful

**Solutions:**
1. **Wait for deployment:**
   - Changes trigger automatic build (2-5 minutes)
   - Check build status in Netlify dashboard

2. **Force rebuild:**
   - Netlify Dashboard → Deploys → Trigger deploy

3. **Clear browser cache:**
   - Hard refresh website pages
   - Check in incognito/private browsing mode

### Issue 5: Product Not Showing in Collection

**Symptoms:**
- Product created successfully
- Doesn't appear in rings/earrings/etc. pages
- Shows in CMS but not on website

**Solutions:**
1. **Check category spelling:**
   - Must exactly match: "rings", "earrings", "pendants", "bracelets-bangles"
   - Case sensitive

2. **Verify product is published:**
   - Check "In Stock" is enabled in CMS
   - Ensure all required fields are filled

3. **Check product slug:**
   - Should be URL-friendly (lowercase, no spaces)
   - Must be unique

## 🔧 Technical Troubleshooting

### Check Build Logs
1. **Go to Netlify Dashboard:** https://app.netlify.com/projects/aralphaya
2. **Deploys section** → Click on latest deploy
3. **View build logs** for errors

### Common Build Errors
- **Missing required fields:** Check all products have required fields filled
- **Invalid markdown:** Check product descriptions for formatting issues
- **Image path errors:** Ensure image paths are correct

### CMS Configuration Issues
- **File location:** CMS config at `public/admin/config.yml`
- **Backend setting:** Should be `git-gateway` for production
- **Branch setting:** Should match your main branch (usually `main`)

## 📞 Getting Help

### Quick Checks:
- [ ] Netlify Identity enabled
- [ ] Git Gateway enabled  
- [ ] User invited to CMS
- [ ] Can access /admin page
- [ ] Can login to CMS interface
- [ ] Test product creation works
- [ ] Changes appear on website

### If Still Having Issues:
1. **Check Netlify build logs** for specific errors
2. **Try creating a simple test product** with minimal fields
3. **Test in incognito browser** to rule out cache issues
4. **Check browser console** for JavaScript errors

### Contact Information:
- **Technical Issues:** Check with your developer
- **Netlify Issues:** https://docs.netlify.com/visitor-access/identity/
- **CMS Documentation:** https://decapcms.org/docs/

## 🎯 Success Indicators

When everything is working correctly:
- ✅ Can access https://aralphaya.netlify.app/admin
- ✅ Can login with Netlify Identity
- ✅ Can see Products and Site Settings sections
- ✅ Can create/edit products
- ✅ Can upload images
- ✅ Changes appear on website within 5 minutes
- ✅ Products appear in correct collections

---

**Remember:** The CMS uses Netlify Identity (separate from Auth0), Git Gateway for saving changes, and automatic deployment for publishing updates!
