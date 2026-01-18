// State management
let assets = [];
let editingId = null;

// DOM elements
const loadingScreen = document.getElementById('loading');
const appContainer = document.getElementById('app');
const assetForm = document.getElementById('assetForm');
const formTitle = document.getElementById('formTitle');
const submitBtnText = document.getElementById('submitBtnText');
const cancelBtn = document.getElementById('cancelBtn');
const assetsList = document.getElementById('assetsList');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterType = document.getElementById('filterType');

// Form inputs
const inputs = {
    name: document.getElementById('name'),
    type: document.getElementById('type'),
    category: document.getElementById('category'),
    value: document.getElementById('value'),
    purchaseDate: document.getElementById('purchaseDate'),
    status: document.getElementById('status'),
    location: document.getElementById('location'),
    assignedTo: document.getElementById('assignedTo'),
    description: document.getElementById('description')
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAssets();
    setupEventListeners();
});

// Load assets from localStorage
function loadAssets() {
    try {
        const stored = localStorage.getItem('asset-management-data');
        if (stored) {
            assets = JSON.parse(stored);
        }
    } catch (error) {
        console.log('Starting fresh');
    } finally {
        loadingScreen.style.display = 'none';
        appContainer.style.display = 'block';
        updateStats();
        renderAssets();
    }
}

// Save assets to localStorage
function saveAssets() {
    try {
        localStorage.setItem('asset-management-data', JSON.stringify(assets));
        updateStats();
        renderAssets();
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving data!');
    }
}

// Setup event listeners
function setupEventListeners() {
    assetForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', renderAssets);
    filterStatus.addEventListener('change', renderAssets);
    filterType.addEventListener('change', renderAssets);
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();

    const formData = {
        name: inputs.name.value.trim(),
        type: inputs.type.value,
        category: inputs.category.value.trim(),
        value: parseFloat(inputs.value.value) || 0,
        purchaseDate: inputs.purchaseDate.value,
        status: inputs.status.value,
        location: inputs.location.value.trim(),
        assignedTo: inputs.assignedTo.value.trim(),
        description: inputs.description.value.trim()
    };

    if (!formData.name || !formData.type) {
        alert('Please fill Name and Type fields!');
        return;
    }

    if (editingId) {
        // Update existing asset
        const index = assets.findIndex(a => a.id === editingId);
        if (index !== -1) {
            assets[index] = { ...formData, id: editingId };
        }
        editingId = null;
    } else {
        // Add new asset
        const newAsset = {
            ...formData,
            id: Date.now()
        };
        assets.push(newAsset);
    }

    saveAssets();
    resetForm();
}

// Reset form
function resetForm() {
    assetForm.reset();
    editingId = null;
    formTitle.textContent = '➕ Add New Asset';
    submitBtnText.textContent = 'Add Asset';
    cancelBtn.style.display = 'none';
}

// Edit asset
function editAsset(id) {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    inputs.name.value = asset.name || '';
    inputs.type.value = asset.type || '';
    inputs.category.value = asset.category || '';
    inputs.value.value = asset.value || '';
    inputs.purchaseDate.value = asset.purchaseDate || '';
    inputs.status.value = asset.status || 'Active';
    inputs.location.value = asset.location || '';
    inputs.assignedTo.value = asset.assignedTo || '';
    inputs.description.value = asset.description || '';

    editingId = id;
    formTitle.textContent = '✏️ Edit Asset';
    submitBtnText.textContent = 'Update Asset';
    cancelBtn.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete asset
function deleteAsset(id) {
    if (confirm('Delete this asset?')) {
        assets = assets.filter(a => a.id !== id);
        saveAssets();
    }
}

// Update statistics
function updateStats() {
    const totalAssets = assets.length;
    const activeAssets = assets.filter(a => a.status === 'Active').length;
    const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);

    document.getElementById('totalAssets').textContent = totalAssets;
    document.getElementById('activeAssets').textContent = activeAssets;
    document.getElementById('totalValue').textContent = `₹${totalValue.toLocaleString('en-IN')}`;
}

// Render assets
function renderAssets() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    const typeFilter = filterType.value;

    const filtered = assets.filter(asset => {
        const matchSearch = asset.name?.toLowerCase().includes(searchTerm) ||
                           asset.type?.toLowerCase().includes(searchTerm);
        const matchStatus = !statusFilter || asset.status === statusFilter;
        const matchType = !typeFilter || asset.type === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    if (filtered.length === 0) {
        assetsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p class="empty-title">No assets found</p>
                <p class="empty-subtitle">Add your first asset to get started!</p>
            </div>
        `;
        return;
    }

    assetsList.innerHTML = filtered.map(asset => `
        <div class="asset-card">
            <div class="asset-header">
                <div>
                    <h3 class="asset-title">${asset.name}</h3>
                    <span class="status-badge status-${asset.status.toLowerCase()}">
                        ${asset.status}
                    </span>
                </div>
                <div class="asset-actions">
                    <button class="btn-action btn-edit" onclick="editAsset(${asset.id})">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteAsset(${asset.id})">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="asset-details">
                <div class="asset-detail">
                    <span class="asset-detail-label">Type:</span> ${asset.type}
                </div>
                ${asset.category ? `
                    <div class="asset-detail">
                        <span class="asset-detail-label">Category:</span> ${asset.category}
                    </div>
                ` : ''}
                ${asset.value > 0 ? `
                    <div class="asset-detail">
                        <span class="asset-detail-label">Value:</span> ₹${asset.value.toLocaleString('en-IN')}
                    </div>
                ` : ''}
                ${asset.location ? `
                    <div class="asset-detail">
                        <span class="asset-detail-label">Location:</span> ${asset.location}
                    </div>
                ` : ''}
                ${asset.assignedTo ? `
                    <div class="asset-detail">
                        <span class="asset-detail-label">Assigned:</span> ${asset.assignedTo}
                    </div>
                ` : ''}
                ${asset.purchaseDate ? `
                    <div class="asset-detail">
                        <span class="asset-detail-label">Purchase:</span> ${asset.purchaseDate}
                    </div>
                ` : ''}
            </div>
            
            ${asset.description ? `
                <p class="asset-description">${asset.description}</p>
            ` : ''}
        </div>
    `).join('');
}
