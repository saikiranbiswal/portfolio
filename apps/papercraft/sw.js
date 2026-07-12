self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    try{
      const keys=await caches.keys();
      await Promise.all(keys.filter(key=>key.includes('papercraft')||key.includes('mupdf-wasm')||key.includes('pdfjs-cmaps')).map(key=>caches.delete(key)));
      await self.registration.unregister();
      const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      for(const client of clients){client.navigate(client.url);}
    }catch(error){console.warn('Papercraft service-worker cleanup failed:',error);}
  })());
});
