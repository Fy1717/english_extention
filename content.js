// English Learning Assistant - Content Script
// Bu dosya web sayfalarında çalışır ve gelecekte ek özellikler için kullanılabilir

console.log('English Learning Assistant content script loaded');

// Gelecekte eklenebilecek özellikler:
// - Sayfa üzerindeki kelimeleri seçerek direkt kelime listesine ekleme
// - Sayfa üzerindeki İngilizce kelimeleri vurgulama
// - Çeviri önerileri gösterme

// Şimdilik basit bir mesaj gösterelim
if (window.location.hostname !== 'chrome-extension') {
    // Sadece normal web sayfalarında çalışsın, extension sayfalarında değil
    
    // Sayfa yüklendiğinde çalışacak kod
    document.addEventListener('DOMContentLoaded', function() {
        // Gelecekte buraya özellikler eklenebilir
    });
}
