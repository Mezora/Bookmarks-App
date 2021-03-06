const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
// Palette 
const paletteButton = document.getElementById('button-palette');
const paletteModal = document.getElementById('modal-palette-wrapper');
const paletteModalClose = document.getElementById('close-palette-modal');
const paletteRed = document.getElementById('palette-red');
const paletteBlue = document.getElementById('palette-blue');
const palettePurple = document.getElementById('palette-purple');
const paletteOrange= document.getElementById('palette-orange');
const paletteGreen = document.getElementById('palette-green');
const paletteDark = document.getElementById('palette-dark');

const paletteColors = {
    'red': '#ff2f2f',
    'blue': '#3179ff',
    'purple': '#854495',
    'orange': '#ffb71c',
    'green': '#21aa4e',
    'dark': '#222',
}
let bookmarks = [];

// Palette show menu 
function showPalette() {
    paletteModal.classList.add('show-modal-palette');
}

paletteButton.addEventListener('click', showPalette);

function paletteColorSelector(color) {
    document.documentElement.style.setProperty('--primary-color', color);
}

// Palette color event listener
paletteRed.addEventListener('click', function(){paletteColorSelector(paletteColors.red)});
paletteBlue.addEventListener('click', function(){paletteColorSelector(paletteColors.blue)});
palettePurple.addEventListener('click', function(){paletteColorSelector(paletteColors.purple)});
paletteOrange.addEventListener('click', function(){paletteColorSelector(paletteColors.orange)});
paletteGreen.addEventListener('click', function(){paletteColorSelector(paletteColors.green)});
paletteDark.addEventListener('click', function(){paletteColorSelector(paletteColors.dark)});

// Close modal palette
paletteModalClose.addEventListener('click', () => {
    paletteModal.classList.remove('show-modal-palette');
});
window.addEventListener('click', (e) => {
    (e.target === paletteModal) ? paletteModal.classList.remove('show-modal-palette') : false;
})

// Show Modal - Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal) ? modal.classList.remove('show-modal') : false );

// Validate Form 
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address.');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    // Build items
    bookmarks.forEach((singleElement) => {
        const {name, url} = singleElement;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link 
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch Bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if avalible
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Mezora',
                url: 'https://mezora.ml',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((singleElement, index) => {
        if (singleElement.url === url) {
            bookmarks.splice(index, 1);
        }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
};

// Handle data from Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteUrlEl.focus();
}

// Event Listener 
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();