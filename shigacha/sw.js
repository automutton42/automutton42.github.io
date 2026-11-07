// 詩のシールガチャ：オフライン用キャッシュ（中身を更新したらV末尾の数字を上げる）
const V='shigacha-v1';
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(['./','./poems.txt'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{c.put(r,res.clone());return res}))));return}
 if(u.origin!==location.origin)return;
 const key=(u.pathname.endsWith('/')||u.pathname.endsWith('index.html'))?'./':u.pathname;
 e.respondWith(caches.open(V).then(async c=>{const m=await c.match(key,{ignoreSearch:true});
  const net=fetch(r,{cache:'no-store'}).then(res=>{if(res.ok)c.put(key,res.clone());return res});
  if(m){net.catch(()=>{});return m}return net}))});
