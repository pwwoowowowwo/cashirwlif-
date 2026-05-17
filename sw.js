// تحديث الإصدار إلى v3 لإجبار المتصفح على مسح الفواتير القديمة وتنشيط الفاتورة الحرارية الصافية فوراً
const CACHE_NAME = 'shahi-walif-v3'; 

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
  '/employees.html'
];

// مرحلة التثبيت: حفظ الملفات في ذاكرة المتصفح
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم حفظ ملفات نظام شاهي وليف المطور بنجاح ✅');
        // جلب الملفات المتاحة وتخطي الأخطاء في حال غياب ملف اللوجو مؤقتاً
        return cache.addAll(urlsToCache).catch(err => console.log("تنبيه الكاش:", err));
      })
  );
  self.skipWaiting(); // تفعيل فوري للإصدار الجديد دون انتظار إغلاق المتصفح
});

// مرحلة الاستدعاء: فتح الملفات من الذاكرة عند انقطاع الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// تنظيف النسخ القديمة تماماً من الذاكرة وتفعيل النظام الحراري الصافي
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('تم حذف الكاش القديم بنجاح المستودع: ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // إجبار جميع التبويبات المفتوحة على استقبال التحديث فوراً
  );
});
  );
});
