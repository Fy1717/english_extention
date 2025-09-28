// English Learning Assistant - Popup Script

console.log('🚀 POPUP SCRIPT BAŞLADI!');

class EnglishLearningApp {
    constructor() {
        console.log('🏗️ CONSTRUCTOR ÇAĞRILDI!');
        this.currentSection = 'main-menu';
        this.words = [];
        this.stats = {
            totalCorrect: 0,
            totalWrong: 0,
            currentCorrect: 0,
            currentWrong: 0
        };
        this.currentQuizWord = null;
        this.quizWords = [];
        this.currentQuizIndex = 0;

        console.log('🔄 INIT ÇAĞRILIYOR...');
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.showSection('main-menu');
        this.updateStats();

        // Debug test
        console.log('🚀 Extension başlatıldı');
        this.addDebugStep('Extension başlatıldı - debug sistemi aktif', 'success');
    }

    // Veri yükleme ve kaydetme
    async loadData() {
        try {
            const result = await chrome.storage.local.get(['words', 'stats', 'defaultWordsLoaded']);
            this.words = result.words || [];
            this.stats = result.stats || {
                totalCorrect: 0,
                totalWrong: 0,
                currentCorrect: 0,
                currentWrong: 0
            };

            // İlk yükleme ise default kelimeleri yükle
            if (!result.defaultWordsLoaded && this.words.length === 0) {
                console.log('🚀 İlk yükleme - default kelimeler yükleniyor...');
                await this.loadDefaultWords();
            }
        } catch (error) {
            console.error('Veri yüklenirken hata:', error);
            this.showNotification('Veri yüklenirken hata oluştu!', 'error');
        }
    }

    // Default kelimeleri yükle
    async loadDefaultWords() {
        try {
            const response = await fetch(chrome.runtime.getURL('sample_words.json'));
            const data = await response.json();
            
            if (data.words && Array.isArray(data.words)) {
                this.words = data.words.map(word => ({
                    ...word,
                    id: word.id || (Date.now() + Math.random()),
                    addedDate: word.addedDate || new Date().toISOString()
                }));
                
                await this.saveData();
                
                // Default kelimelerin yüklendiğini işaretle
                await chrome.storage.local.set({ defaultWordsLoaded: true });
                
                console.log(`✅ ${this.words.length} default kelime yüklendi`);
                this.addDebugStep(`${this.words.length} default kelime yüklendi`, 'success');
            }
        } catch (error) {
            console.error('Default kelimeler yüklenirken hata:', error);
            this.addDebugStep(`Default kelimeler yüklenemedi: ${error.message}`, 'error');
        }
    }

    async saveData() {
        try {
            await chrome.storage.local.set({
                words: this.words,
                stats: this.stats
            });
        } catch (error) {
            console.error('Veri kaydedilirken hata:', error);
            this.showNotification('Veri kaydedilirken hata oluştu!', 'error');
        }
    }

