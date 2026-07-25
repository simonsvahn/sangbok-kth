// Sidan: nätverk först (nya publiceringar slår igenom direkt), cache som
// offline-reserv. Ikoner/manifest: cache först. Payloaden cachar appen själv i IndexedDB.
const CACHE='kthsangbok-skal-068d331d4979';
const FILER=['.','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILER)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(
 ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;              // Dropbox-API:t rörs inte
 if(e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html')){
  return e.respondWith(fetch(e.request).then(r=>{const k=r.clone();
   caches.open(CACHE).then(c=>c.put(e.request,k));return r})
   .catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))))}
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)))});
