// API Configuration
const API_KEY = '019fbadb59b9463183c209e4a2563169'; // Replace with your key
const BASE_URL = 'https://api.spoonacular.com/recipes';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recipesGrid = document.getElementById('recipes-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const errorContainer = document.getElementById('error-container');
const filters = document.querySelectorAll('.filter');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load sample recipes on startup
    fetchRecipes('pasta');
    
    // Event listeners
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) fetchRecipes(query);
    });
    
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const diet = filter.getAttribute('data-diet');
            fetchRecipes(searchInput.value.trim(), diet);
        });
    });
    
    // Handle Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) fetchRecipes(query);
        }
    });
});

// Show loading indicator
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    recipesGrid.innerHTML = '';
    errorContainer.classList.add('hidden');
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

// Show error message
function showError(message) {
    errorContainer.classList.remove('hidden');
    errorContainer.innerHTML = `
        <div class="error-message">
            <h3><i class="fas fa-exclamation-triangle"></i> API Error</h3>
            <p>${message}</p>
            <p>Try a different search or come back later</p>
        </div>
    `;
    recipesGrid.innerHTML = '';
}

// Fetch recipes from API
async function fetchRecipes(query, diet = '') {
    showLoading();
    
    try {
        let url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${query}&number=12&addRecipeInformation=true`;
        if (diet) url += `&diet=${diet}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 402) {
                throw new Error('API quota exceeded. Try again tomorrow.');
            }
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        hideLoading();
        displayRecipes(data.results);
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('API Error:', error);
    }
}

// Display recipes
function displayRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
        showError('No recipes found. Try a different search term.');
        return;
    }
    
    recipesGrid.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img">
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${recipe.readyInMinutes} min
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-utensils"></i>
                        ${recipe.servings} servings
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-heart"></i>
                        ${recipe.healthScore}%
                    </div>
                </div>
            </div>
            <a href="${recipe.sourceUrl}" target="_blank" class="view-recipe">
                View Recipe
            </a>
        `;
        recipesGrid.appendChild(recipeCard);
    });
}