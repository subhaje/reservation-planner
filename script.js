// DOM elements
const focusItems = document.querySelectorAll('.focus-item');
const backgroundTextarea = document.querySelector('.background-textarea');
const charCounter = document.querySelector('.char-counter');

// State management
let selectedItems = new Set();

// Initialize the page
function initializePage() {
    // Add click event listeners to all focus items
    focusItems.forEach(item => {
        item.addEventListener('click', handleItemClick);
        
        // Add keyboard support for accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(e);
            }
        });
        
        // Make items focusable for keyboard navigation
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-pressed', 'false');
    });
    
    // Add character counter functionality
    if (backgroundTextarea && charCounter) {
        backgroundTextarea.addEventListener('input', updateCharCounter);
        updateCharCounter(); // Initialize counter
    }
    
    // Add action link functionality
    setupActionLinks();
    
    // Update the initial count
    updateSelectedCount();
}

// Handle item click
function handleItemClick(event) {
    const item = event.currentTarget;
    const itemId = item.dataset.item;
    
    if (selectedItems.has(itemId)) {
        // Item is already selected, so unselect it
        unselectItem(item, itemId);
    } else {
        // Item is not selected, so select it
        selectItem(item, itemId);
    }
    
    // Update the count and UI
    updateSelectedCount();
    updateItemAccessibility(item, itemId);
    
    // Add a subtle animation effect
    addClickAnimation(item);
}

// Select an item
function selectItem(item, itemId) {
    selectedItems.add(itemId);
    item.classList.add('selected');
    item.setAttribute('aria-pressed', 'true');
}

// Unselect an item
function unselectItem(item, itemId) {
    selectedItems.delete(itemId);
    item.classList.remove('selected');
    item.setAttribute('aria-pressed', 'false');
}

// Update the selected count display
function updateSelectedCount() {
    // Find the selected count element if it exists
    const selectedCountElement = document.getElementById('selected-count');
    if (selectedCountElement) {
        const count = selectedItems.size;
        selectedCountElement.textContent = count;
        
        // Update the count element styling based on selection
        if (count > 0) {
            selectedCountElement.style.color = '#1e40af';
            selectedCountElement.style.fontWeight = '700';
        } else {
            selectedCountElement.style.color = '#64748b';
            selectedCountElement.style.fontWeight = '500';
        }
    }
}

// Update item accessibility attributes
function updateItemAccessibility(item, itemId) {
    const isSelected = selectedItems.has(itemId);
    item.setAttribute('aria-pressed', isSelected.toString());
    
    // Update aria-label for screen readers
    const itemText = item.querySelector('.item-text').textContent;
    const status = isSelected ? 'selected' : 'not selected';
    item.setAttribute('aria-label', `${itemText}, ${status}`);
}

// Setup action links
function setupActionLinks() {
    // Select All functionality
    const actionLinks = document.querySelectorAll('.action-link');
    actionLinks.forEach((link, index) => {
        if (link.textContent === 'Select All') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                selectAllItems();
            });
        } else if (link.textContent === 'Clear All') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                clearAllSelections();
            });
        }
    });
}

// Select all items
function selectAllItems() {
    focusItems.forEach(item => {
        const itemId = item.dataset.item;
        if (!selectedItems.has(itemId)) {
            selectItem(item, itemId);
        }
    });
    updateSelectedCount();
    addSelectAllAnimation();
}

// Clear all selections
function clearAllSelections() {
    selectedItems.clear();
    
    // Remove selected class from all items
    focusItems.forEach(item => {
        item.classList.remove('selected');
        item.setAttribute('aria-pressed', 'false');
        
        // Update accessibility
        const itemId = item.dataset.item;
        const itemText = item.querySelector('.item-text').textContent;
        item.setAttribute('aria-label', `${itemText}, not selected`);
    });
    
    // Update the count
    updateSelectedCount();
    
    // Add clear animation
    addClearAnimation();
}

// Update character counter
function updateCharCounter() {
    if (backgroundTextarea && charCounter) {
        const currentLength = backgroundTextarea.value.length;
        const maxLength = backgroundTextarea.maxLength;
        charCounter.textContent = `${currentLength}/${maxLength}`;
        
        // Change color based on usage
        if (currentLength > maxLength * 0.8) {
            charCounter.style.color = '#ef4444';
        } else if (currentLength > maxLength * 0.6) {
            charCounter.style.color = '#f59e0b';
        } else {
            charCounter.style.color = '#6b7280';
        }
    }
}

// Add click animation effect
function addClickAnimation(item) {
    // Create a subtle scale effect
    item.style.transform = 'scale(0.98)';
    setTimeout(() => {
        item.style.transform = '';
    }, 150);
}

// Add select all animation effect
function addSelectAllAnimation() {
    focusItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(1.05)';
            setTimeout(() => {
                item.style.transform = '';
            }, 200);
        }, index * 30);
    });
}

// Add clear animation effect
function addClearAnimation() {
    focusItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        }, index * 30);
    });
}

// Enhanced hover effects
function addEnhancedHoverEffects() {
    focusItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('selected')) {
                item.style.transform = 'translateY(-2px)';
                item.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('selected')) {
                item.style.transform = '';
                item.style.boxShadow = '';
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure smooth loading
    setTimeout(() => {
        initializePage();
        addEnhancedHoverEffects();
    }, 100);
});

// Add some additional utility functions
function getSelectedItems() {
    return Array.from(selectedItems);
}

function getSelectedItemsCount() {
    return selectedItems.size;
}

function isItemSelected(itemId) {
    return selectedItems.has(itemId);
}

// Export functions for potential external use
window.ReservationPlanner = {
    getSelectedItems,
    getSelectedItemsCount,
    isItemSelected,
    clearAllSelections,
    selectAllItems
};
