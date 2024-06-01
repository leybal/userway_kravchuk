function enhanceImagesWithAltText (highlightClass = 'highlighted-img', inputClass = 'alt-input') {
    document.addEventListener('DOMContentLoaded', function() {
        const defaultAltText = 'Somthing went wrong. Please reload the page or try again later.';

        async function fetchRandomWord() {
            try {
                const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
                const words = await response.json();
                return words[0];
            } catch (error) {
                console.error('Error fetching random word:', error);
                return defaultAltText;
            }
        }

        async function setRandomAltText(img) {
            const randomWord = await fetchRandomWord();
            img.alt = randomWord;
            img.classList.add(highlightClass);
        }

        function addAltTextInput(img) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = img.alt;
            input.className = inputClass;
            input.setAttribute('aria-label', 'Edit alt text');
            
            img.insertAdjacentElement('afterend', input);
            positionInputField(img, input);
            input.focus();

            const updateAlt = () => {
                img.alt = input.value;
                img.classList.add(highlightClass);
                input.remove();
            };

            input.addEventListener('blur', updateAlt);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    updateAlt();
                }
            });
        }

        function positionInputField(img, input) {
            const imgRect = img.getBoundingClientRect();
            console.log(imgRect);
            input.style.top = `${window.scrollY + imgRect.top + imgRect.height}px`;
            input.style.left = `${window.scrollX + imgRect.left + 10}px`;
        }

        function scanAndSetAltText() {
            document.querySelectorAll('img').forEach(img => setRandomAltText(img));
        }

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'IMG') {
                            setRandomAltText(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        document.body.addEventListener('click', (event) => {
            if (event.target.tagName === 'IMG') {
                addAltTextInput(event.target);
            }
        });

        scanAndSetAltText();
    });
}
