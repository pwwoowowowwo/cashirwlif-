const CACHE_NAME = 'shahi-walif-v2'; // تحديث الإصدار لضمان تنشيط الملفات الجديدة

// قائمة الملفات التي سيتم حفظها للعمل بدون إنترنت
const urlsToCache = [
  '/',
  '/index.html',
  '/cashier.html',
  '/print.html',
  '/inventory.html',
  '/sales.html',
  '/purchases.html',
  '/expenses.html',
  '/employees.html',
  'https://raw.githubusercontent.com/shahi-walif/assets/main/logo.png'
];

// مرحلة التثبيت: حفظ الملفات في ذاكرة المتصفح
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم حفظ ملفات نظام شاهي وليف بنجاح ✅');
        return cache.addAll(urlsToCache);
      })
  );
});

// مرحلة الاستدعاء: فتح الملفات من الذاكرة عند انقطاع الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف موجوداً في الذاكرة نرجعه فوراً، وإلا نطلبه من السحابة
        return response || fetch(event.request);
      })
  );
});

// تنظيف النسخ القديمة من الذاكرة عند تحديث النظام
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
