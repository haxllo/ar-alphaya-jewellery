# Known Bugs

Track bugs and regressions here.

## ✅ Fixed Bugs
- [x] ~~In shopping cart page, when click on quick add BUTTON item is added to the cart but redirected to product page~~ *(Fixed with Auth0 integration)*
- [x] ~~Auth0 callback URL mismatch errors~~ *(Fixed with production URL configuration)*
- [x] ~~Netlify deployment environment variable issues~~ *(Fixed with CLI configuration)*
- [x] ~~Mobile menu animation jitter on Android Chrome~~ *(Fixed with CSS transform optimization in CMS)*
- [x] ~~Placeholder images not loading in Safari~~ *(Fixed with proper blur placeholders and lazy loading attributes)*
- [x] ~~Cart persists after clear action intermittently~~ *(Fixed Zustand store race condition with debouncing and forced localStorage sync)*
- [x] ~~Size selector resets on route change for some products~~ *(Fixed with useEffect to reset state when product changes)*

## Active Bugs
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