    // Event listeners
    setupEventListeners() {
        // Ana menü butonları
        document.getElementById('add-word-btn').addEventListener('click', () => {
            this.showSection('add-word-section');
        });

        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('view-words-btn').addEventListener('click', () => {
            this.showWordList();
        });

        document.getElementById('view-stats-btn').addEventListener('click', () => {
            this.showStats();
        });

        // Kelime ekleme
        document.getElementById('add-word-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWord();
        });

        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showSection('main-menu');
        });

        // Quiz
        document.getElementById('close-quiz').addEventListener('click', () => {
            this.endQuiz();
        });

        document.getElementById('quiz-answer').addEventListener('keypress', (e) => {
            console.log('⌨️ Keypress event captured, key:', e.key);
            if (e.key === 'Enter') {
                console.log('✅ Enter key detected, calling handleQuizEnter');
                this.handleQuizEnter();
            }
        });

        // Geri butonları
        document.getElementById('back-from-words').addEventListener('click', () => {
            this.showSection('main-menu');
        });

        document.getElementById('back-from-stats').addEventListener('click', () => {
            this.showSection('main-menu');
        });

        // İstatistik sıfırlama
        document.getElementById('reset-stats').addEventListener('click', () => {
            this.resetStats();
        });

        // Export
        document.getElementById('export-words').addEventListener('click', () => {
            this.exportWords();
        });

        // JSON Paste
        document.getElementById('paste-json-btn').addEventListener('click', () => {
            this.showPasteJsonSection();
        });

        document.getElementById('process-json').addEventListener('click', () => {
            this.processJsonPaste();
        });

        document.getElementById('cancel-paste').addEventListener('click', () => {
            this.hidePasteJsonSection();
        });

        document.getElementById('clear-textarea').addEventListener('click', () => {
            document.getElementById('json-textarea').value = '';
            document.getElementById('json-textarea').focus();
        });

        // Debug panel
        document.getElementById('close-debug').addEventListener('click', () => {
            this.hideDebugPanel();
        });
    }

    // Bölüm gösterme
    showSection(sectionId) {
        // Tüm bölümleri gizle
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });

        // İstenen bölümü göster
        document.getElementById(sectionId).classList.remove('hidden');
        this.currentSection = sectionId;

        // Form alanlarını temizle
        if (sectionId === 'add-word-section') {
            document.getElementById('add-word-form').reset();
        }
    }

    // Kelime ekleme
    async addWord() {
        const englishWord = document.getElementById('english-word').value.trim().toLowerCase();
        const turkishWord = document.getElementById('turkish-word').value.trim().toLowerCase();
        const exampleSentence = document.getElementById('example-sentence').value.trim();

        if (!englishWord || !turkishWord) {
            this.showNotification('Lütfen İngilizce kelime ve Türkçe karşılığını doldurun!', 'error');
            return;
        }

        // Kelime zaten var mı kontrol et
        const existingWord = this.words.find(word => word.english === englishWord);
        if (existingWord) {
            this.showNotification('Bu kelime zaten listede mevcut!', 'error');
            return;
        }

        // Yeni kelime objesi oluştur
        const newWord = {
            id: Date.now(),
            english: englishWord,
            turkish: turkishWord,
            addedDate: new Date().toISOString()
        };

        // Örnek cümle varsa ekle
        if (exampleSentence) {
            newWord.example = exampleSentence;
        }

        this.words.push(newWord);

        await this.saveData();
        this.showNotification('Kelime başarıyla eklendi!');
        document.getElementById('add-word-form').reset();
        document.getElementById('english-word').focus();
    }

    // Quiz başlatma
    startQuiz() {
        console.log('🎯 Quiz başlatılıyor, kelime sayısı:', this.words.length);

        if (this.words.length === 0) {
            console.log('❌ Kelime yok, quiz başlatılamıyor');
            this.showNotification('Quiz başlatmak için en az bir kelime eklemelisiniz!', 'error');
            return;
        }

        // Quiz kelimelerini karıştır
        this.quizWords = [...this.words].sort(() => Math.random() - 0.5);
        this.currentQuizIndex = 0;
        this.stats.currentCorrect = 0;
        this.stats.currentWrong = 0;

        console.log('🔀 Quiz kelimeleri karıştırıldı:', this.quizWords.length, 'kelime');
        console.log('📊 Quiz istatistikleri sıfırlandı');

        this.showSection('quiz-section');
        console.log('📱 Quiz bölümü gösterildi');

        this.loadNextQuestion();
        this.updateQuizScore();
        console.log('🚀 Quiz başlatıldı!');
    }

    // Sonraki soruyu yükle
    loadNextQuestion() {
        console.log('📚 loadNextQuestion çağrıldı, index:', this.currentQuizIndex, 'toplam:', this.quizWords.length);

        if (this.currentQuizIndex >= this.quizWords.length) {
            console.log('🏁 Quiz bitiyor - tüm sorular tamamlandı');
            this.endQuiz();
            return;
        }

        console.log('📖 Yeni soru yükleniyor...');
        this.currentQuizWord = this.quizWords[this.currentQuizIndex];
        console.log('📝 Mevcut kelime:', this.currentQuizWord);

        document.getElementById('quiz-english-word').textContent = this.currentQuizWord.english;
        
        // Örnek cümleyi göster veya gizle
        const exampleElement = document.getElementById('quiz-example-sentence');
        if (this.currentQuizWord.example) {
            exampleElement.textContent = `"${this.currentQuizWord.example}"`;
            exampleElement.classList.remove('hidden');
        } else {
            exampleElement.textContent = '';
            exampleElement.classList.add('hidden');
        }
        
        document.getElementById('quiz-answer').value = '';
        document.getElementById('quiz-answer').focus();

        // Feedback'i gizle
        const feedbackEl = document.getElementById('answer-feedback');

        console.log('🔄 UI güncelleniyor...');
        console.log('🔍 UI Durumu - Güncelleme öncesi:');
        console.log('  - Feedback gizli mi:', feedbackEl.classList.contains('hidden'));
        
        feedbackEl.classList.add('hidden');

        // Double check - UI durumunu kontrol et
        console.log('🔍 UI Durumu - Güncelleme sonrası:');
        console.log('  - Feedback gizli mi:', feedbackEl.classList.contains('hidden'));

        console.log('✅ Yeni soru yüklendi:', this.currentQuizWord.english);
    }

    // Quiz Enter tuşu işleyicisi
    handleQuizEnter() {
        const feedbackEl = document.getElementById('answer-feedback');

        // Feedback görünür mü kontrol et - sadece feedback'in hidden class'ını kontrol et
        const isFeedbackShown = !feedbackEl.classList.contains('hidden');
        console.log('⌨️ Enter tuşuna basıldı, feedback gösteriliyor mu:', isFeedbackShown);
        console.log('🔍 Feedback class durumu:', feedbackEl.classList.contains('hidden'));

        if (isFeedbackShown) {
            // Feedback gösteriliyorsa, sonraki soruya geç
            console.log('➡️ Feedback gösteriliyor, sonraki soruya geçiliyor');
            this.nextQuestion();
        } else {
            // Feedback gösterilmiyorsa, cevabı kontrol et
            console.log('✅ Feedback gösterilmiyor, cevap kontrol ediliyor');
            this.checkAnswer();
        }
    }

    // Cevabı kontrol et
    checkAnswer() {
        const userAnswer = document.getElementById('quiz-answer').value.trim().toLowerCase();
        const correctAnswer = this.currentQuizWord.turkish.toLowerCase();
        console.log('🔍 Cevap kontrol ediliyor - Kullanıcı:', userAnswer, 'Doğru:', correctAnswer);

        const isCorrect = userAnswer === correctAnswer;
        console.log('📊 Cevap sonucu:', isCorrect ? 'Doğru ✅' : 'Yanlış ❌');

        if (isCorrect) {
            this.stats.currentCorrect++;
            this.stats.totalCorrect++;
            this.showAnswerFeedback(true, correctAnswer);
        } else {
            this.stats.currentWrong++;
            this.stats.totalWrong++;
            this.showAnswerFeedback(false, correctAnswer, userAnswer);
        }

        this.updateQuizScore();
        this.saveData();
    }

    // Cevap feedback'i göster
    showAnswerFeedback(isCorrect, correctAnswer, userAnswer = '') {
        console.log('💬 Feedback gösteriliyor:', isCorrect ? 'Doğru' : 'Yanlış');

        const feedbackEl = document.getElementById('answer-feedback');
        const messageEl = document.getElementById('feedback-message');

        feedbackEl.classList.remove('correct', 'wrong');

        if (isCorrect) {
            feedbackEl.classList.add('correct');
            messageEl.innerHTML = `
                <div style="font-size: 16px; margin-bottom: 8px;">✅ Doğru!</div>
                <div><strong>${this.currentQuizWord.english}</strong> = <strong>${correctAnswer}</strong></div>
            `;
        } else {
            feedbackEl.classList.add('wrong');
            messageEl.innerHTML = `
                <div style="font-size: 16px; margin-bottom: 6px;">❌ Yanlış!</div>
                <div style="font-size: 13px; margin-bottom: 4px;">Sizin cevabınız: <strong>${userAnswer || '(boş)'}</strong></div>
                <div style="font-size: 13px;">Doğru cevap: <strong>${correctAnswer}</strong></div>
            `;
        }

        console.log('🔄 Quiz content gizleniyor, feedback gösteriliyor');
        // CSS class kullanarak quiz content'i gizle
        //document.getElementById('quiz-content').classList.add('hidden');
        feedbackEl.classList.remove('hidden');
        console.log('✅ Feedback gösterildi');
    }


    // Sonraki soru
    nextQuestion() {
        console.log('🔄 nextQuestion çağrıldı, mevcut index:', this.currentQuizIndex);
        this.currentQuizIndex++;
        console.log('📈 Index artırıldı, yeni index:', this.currentQuizIndex, 'toplam kelime:', this.quizWords.length);
        this.loadNextQuestion();
    }

    // Quiz'i bitir
    endQuiz() {
        const totalQuestions = this.stats.currentCorrect + this.stats.currentWrong;
        const successRate = totalQuestions > 0 ? Math.round((this.stats.currentCorrect / totalQuestions) * 100) : 0;

        alert(`Quiz Tamamlandı!\n\nDoğru: ${this.stats.currentCorrect}\nYanlış: ${this.stats.currentWrong}\nBaşarı Oranı: %${successRate}`);
        
        this.showSection('main-menu');
        this.updateStats();
    }

    // Quiz skorunu güncelle
    updateQuizScore() {
        document.getElementById('correct-count').textContent = this.stats.currentCorrect;
        document.getElementById('wrong-count').textContent = this.stats.currentWrong;
    }

    // Kelime listesini göster
    showWordList() {
        this.showSection('word-list-section');
        this.renderWordList();
    }

    // Kelime listesini render et
    renderWordList() {
        console.log('🔄 renderWordList çağrıldı, kelime sayısı:', this.words.length);

        const container = document.getElementById('words-container');
        const countEl = document.getElementById('word-count');

        if (!container || !countEl) {
            console.log('❌ Container veya countEl bulunamadı');
            return;
        }

        countEl.textContent = `Toplam: ${this.words.length} kelime`;
        console.log('✅ Kelime sayısı güncellendi:', this.words.length);

        if (this.words.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Henüz kelime eklenmemiş.</div>';
            console.log('ℹ️ Kelime listesi boş, placeholder gösterildi');
            return;
        }

        container.innerHTML = this.words.map(word => `
            <div class="word-item" data-word-id="${word.id}">
                <div class="word-pair">
                    <div class="word-english" data-field="english">${word.english}</div>
                    <div class="word-turkish" data-field="turkish">${word.turkish}</div>
                    ${word.example ? `<div class="word-example" data-field="example">"${word.example}"</div>` : ''}
                </div>
                <div class="word-actions">
                    <button class="edit-word" data-word-id="${word.id}" title="Düzenle">✏️</button>
                    <button class="delete-word" data-word-id="${word.id}" title="Sil">🗑️</button>
                </div>
            </div>
        `).join('');

        console.log('✅ Kelime listesi HTML oluşturuldu');

        // Delete butonlarına event listener ekle
        const deleteButtons = container.querySelectorAll('.delete-word');
        console.log('🔄 Delete butonları bulundu:', deleteButtons.length);
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const wordId = parseInt(e.target.getAttribute('data-word-id'));
                console.log('🗑️ Delete butonu tıklandı, wordId:', wordId);
                this.deleteWord(wordId);
            });
        });

        // Edit butonlarına event listener ekle
        const editButtons = container.querySelectorAll('.edit-word');
        console.log('🔄 Edit butonları bulundu:', editButtons.length);
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const wordId = parseInt(e.target.getAttribute('data-word-id'));
                console.log('✏️ Edit butonu tıklandı, wordId:', wordId);
                this.editWord(wordId);
            });
        });

        console.log('✅ renderWordList tamamlandı');
    }

    // Kelime silme
    async deleteWord(wordId) {
        console.log('🗑️ deleteWord çağrıldı, wordId:', wordId);
        console.log('📊 Mevcut kelime sayısı:', this.words.length);

        const wordToDelete = this.words.find(word => word.id === wordId);
        console.log('🔍 Silinecek kelime:', wordToDelete);

        if (!wordToDelete) {
            console.log('❌ Kelime bulunamadı!');
            this.showNotification('Kelime bulunamadı!', 'error');
            return;
        }

        if (confirm(`"${wordToDelete.english} - ${wordToDelete.turkish}" kelimesini silmek istediğinizden emin misiniz?`)) {
            console.log('✅ Kullanıcı silmeyi onayladı');
            this.words = this.words.filter(word => word.id !== wordId);
            console.log('📊 Yeni kelime sayısı:', this.words.length);

            await this.saveData();
            console.log('💾 Veriler kaydedildi');

            this.renderWordList();
            console.log('🔄 Liste güncellendi');

            this.showNotification('Kelime silindi!');
            console.log('✅ Silme işlemi tamamlandı');
        } else {
            console.log('❌ Kullanıcı silmeyi iptal etti');
        }
    }

    // Kelime düzenleme
    editWord(wordId) {
        console.log('✏️ editWord çağrıldı, wordId:', wordId);

        const word = this.words.find(w => w.id === wordId);
        if (!word) {
            console.log('❌ Kelime bulunamadı!');
            this.showNotification('Kelime bulunamadı!', 'error');
            return;
        }

        console.log('📝 Düzenlenecek kelime:', word);

        // Prompt ile düzenleme
        const newEnglish = prompt('İngilizce kelimeyi düzenleyin:', word.english);
        if (newEnglish === null) {
            console.log('❌ Düzenleme iptal edildi');
            return;
        }

        const newTurkish = prompt('Türkçe karşılığı düzenleyin:', word.turkish);
        if (newTurkish === null) {
            console.log('❌ Düzenleme iptal edildi');
            return;
        }

        const currentExample = word.example || '';
        const newExample = prompt('Örnek cümle (boş bırakabilirsiniz):', currentExample);
        if (newExample === null) {
            console.log('❌ Düzenleme iptal edildi');
            return;
        }

        // Boş değer kontrolü
        if (!newEnglish.trim() || !newTurkish.trim()) {
            console.log('❌ Boş değer girildi');
            this.showNotification('Kelime ve karşılığı boş olamaz!', 'error');
            return;
        }

        // Aynı İngilizce kelime var mı kontrol et (kendisi hariç)
        const existingWord = this.words.find(w => w.id !== wordId && w.english.toLowerCase() === newEnglish.toLowerCase().trim());
        if (existingWord) {
            console.log('❌ Aynı İngilizce kelime zaten var');
            this.showNotification('Bu İngilizce kelime zaten listede mevcut!', 'error');
            return;
        }

        // Kelimeyi güncelle
        word.english = newEnglish.toLowerCase().trim();
        word.turkish = newTurkish.toLowerCase().trim();
        word.updatedDate = new Date().toISOString();
        
        // Örnek cümleyi güncelle
        if (newExample.trim()) {
            word.example = newExample.trim();
        } else {
            delete word.example; // Örnek cümle yoksa sil
        }

        console.log('✅ Kelime güncellendi:', word);

        // Kaydet ve listeyi güncelle
        this.saveData();
        this.renderWordList();
        this.showNotification('Kelime başarıyla güncellendi!');
        console.log('✅ Düzenleme işlemi tamamlandı');
    }

    // İstatistikleri göster
    showStats() {
        this.showSection('stats-section');
        this.updateStats();
    }

    // İstatistikleri güncelle
    updateStats() {
        const totalQuestions = this.stats.totalCorrect + this.stats.totalWrong;
        const successRate = totalQuestions > 0 ? Math.round((this.stats.totalCorrect / totalQuestions) * 100) : 0;

        document.getElementById('total-words').textContent = this.words.length;
        document.getElementById('total-correct').textContent = this.stats.totalCorrect;
        document.getElementById('total-wrong').textContent = this.stats.totalWrong;
        document.getElementById('success-rate').textContent = `${successRate}%`;
    }

    // İstatistikleri sıfırla
    async resetStats() {
        if (confirm('Tüm istatistikleri sıfırlamak istediğinizden emin misiniz?')) {
            this.stats = {
                totalCorrect: 0,
                totalWrong: 0,
                currentCorrect: 0,
                currentWrong: 0
            };
            await this.saveData();
            this.updateStats();
            this.showNotification('İstatistikler sıfırlandı!');
        }
    }

    // Kelimeleri dışa aktar
    exportWords() {
        if (this.words.length === 0) {
            this.showNotification('Dışa aktarılacak kelime bulunamadı!', 'error');
            return;
        }

        const exportData = {
            words: this.words,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `english-words-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showNotification(`${this.words.length} kelime başarıyla dışa aktarıldı!`);
    }

    // Kelimeleri içe aktar
    async importWords(event) {
        console.log('🔄 Import başlatıldı');
        this.clearDebugPanel();
        this.addDebugStep('Import işlemi başlatıldı', 'info');

        const file = event.target.files[0];
        if (!file) {
            console.log('❌ Dosya seçilmedi');
            this.addDebugStep('Hata: Dosya seçilmedi', 'error');
            this.showNotification('Dosya seçilmedi!', 'error');
            return;
        }

        console.log('📁 Dosya seçildi:', file.name, 'Boyut:', file.size, 'bytes');
        this.addDebugStep(`Dosya seçildi: ${file.name} (${file.size} bytes)`, 'success');
        this.showNotification('Dosya yükleniyor...', 'info');

        try {
            console.log('📖 Dosya okunuyor...');
            this.addDebugStep('Dosya içeriği okunuyor...', 'info');
            const text = await file.text();
            console.log('✅ Dosya okundu, boyut:', text.length, 'karakter');
            this.addDebugStep(`Dosya okundu (${text.length} karakter)`, 'success');

            console.log('🔍 JSON parse ediliyor...');
            this.addDebugStep('JSON formatı kontrol ediliyor...', 'info');
            const importData = JSON.parse(text);
            console.log('✅ JSON parse edildi:', importData);
            this.addDebugStep('JSON formatı geçerli', 'success');

            // Ortak import işlemini çağır
            await this.processImportData(importData, 'file');

        } catch (error) {
            console.error('Import hatası:', error);
            this.addDebugStep(`Hata: ${error.message}`, 'error');
            this.showNotification(`Dosya içe aktarılırken hata oluştu: ${error.message}`, 'error');
        }

        // File input'u temizle
        event.target.value = '';
    }

    // JSON Paste bölümünü göster/gizle
    showPasteJsonSection() {
        document.getElementById('paste-json-section').classList.remove('hidden');
        document.getElementById('json-textarea').focus();
        this.addDebugStep('JSON yapıştırma alanı açıldı', 'info');
    }

    hidePasteJsonSection() {
        document.getElementById('paste-json-section').classList.add('hidden');
        document.getElementById('json-textarea').value = '';
    }

    // JSON paste işlemi
    async processJsonPaste() {
        const textarea = document.getElementById('json-textarea');
        const jsonText = textarea.value.trim();

        if (!jsonText) {
            this.addDebugStep('Hata: JSON verisi boş', 'error');
            this.showNotification('Lütfen JSON verisini yapıştırın!', 'error');
            return;
        }

        console.log('📋 JSON paste işlemi başlatıldı');
        this.clearDebugPanel();
        this.addDebugStep('JSON paste işlemi başlatıldı', 'info');
        this.addDebugStep(`JSON verisi alındı (${jsonText.length} karakter)`, 'success');

        try {
            // JSON parse et
            this.addDebugStep('JSON formatı kontrol ediliyor...', 'info');
            const importData = JSON.parse(jsonText);
            console.log('✅ JSON parse edildi:', importData);
            this.addDebugStep('JSON formatı geçerli', 'success');

            // Import işlemini çağır (aynı logic)
            await this.processImportData(importData, 'paste');

            // Başarılı olursa textarea'yı temizle ve gizle
            this.hidePasteJsonSection();

        } catch (error) {
            console.error('JSON paste hatası:', error);
            this.addDebugStep(`JSON Hatası: ${error.message}`, 'error');
            this.showNotification(`JSON formatı geçersiz: ${error.message}`, 'error');
        }
    }

    // Import verisi işleme (hem dosya hem paste için ortak)
    async processImportData(importData, source = 'file') {
        // Veri formatını kontrol et
        this.addDebugStep('Kelime verisi kontrol ediliyor...', 'info');
        if (!importData.words || !Array.isArray(importData.words)) {
            console.log('❌ Geçersiz format: words array bulunamadı');
            this.addDebugStep('Hata: words array bulunamadı', 'error');
            throw new Error('Geçersiz format - words array bulunamadı');
        }

        console.log('✅ Format geçerli, kelime sayısı:', importData.words.length);
        this.addDebugStep(`${importData.words.length} kelime bulundu`, 'success');
        this.addDebugStep(`Mevcut kelime sayısı: ${this.words.length}`, 'info');

        let importedCount = 0;
        let skippedCount = 0;

        console.log('🔄 Kelimeler işleniyor...');
        this.addDebugStep('Kelimeler işleniyor...', 'info');

        // Her kelimeyi kontrol et ve ekle
        for (const word of importData.words) {
            if (!word.english || !word.turkish) {
                skippedCount++;
                continue;
            }

            // Kelime zaten var mı kontrol et
            const existingWord = this.words.find(w => w.english.toLowerCase() === word.english.toLowerCase());
            if (existingWord) {
                skippedCount++;
                continue;
            }

            // Yeni kelime objesi oluştur
            const newWord = {
                id: Date.now() + Math.random(),
                english: word.english.toLowerCase(),
                turkish: word.turkish.toLowerCase(),
                addedDate: new Date().toISOString()
            };

            // Örnek cümle varsa ekle
            if (word.example && word.example.trim()) {
                newWord.example = word.example.trim();
            }

            this.words.push(newWord);
            importedCount++;
        }

        console.log('📊 İşlem tamamlandı - Eklenen:', importedCount, 'Atlanan:', skippedCount);
        this.addDebugStep(`${importedCount} kelime eklendi, ${skippedCount} kelime atlandı`, 'success');
        this.addDebugStep(`Yeni toplam: ${this.words.length} kelime`, 'info');

        // Veriyi kaydet
        console.log('💾 Veriler kaydediliyor...');
        this.addDebugStep('Veriler kaydediliyor...', 'info');
        await this.saveData();
        console.log('✅ Veriler kaydedildi');
        this.addDebugStep('Veriler başarıyla kaydedildi', 'success');

        // Kelime listesini güncelle
        console.log('🔄 Mevcut bölüm:', this.currentSection);
        this.addDebugStep(`Mevcut bölüm: ${this.currentSection}`, 'info');
        if (this.currentSection === 'word-list-section') {
            console.log('🔄 Kelime listesi güncelleniyor...');
            this.addDebugStep('Kelime listesi güncelleniyor...', 'info');
            this.renderWordList();
            console.log('✅ Kelime listesi güncellendi');
            this.addDebugStep('Kelime listesi güncellendi', 'success');
        } else {
            console.log('ℹ️ Kelime listesi bölümünde değil, liste güncellenmedi');
            this.addDebugStep('Kelime listesi bölümünde değil - liste güncellenmedi', 'warning');
        }

        // İstatistikleri güncelle
        console.log('📊 İstatistikler güncelleniyor...');
        this.addDebugStep('İstatistikler güncelleniyor...', 'info');
        this.updateStats();
        console.log('✅ İstatistikler güncellendi');
        this.addDebugStep('İstatistikler güncellendi', 'success');

        // Başarı mesajı
        const sourceText = source === 'paste' ? 'yapıştırma' : 'dosya';
        let message = `${importedCount} kelime ${sourceText} ile başarıyla eklendi!`;
        if (skippedCount > 0) {
            message += ` (${skippedCount} kelime atlandı)`;
        }

        console.log('✅ Import tamamlandı:', message);
        this.addDebugStep(`${sourceText.charAt(0).toUpperCase() + sourceText.slice(1)} işlemi tamamlandı!`, 'success');
        this.showNotification(message, 'success');
    }

    // Debug panel göster/gizle
    showDebugPanel() {
        document.getElementById('debug-panel').classList.remove('hidden');
    }

    hideDebugPanel() {
        document.getElementById('debug-panel').classList.add('hidden');
    }

    // Debug mesajı ekle
    addDebugStep(message, type = 'info') {
        const debugContent = document.getElementById('debug-content');
        const step = document.createElement('div');
        step.className = `debug-step ${type}`;
        step.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

        debugContent.appendChild(step);
        debugContent.scrollTop = debugContent.scrollHeight;

        this.showDebugPanel();
    }

    // Debug paneli temizle
    clearDebugPanel() {
        const debugContent = document.getElementById('debug-content');
        debugContent.innerHTML = '<div class="debug-step">Hazır...</div>';
    }

    // Bildirim göster
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notification-message');

        messageEl.textContent = message;
        notification.classList.remove('error', 'info');

        if (type === 'error') {
            notification.classList.add('error');
        } else if (type === 'info') {
            notification.classList.add('info');
        }

        notification.classList.remove('hidden');

        // Info mesajları daha kısa süre göster
        const duration = type === 'info' ? 1500 : 3000;
        setTimeout(() => {
            notification.classList.add('hidden');
        }, duration);
    }
}

// Uygulamayı başlat
console.log('📄 POPUP SCRIPT SONU - DOMContentLoaded BEKLENİYOR');
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM YÜKLENDİ - APP OLUŞTURULUYOR');
    app = new EnglishLearningApp();
    console.log('✅ APP OLUŞTURULDU:', app);
});
