document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const urlInput = document.getElementById('video-url');
    const pasteBtn = document.getElementById('paste-btn');
    const fetchBtn = document.getElementById('fetch-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const btnText = document.querySelector('.btn-text');
    const errorMessage = document.getElementById('error-message');
    
    const inputSection = document.getElementById('input-section');
    const previewSection = document.getElementById('preview-section');
    
    const videoThumbnail = document.getElementById('video-thumbnail');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    let currentVideoUrl = null;

    if (pasteBtn) {
        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    urlInput.value = text;
                    urlInput.focus();
                }
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) return;

        // Reset state
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
        
        // Show loading state
        fetchBtn.disabled = true;
        btnText.textContent = 'Fetching...';
        loadingSpinner.classList.remove('hidden');

        try {
            const response = await fetch('/api/video-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch video details.');
            }

            // Update UI with video details
            
            // Set up error handler before setting src
            videoThumbnail.onerror = () => {
                console.error('Thumbnail failed to load, using placeholder');
                videoThumbnail.onerror = null; // prevent infinite loop
                videoThumbnail.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="284" fill="%23334155"><rect width="160" height="284" rx="12"/><text x="80" y="142" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">No Preview</text></svg>');
            };
            
            if (data.thumbnail) {
                videoThumbnail.src = `/api/proxy-image?url=${encodeURIComponent(data.thumbnail)}`;
            } else {
                videoThumbnail.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="284" fill="%23334155"><rect width="160" height="284" rx="12"/><text x="80" y="142" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="sans-serif">No Preview</text></svg>');
            }
            currentVideoUrl = data.video_url;

            // Transition from Input to Preview
            inputSection.classList.add('hidden');
            previewSection.classList.remove('hidden');
            previewSection.classList.add('fade-in');

        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            // Restore button state
            fetchBtn.disabled = false;
            btnText.textContent = 'Get Video';
            loadingSpinner.classList.add('hidden');
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!currentVideoUrl) return;

        // Route through our server proxy to force a proper file download
        window.location.href = `/api/download?url=${encodeURIComponent(currentVideoUrl)}`;
    });

    resetBtn.addEventListener('click', () => {
        // Reset state
        urlInput.value = '';
        currentVideoUrl = null;
        
        // Hide preview, show input
        previewSection.classList.add('hidden');
        previewSection.classList.remove('fade-in');
        inputSection.classList.remove('hidden');
        inputSection.classList.add('fade-in');
        
        // Focus input
        setTimeout(() => urlInput.focus(), 100);
    });

    // Register PWA service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
});
