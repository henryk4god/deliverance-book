// Book Configuration
const BOOK_CONFIG = {
    title: "Breaking Generational Chains",
    author: "Spiritual Breakthrough Ministry",
    chapters: [
        { title: "Table of Contents", file: "content/toc.md" },
        { title: "Chapter 1: Identifying Ancestral Patterns and Spiritual Strongholds", file: "content/chapter1.md" },
        { title: "Chapter 2: Biblical Foundation and Spiritual Authority", file: "content/chapter2.md" },
        { title: "Chapter 3: Fasting and Prayer Protocols for Breakthrough", file: "content/chapter3.md" },
        { title: "Chapter 4: Deliverance Techniques and Spiritual Warfare", file: "content/chapter4.md" },
        { title: "Chapter 5: Building Spiritual Protection Systems", file: "content/chapter5.md" },
        { title: "Chapter 6: Establishing Generational Blessings", file: "content/chapter6.md" }
    ]
};

// App State
const state = {
    currentChapter: 0,
    theme: localStorage.getItem('theme') || 'light',
    audioEnabled: false,
    speechSynthesis: null,
    lastReadPosition: JSON.parse(localStorage.getItem('lastReadPosition')) || { chapter: 0, position: 0 }
};

// DOM Elements
const elements = {
    landingPage: document.getElementById('landing-page'),
    readerPage: document.getElementById('reader-page'),
    startReading: document.getElementById('start-reading'),
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.getElementById('menu-toggle'),
    closeSidebar: document.getElementById('close-sidebar'),
    overlay: document.getElementById('overlay'),
    toc: document.getElementById('toc'),
    chapterTitle: document.getElementById('chapter-title'),
    chapterContent: document.getElementById('chapter-content'),
    themeToggle: document.getElementById('theme-toggle'),
    audioToggle: document.getElementById('audio-toggle'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    prevChapter: document.getElementById('prev-chapter'),
    nextChapter: document.getElementById('next-chapter'),
    reflectionNotes: document.getElementById('reflection-notes'),
    saveReflection: document.getElementById('save-reflection')
};

// Initialize the app
function init() {
    loadChaptersList();
    setupEventListeners();
    applyTheme(state.theme);
    loadReflectionNotes();
    checkLastReadPosition();
}

// Load chapters into table of contents
function loadChaptersList() {
    elements.toc.innerHTML = '';
    
    BOOK_CONFIG.chapters.forEach((chapter, index) => {
        const chapterLink = document.createElement('a');
        chapterLink.className = 'chapter-link';
        chapterLink.textContent = chapter.title;
        chapterLink.href = '#';
        chapterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadChapter(index);
            closeSidebar();
        });
        
        if (index === state.currentChapter) {
            chapterLink.classList.add('active');
        }
        
        elements.toc.appendChild(chapterLink);
    });
}

// Load chapter content
async function loadChapter(chapterIndex) {
    if (chapterIndex < 0 || chapterIndex >= BOOK_CONFIG.chapters.length) return;
    
    state.currentChapter = chapterIndex;
    
    // Update active chapter in TOC
    document.querySelectorAll('.chapter-link').forEach((link, index) => {
        link.classList.toggle('active', index === chapterIndex);
    });
    
    // Update navigation buttons
    elements.prevChapter.disabled = chapterIndex === 0;
    elements.nextChapter.disabled = chapterIndex === BOOK_CONFIG.chapters.length - 1;
    
    // Show loading state
    elements.chapterTitle.textContent = BOOK_CONFIG.chapters[chapterIndex].title;
    elements.chapterContent.innerHTML = '<div class="loading">Loading chapter...</div>';
    
    try {
        // In a real implementation, you would fetch the markdown file
        // For this demo, we'll use the content from your PDF
        const content = await getChapterContent(chapterIndex);
        const htmlContent = marked.parse(content);
        elements.chapterContent.innerHTML = htmlContent;
        
        // Update progress
        updateProgress();
        
        // Save reading position
        saveReadingPosition();
        
        // Scroll to top
        elements.chapterContent.scrollTop = 0;
        
    } catch (error) {
        console.error('Error loading chapter:', error);
        elements.chapterContent.innerHTML = '<div class="error">Error loading chapter content.</div>';
    }
}

