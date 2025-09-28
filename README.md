git a# English Learning Assistant - Chrome Extension

İngilizce kelime öğrenme ve test etme için geliştirilmiş Chrome eklentisi. Örnek cümlelerle desteklenen, kapsamlı kelime öğrenme deneyimi sunar.

## 📖 Hızlı Başlangıç

1. **Extension'ı yükleyin** → İlk açılışta 300+ kelime otomatik yüklenir
2. **Quiz başlatın** → "🎯 Quiz Başlat" butonuna tıklayın
3. **Kelime öğrenin** → Örnek cümlelerle birlikte kelimeleri görün
4. **Enter tuşu ile ilerleyin** → Hızlı ve kolay quiz deneyimi

## 🚀 Özellikler

- ✅ **Kelime Ekleme**: İngilizce kelimeler, Türkçe karşılıkları ve örnek cümleler
- ✅ **Quiz Sistemi**: Rastgele kelime testi, örnek cümlelerle desteklenmiş
- ✅ **Skor Takibi**: Doğru/yanlış cevap sayımı ve başarı oranı
- ✅ **Kelime Listesi**: Eklenen kelimeleri görüntüleme, düzenleme ve silme
- ✅ **İstatistikler**: Detaylı öğrenme istatistikleri
- ✅ **Default Kelime Listesi**: İlk yüklemede 300+ kelime ile hazır içerik
- ✅ **Import/Export**: JSON formatında kelime listesi aktarımı
- ✅ **Kompakt Quiz**: Enter tuşu ile hızlı ilerleme, gereksiz butonlar kaldırıldı
- ✅ **Modern Arayüz**: Kullanıcı dostu ve responsive tasarım

## Kurulum

1. Chrome tarayıcısında `chrome://extensions/` adresine gidin
2. Sağ üst köşedeki "Geliştirici modu"nu açın
3. "Paketlenmemiş uzantı yükle" butonuna tıklayın
4. Bu proje klasörünü seçin
5. Extension yüklendikten sonra tarayıcı araç çubuğunda görünecektir

## Kullanım

### Kelime Ekleme
1. Extension ikonuna tıklayın
2. "📝 Kelime Ekle" butonuna tıklayın
3. İngilizce kelimeyi ve Türkçe karşılığını girin
4. **İsteğe bağlı**: Örnek cümle ekleyin (daha iyi öğrenme için)
5. "Ekle" butonuna tıklayın

### Quiz Yapma
1. Ana menüden "🎯 Quiz Başlat" butonuna tıklayın
2. Gösterilen İngilizce kelimeyi ve örnek cümleyi okuyun
3. Türkçe karşılığını yazın
4. **Enter tuşuna basın** (hızlı ilerleme için)
5. Doğru/yanlış feedback'ini görün
6. **Enter tuşuna basarak** sonraki soruya geçin
7. Quiz'i bitirmek için sağ üstteki ✕ butonuna tıklayın

### Kelime Listesi
1. "📚 Kelimelerim" butonuna tıklayın
2. Eklediğiniz tüm kelimeleri ve örnek cümlelerini görün
3. Kelimeleri ✏️ butonuyla düzenleyin
4. İstemediğiniz kelimeleri 🗑️ butonuyla silin

### Kelime İçe/Dışa Aktarma
1. Kelime listesi bölümünde "📥 Kelimeleri İndir" butonuna tıklayın
2. JSON formatında kelime listenizi bilgisayarınıza kaydedin
3. "📋 JSON Yapıştır" ile başka kaynaklardan kelime listesi ekleyin

### İstatistikler
1. "📊 İstatistikler" butonuna tıklayın
2. Toplam kelime sayısı, doğru/yanlış cevaplar ve başarı oranınızı görün
3. İsterseniz istatistikleri sıfırlayın

## 🎯 Önemli Özellikler

### Default Kelime Listesi
- İlk yüklemede **300+ kelime** otomatik olarak yüklenir
- Her kelime için **örnek İngilizce cümle** bulunur
- Kullanıcılar hemen quiz yapmaya başlayabilir

### Örnek Cümleler
- Quiz'te kelimeler örnek cümlelerle birlikte gösterilir
- Daha iyi anlama ve akılda kalma sağlar
- İsteğe bağlı olarak yeni kelimelere örnek cümle eklenebilir

### Kompakt Quiz Deneyimi
- Enter tuşu ile hızlı ilerleme
- Gereksiz butonlar kaldırıldı
- Kompakt tasarım ile daha az kaydırma
- Sağ üstteki ✕ butonu ile kolay çıkış

## Teknik Detaylar

- **Manifest Version**: 3
- **Permissions**: storage (kelime ve istatistik verilerini saklamak için)
- **Storage**: Chrome Storage API kullanılarak yerel depolama
- **UI Framework**: Vanilla JavaScript ve CSS
- **Responsive Design**: Mobil uyumlu tasarım
- **Default Content**: sample_words.json ile hazır kelime listesi

## Dosya Yapısı

```
├── manifest.json          # Extension konfigürasyonu
├── popup.html             # Ana arayüz HTML
├── popup.js               # Ana JavaScript logic
├── styles.css             # CSS stilleri
├── content.js             # Content script (gelecek özellikler için)
├── sample_words.json      # Default kelime listesi (300+ kelime)
├── test_examples.html     # Test sayfası
├── icons/                 # Extension ikonları
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # Bu dosya
```

## Geliştirme

Extension'ı geliştirmek için:

1. Kodda değişiklik yapın
2. Chrome'da extension sayfasında "🔄" (yenile) butonuna tıklayın
3. Extension'ı test edin

## 🚀 Gelecek Özellikler

- [x] ✅ Örnek cümlelerle kelime öğrenme
- [x] ✅ Default kelime listesi
- [x] ✅ Kelime import/export özelliği
- [x] ✅ Kompakt quiz deneyimi
- [ ] Web sayfalarından kelime seçerek direkt ekleme
- [ ] Kelime kategorileri ve etiketleme
- [ ] Sesli telaffuz desteği
- [ ] Spaced repetition algoritması
- [ ] İlerleme grafikleri
- [ ] Çoklu dil desteği
- [ ] Kelime zorluk seviyeleri

## Lisans

Bu proje MIT lisansı altında geliştirilmiştir.
