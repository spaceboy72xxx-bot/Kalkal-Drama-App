// === CLOUDINARY SETUP ===
// Palitan ito ng sarili mong Cloudinary cloud name
const CLOUD_NAME = 'yvoumj23';

// === MGA ELEMENTO ===
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const dramaList = document.getElementById('drama-list');
const uploadBtn = document.getElementById('cloudinary-upload');
const uploadStatus = document.getElementById('upload-status');
const mediaUrlInput = document.getElementById('media-url');
const dramaTitle = document.getElementById('drama-title');
const dramaDesc = document.getElementById('drama-desc');
const saveBtn = document.getElementById('save-drama');

let mediaUrl = '';
let dramas = JSON.parse(localStorage.getItem('kalkalDramas') || '[]');

// === TAB SWITCHING ===
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// === CLOUDINARY UPLOAD ===
let myWidget = window.cloudinary.createUploadWidget({
    cloudName: CLOUD_NAME,
    uploadPreset: 'kalkal_upload',
    multiple: false,
    resourceType: 'auto'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        mediaUrl = result.info.secure_url;
        mediaUrlInput.value = mediaUrl;
        uploadStatus.textContent = '✅ File na napili!';
    }
});

uploadBtn.addEventListener('click', () => {
    myWidget.open();
});

// === SAVE DRAMA ===
saveBtn.addEventListener('click', () => {
    const title = dramaTitle.value.trim();
    const desc = dramaDesc.value.trim();
    
    if (!title) {
        alert('Ilagay ang pamagat');
        return;
    }
    if (!mediaUrl) {
        alert('Mag-upload ng file');
        return;
    }
    
    const newDrama = {
        id: Date.now(),
        title: title,
        description: desc,
        media: mediaUrl,
        date: new Date().toLocaleDateString('tl-PH')
    };
    
    dramas.unshift(newDrama);
    localStorage.setItem('kalkalDramas', JSON.stringify(dramas));
    
    dramaTitle.value = '';
    dramaDesc.value = '';
    mediaUrlInput.value = '';
    mediaUrl = '';
    uploadStatus.textContent = 'Wala pang napipili';
    
    renderDramas();
    
    document.querySelector('[data-tab="home"]').click();
});

// === RENDER DRAMAS ===
function renderDramas() {
    dramaList.innerHTML = '';
    
    if (dramas.length === 0) {
        dramaList.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--gray);">Wala pang na-upload na drama</p>';
        return;
    }
    
    dramas.forEach(drama => {
        const card = document.createElement('div');
        card.className = 'drama-card';
        
        const isVideo = drama.media.includes('.mp4') || drama.media.includes('video');
        
        card.innerHTML = `
            ${isVideo 
                ? `<video class="drama-media" controls src="${drama.media}"></video>`
                : `<img class="drama-media" src="${drama.media}" alt="${drama.title}">`
            }
            <div class="drama-info">
                <h3 class="drama-title">${drama.title}</h3>
                <p class="drama-desc">${drama.description || ''}</p>
                <small style="color:var(--gray);font-size:0.8rem">${drama.date}</small>
            </div>
        `;
        
        dramaList.appendChild(card);
    });
}

renderDramas();
