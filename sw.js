// Cache-first för skalet; payloaden cachas i IndexedDB av appen själv.
const CACHE='kthsangbok-skal-v1';
const FILER=['.','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILER)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(
 ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;              // Dropbox-API:t rörs inte
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)))});
