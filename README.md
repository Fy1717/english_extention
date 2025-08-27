# English Learning Assistant - Chrome Extension

İngilizce kelime öğrenme ve test etme için geliştirilmiş Chrome eklentisi.

## Özellikler

- ✅ **Kelime Ekleme**: İngilizce kelimeler ve Türkçe karşılıklarını ekleme
- ✅ **Quiz Sistemi**: Rastgele kelime testi ve cevap kontrolü
- ✅ **Skor Takibi**: Doğru/yanlış cevap sayımı ve başarı oranı
- ✅ **Kelime Listesi**: Eklenen kelimeleri görüntüleme ve silme
- ✅ **İstatistikler**: Detaylı öğrenme istatistikleri
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
4. "Ekle" butonuna tıklayın

### Quiz Yapma
1. Ana menüden "🎯 Quiz Başlat" butonuna tıklayın
2. Gösterilen İngilizce kelimenin Türkçe karşılığını yazın
3. "Cevapla" butonuna tıklayın veya Enter tuşuna basın
4. Doğru/yanlış feedback'ini görün ve sonraki soruya geçin

### Kelime Listesi
1. "📚 Kelimelerim" butonuna tıklayın
2. Eklediğiniz tüm kelimeleri görün
3. İstemediğiniz kelimeleri 🗑️ butonuyla silin

### İstatistikler
1. "📊 İstatistikler" butonuna tıklayın
2. Toplam kelime sayısı, doğru/yanlış cevaplar ve başarı oranınızı görün
3. İsterseniz istatistikleri sıfırlayın

## Teknik Detaylar

- **Manifest Version**: 3
- **Permissions**: storage (kelime ve istatistik verilerini saklamak için)
- **Storage**: Chrome Storage API kullanılarak yerel depolama
- **UI Framework**: Vanilla JavaScript ve CSS
- **Responsive Design**: Mobil uyumlu tasarım

## Dosya Yapısı

```
├── manifest.json          # Extension konfigürasyonu
├── popup.html             # Ana arayüz HTML
├── popup.js               # Ana JavaScript logic
├── styles.css             # CSS stilleri
├── content.js             # Content script (gelecek özellikler için)
├── icons/                 # Extension ikonları
└── README.md              # Bu dosya
```

## Geliştirme

Extension'ı geliştirmek için:

1. Kodda değişiklik yapın
2. Chrome'da extension sayfasında "🔄" (yenile) butonuna tıklayın
3. Extension'ı test edin

## Gelecek Özellikler

- [ ] Web sayfalarından kelime seçerek direkt ekleme
- [ ] Kelime kategorileri ve etiketleme
- [ ] Sesli telaffuz desteği
- [ ] Spaced repetition algoritması
- [ ] İlerleme grafikleri
- [ ] Kelime import/export özelliği

## Lisans

Bu proje MIT lisansı altında geliştirilmiştir.
