/* Offline support: the app page is fetched fresh when online and served from cache when offline. Data calls to GitHub are never cached here. */
const C='looli-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon-looli-192.png','./icon-karim-192.png']).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(u.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request.mode==='navigate'?'./index.html':e.request,cp));return r}).catch(()=>caches.match(e.request.mode==='navigate'?'./index.html':e.request).then(r=>r||caches.match('./'))));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp));return n})))}});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>{const w=l[0];if(w){w.focus();w.navigate&&e.notification.data&&w.postMessage(e.notification.data)}else self.clients.openWindow('./'+(e.notification.data?.hash||''))}))});
