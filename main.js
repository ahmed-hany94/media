const DATA_FILE = "media.json"
let allMedia = [];

function renderMedia(items) {
    const grid = document.getElementById('media-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<p class="empty-msg">No matching titles found.</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';

        card.innerHTML = `
            <div class="poster-wrapper">
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <span class="badge">${item.type}</span>
            </div>
            <h2 class="media-title">${item.name}</h2>
        `;

        grid.appendChild(card);
    });
}

async function loadMedia() {
    const grid = document.getElementById('media-grid');
    const searchInput = document.getElementById('search-input');

    try {
        const response = await fetch(`./${DATA_FILE}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        for (const [key, item] of Object.entries(data)) {
            const title = item.name || key;
            allMedia.push({
                ...item,
                name: title,
                searchName: title.toLowerCase()
            });
        }

        allMedia.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        renderMedia(allMedia);

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            const filtered = allMedia.filter(item => 
                item.searchName.includes(query)
            );
            renderMedia(filtered);
        });

    } catch (error) {
        console.error('Failed to load media JSON:', error);
        grid.innerHTML = `<p class="error">Could not load media list.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadMedia);
