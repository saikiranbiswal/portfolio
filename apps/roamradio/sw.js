const CACHE='roamradio-shell-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./assets/icon.svg','_payload/10.txt','_payload/11.txt','_payload/12.txt','_payload/13.txt','_payload/14.txt','_payload/15.txt','_payload/16.txt','_payload/17.txt','_payload/18.txt','_payload/19.txt'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin)return;
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
    const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;
  }).catch(()=>caches.match('./index.html'))));
});
