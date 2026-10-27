const CACHE='masterstamp-v21';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./favicon.ico','./favicon-32.png','./favicon-48.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;
 const url=new URL(request.url);
 if(url.origin!==location.origin||request.method!=='GET')return;
 const isIndex=url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');
 const isVersionCheck=url.searchParams.has('version_check')||url.searchParams.has('app_refresh');
 if(isIndex||isVersionCheck){
  event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
   if(response.ok&&!isVersionCheck){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}
   return response;
  }).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}
  return response;
 }).catch(()=>caches.match('./index.html'))));
});
