# Known Bugs

Track bugs and regressions here.

## ✅ Fixed Bugs
- [x] ~~In shopping cart page, when click on quick add BUTTON item is added to the cart but redirected to product page~~ *(Fixed with Auth0 integration)*
- [x] ~~Auth0 callback URL mismatch errors~~ *(Fixed with production URL configuration)*
- [x] ~~Netlify deployment environment variable issues~~ *(Fixed with CLI configuration)*

## Active Bugs
- [ ] Placeholder images not loading in Safari (verify lazy loading)
- [ ] Mobile menu animation jitter on Android Chrome
- [ ] Cart persists after clear action intermittently (race condition suspected)
- [ ] Size selector resets on route change for some products
- [ ] CMS media library shows stale thumbnails after image replacement

## CMS-Related Issues (To Monitor)
- [ ] CMS image uploads may need file size validation
- [ ] Decap CMS local backend package naming inconsistency (multiple package names tried)
- [ ] Need to test CMS performance with large number of products
- [ ] Monitor Git Gateway permissions and access controls

## Auth0 Related (Resolved)
- [x] ~~Login redirect loops~~ *(Fixed with proper base URLs)*
- [x] ~~User session not persisting~~ *(Fixed with UserProvider wrapper)*
- [x] ~~Protected routes not working~~ *(Fixed with withPageAuthRequired)*
