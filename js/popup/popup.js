import { createActivityContent } from './popupContent.js';

export class Popup {
    constructor() {
        this.createPopupElements();
        this.setupEventListeners();
    }

    createPopupElements() {
        // Create main popup container
        this.popup = document.createElement('div');
        this.popup.className = 'popup';

        // Create popup content
        this.popupContent = document.createElement('div');
        this.popupContent.className = 'popup-content';

        // Create close button
        this.closeBtn = document.createElement('button');
        this.closeBtn.className = 'popup-close clickable topright-button';
        this.closeBtn.innerHTML = '×';

        // Assemble popup
        this.popupContent.appendChild(this.closeBtn);
        this.popup.appendChild(this.popupContent);
        document.body.appendChild(this.popup);
    }

    setupEventListeners() {
        // Close on button click
        this.closeBtn.addEventListener('click', () => this.hide());

        // Close on click outside
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.hide();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.hide();
            }
        });
    }

    show(content) {
        this.popupContent.innerHTML = this.closeBtn.outerHTML + content;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Reattach event listener to the new close button
        const newCloseBtn = this.popupContent.querySelector('.popup-close');
        newCloseBtn.addEventListener('click', () => this.hide());

        // Start animation
        this.popup.style.visibility = 'visible';
        requestAnimationFrame(() => {
            this.popup.classList.add('active');
        });
    }

    hide() {
        this.popup.classList.remove('active');
        // Wait for animation to complete before hiding
        setTimeout(() => {
            this.popup.style.visibility = 'hidden';
            document.body.style.overflow = ''; // Restore scrolling
        }, 200); // Match CSS transition duration
    }

    // Re-export content generation for convenience
    createActivityContent = createActivityContent;
}