// Get chapter content (mock implementation)
async function getChapterContent(chapterIndex) {
    // This is where you would normally fetch from markdown files
    // For this demo, we'll return sample content based on chapter
    const chapterTitles = {
        0: "# TABLE OF CONTENTS\n\n" + BOOK_CONFIG.chapters.map((ch, i) => `${i}. ${ch.title}`).join('\n'),
        1: `# ${BOOK_CONFIG.chapters[1].title}\n\n**Introduction: The Hidden Chains That Bind**\n\nHave you ever wondered why certain negative patterns seem to repeat in your family line? Why does addiction plague generation after generation? Why do financial struggles, broken relationships, or chronic health issues appear to follow your bloodline like an unwelcome inheritance?\n\nYou're not alone in asking these questions. Millions of believers worldwide have discovered that some of life's most persistent challenges aren't just personal failures or bad luck—they're manifestations of generational patterns and spiritual strongholds that have been passed down through family lines.`,
        2: `# ${BOOK_CONFIG.chapters[2].title}\n\n**Introduction: Your Legal Right to Freedom**\n\nIn Chapter 1, you identified the generational patterns and spiritual strongholds affecting your family line. Now comes the next crucial step: understanding your biblical authority to break these chains and claim your spiritual inheritance.\n\nMany believers struggle with generational issues not because they lack faith, but because they don't understand their legal position in Christ.`,
        3: `# ${BOOK_CONFIG.chapters[3].title}\n\n**Introduction: The Power Keys to Breakthrough**\n\nYou've identified the generational strongholds affecting your family (Chapter 1) and established your biblical authority to break them (Chapter 2). Now it's time to engage the most powerful breakthrough tools available to believers: strategic fasting combined with targeted prayer.`,
        4: `# ${BOOK_CONFIG.chapters[4].title}\n\n**Introduction: Taking Territory by Force**\n\nYou've identified generational strongholds (Chapter 1), established your spiritual authority (Chapter 2), and weakened demonic resistance through fasting and prayer (Chapter 3). Now it's time for direct confrontation—the strategic application of deliverance techniques and spiritual warfare.`,
        5: `# ${BOOK_CONFIG.chapters[5].title}\n\n**Introduction: Securing Your Victory**\n\nYou've successfully identified generational strongholds (Chapter 1), established your spiritual authority (Chapter 2), weakened demonic resistance through fasting and prayer (Chapter 3), and removed demonic forces through deliverance (Chapter 4).`,
        6: `# ${BOOK_CONFIG.chapters[6].title}\n\n**Introduction: From Breakthrough to Legacy**\n\nYou've done the hard work. You've identified the ancestral patterns and spiritual strongholds. You've established your biblical authority and learned to operate in spiritual warfare. You've implemented fasting and prayer protocols, engaged in deliverance techniques, and built comprehensive spiritual protection systems.\n\nNow comes the most exciting phase of your journey: establishing generational blessings that will impact not only your own life but the lives of your children, grandchildren, and generations yet to come.`
    };
    
    return chapterTitles[chapterIndex] || '# Chapter Content\n\nContent would be loaded from markdown file.';
}

// Update reading progress
function updateProgress() {
    const progress = ((state.currentChapter + 1) / BOOK_CONFIG.chapters.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.progressText.textContent = `${Math.round(progress)}%`;
}

// Theme management
function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    elements.themeToggle.textContent = theme === 'light' ? '🌙' : '🌞';
}

function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Text-to-speech functionality
function initTextToSpeech() {
    if ('speechSynthesis' in window) {
        state.speechSynthesis = window.speechSynthesis;
        elements.audioToggle.style.display = 'block';
    } else {
        elements.audioToggle.style.display = 'none';
    }
}

function toggleAudio() {
    if (!state.speechSynthesis) return;
    
    if (state.audioEnabled) {
        state.speechSynthesis.cancel();
        state.audioEnabled = false;
        elements.audioToggle.textContent = '🔇';
    } else {
        speakCurrentChapter();
        state.audioEnabled = true;
        elements.audioToggle.textContent = '🔊';
    }
}

function speakCurrentChapter() {
    if (!state.speechSynthesis) return;
    
    const text = elements.chapterContent.textContent || elements.chapterContent.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
        state.audioEnabled = false;
        elements.audioToggle.textContent = '🔇';
    };
    
    state.speechSynthesis.speak(utterance);
}

// Sidebar management
function openSidebar() {
    elements.sidebar.classList.add('active');
    elements.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    elements.sidebar.classList.remove('active');
    elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigation
function goToNextChapter() {
    if (state.currentChapter < BOOK_CONFIG.chapters.length - 1) {
        loadChapter(state.currentChapter + 1);
    }
}

function goToPrevChapter() {
    if (state.currentChapter > 0) {
        loadChapter(state.currentChapter - 1);
    }
}

// Reading position persistence
function saveReadingPosition() {
    const position = {
        chapter: state.currentChapter,
        position: elements.chapterContent.scrollTop
    };
    localStorage.setItem('lastReadPosition', JSON.stringify(position));
}

function checkLastReadPosition() {
    if (state.lastReadPosition.chapter > 0) {
        // In a real app, you might prompt the user to continue from last position
        console.log('Last read position:', state.lastReadPosition);
    }
}

// Reflection notes
function loadReflectionNotes() {
    const savedNotes = localStorage.getItem(`reflection_${state.currentChapter}`);
    if (savedNotes) {
        elements.reflectionNotes.value = savedNotes;
    }
}

function saveReflectionNotes() {
    const notes = elements.reflectionNotes.value;
    localStorage.setItem(`reflection_${state.currentChapter}`, notes);
    
    // Show confirmation
    const originalText = elements.saveReflection.textContent;
    elements.saveReflection.textContent = 'Saved!';
    setTimeout(() => {
        elements.saveReflection.textContent = originalText;
    }, 2000);
}

// Event listeners
function setupEventListeners() {
    // Navigation
    elements.startReading.addEventListener('click', () => {
        elements.landingPage.classList.remove('active');
        elements.readerPage.classList.add('active');
        loadChapter(0);
    });
    
    elements.menuToggle.addEventListener('click', openSidebar);
    elements.closeSidebar.addEventListener('click', closeSidebar);
    elements.overlay.addEventListener('click', closeSidebar);
    
    // Theme and audio
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.audioToggle.addEventListener('click', toggleAudio);
    
    // Chapter navigation
    elements.prevChapter.addEventListener('click', goToPrevChapter);
    elements.nextChapter.addEventListener('click', goToNextChapter);
    
    // Reflection notes
    elements.saveReflection.addEventListener('click', saveReflectionNotes);
    
    // Scroll tracking for progress (simplified)
    elements.chapterContent.addEventListener('scroll', saveReadingPosition);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrevChapter();
        } else if (e.key === 'ArrowRight') {
            goToNextChapter();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initTextToSpeech();
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Handle online/offline status
window.addEventListener('online', () => {
  document.documentElement.classList.remove('offline');
});

window.addEventListener('offline', () => {
  document.documentElement.classList.add('offline');
});
