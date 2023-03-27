const loader = document.querySelector('#loader');
const sortSelect = document.querySelector('#sortSelect');
const row = document.querySelector('.row');

// hide the loader when the quotes are loaded
function hideLoader() {
    loader.style.display = 'none';
    row.style.display = 'block';
}

// show the loader while the quotes are loading
function showLoader() {
    loader.style.display = 'block';
    row.style.display = 'none';
}

// load quotes on page load
window.addEventListener('load', () => {
    showLoader();
    fetch(`https://type.fit/api/quotes`)
        .then(response => response.json())
        .then(data => {
            let quotes = data;
            shuffleQuotes(quotes);
            updateQuotes(quotes);
            hideLoader();
        });
});

// load quotes when reshuffle button is clicked
document.querySelector('#reshuffleBtn').addEventListener('click', () => {
    const sortOption = sortSelect.value;
    showLoader();
    fetch(`https://type.fit/api/quotes`)
        .then(response => response.json())
        .then(data => {
            let quotes = data;
            if (sortOption === 'author') {
                quotes = sortQuotesByAuthor(quotes);
            } else {
                shuffleQuotes(quotes);
            }
            updateQuotes(quotes);
            hideLoader();
        });
});

// shuffle the quotes randomly
function shuffleQuotes(quotes) {
    for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
    }
}

// sort the quotes by author
function sortQuotesByAuthor(quotes) {
    return quotes.sort((a, b) => {
        if (a.author > b.author) {
            return 1;
        } else if (a.author < b.author) {
            return -1;
        } else {
            return 0;
        }
    });
}

// update the UI with the quotes
function updateQuotes(quotes) {
    row.innerHTML = '';
    quotes.forEach(quote => {
        const card = document.createElement('div');
        card.classList.add('col-lg-4', 'col-md-6', 'col-sm-12');
        card.innerHTML = `
            <div class="card">
                <blockquote class="blockquote mb-0">
                    <p>${quote.text}</p>
                    <footer class="blockquote-footer">${quote.author || 'Unknown'}</footer>
                </blockquote>
                <div class="copy-button-container">
                    <button class="btn btn-secondary copy-button" data-toggle="tooltip" data-placement="top" title="Quote copied to clipboard!">Copy</button>
                </div>
            </div>
        `;
        row.appendChild(card);

        const copyButton = card.querySelector('.copy-button');
        copyButton.addEventListener('click', () => {
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = `"${quote.text}" - ${quote.author || 'Unknown'}`;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            copyButton.setAttribute('data-original-title', 'Quote copied to clipboard!');
            $(copyButton).tooltip('show');
            // alert('Quote copied to clipboard!');
        });
    });
}
