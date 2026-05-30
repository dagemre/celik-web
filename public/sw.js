// Service Worker — Çelik İnşaat PWA
const CACHE_NAME = 'celik-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

// Push bildirimi al ve göster
self.addEventListener('push', function(event) {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'Çelik İnşaat', {
      body:    data.body   || '',
      icon:    data.icon   || '/pwa-icon-192.png',
      badge:   '/pwa-icon-192.png',
      tag:     data.tag    || 'celik-notification',
      data:    { url: data.url || '/malik-dashboard' },
    })
  )
})

// Bildirime tıklanınca sayfayı aç
self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  const url = event.notification.data?.url || '/malik-dashboard'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      return clients.openWindow(url)
    })
  )
})
