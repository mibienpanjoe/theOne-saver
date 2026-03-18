document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const urlInput = document.getElementById('video-url');
    const fetchBtn = document.getElementById('fetch-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const btnText = document.querySelector('.btn-text');
    const errorMessage = document.getElementById('error-message');
    
    const inputSection = document.getElementById('input-section');
    const previewSection = document.getElementById('preview-section');
    
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    let currentVideoUrl = null;

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
            videoThumbnail.src = data.thumbnail || 'https://via.placeholder.com/400x700?text=No+Thumbnail';
            videoTitle.textContent = data.title;
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

        // Create a temporary anchor element to trigger download
        // Due to CORS on the actual video URL and browser security, 
        // we might just open it in a new tab if it's a cross-origin link without CORS headers.
        const a = document.createElement('a');
        a.href = currentVideoUrl;
        a.target = '_blank';
        a.download = 'instagram_video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
});
