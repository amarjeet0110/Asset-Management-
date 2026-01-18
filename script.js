// Configuration - Change this to your backend URL when deployed
const API_URL = 'http://localhost:5000/api';
const USE_BACKEND = false; // Set to true when backend is running

let assets = [];
let editingId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadAssets();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('assetForm').addEventListener('submit', handleFormSubmit);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
    
    // Search and filters
    document.getElementById('searchInput').addEventListener('input', renderAssets);
    document.getElementById('filterStatus').addEventListener('change', renderAssets);
    document.getElementById('filterType').addEventListener('change', renderAssets);
}

// Load assets from backend or localStorage
async function loadAssets() {
    try {
        if (USE_BACKEND) {
            const response = await fetch(`${API_URL}/assets`);
            if (response.ok) {
                assets = await response.json();
            } else {
                console.error('Failed to load assets from backend');
                loadFromLocalStorage();
            }
        } else {
            loadFromLocalStorage();
        }
        renderAssets();
    } catch (error) {
        console.error('Error loading assets:', error);
        loadFromLocalStorage();
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('assets');
    if (saved) {
        try {
            assets = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing saved assets:', e);
            assets = [];
        }
    }
}

// Save assets to backend or localStorage
async function saveAssets() {
    if (USE_BACKEND) {
        // Backend will handle individual save operations
        return;
    } else {
        try {
            localStorage.setItem('assets', JSON.stringify(assets));
        } catch (e) {
            console.error('Error saving assets:', e);
            alert('Failed to save assets. Please try again.');
        }
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const assetData = {
        name: document.getElementById('assetName').value.trim(),
        type: document.getElementById('assetType').value,
        category: document.getElementById('assetCategory').value.trim(),
        value: parseFloat(document.getElementById('assetValue').value) || 0,
        purchaseDate: document.getElementById('purchaseDate').value,
        status: document.getElementById('assetStatus').value,
        location: document.getElementById('location').value.trim(),
        assignedTo: document.getElementById('assignedTo').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    try {
        if (editingId) {
            // Update existing asset
            await updateAsset(editingId, assetData);
        } else {
            // Create new asset
            await createAsset(assetData);
        }

        // Reset form
        document.getElementById('assetForm').reset();
        editingId = null;
        document.getElementById('formTitle').textContent = 'Add New Asset';
        document.getElementById('cancelBtn').style.display = 'none';

        // Show success message
        showNotification('Asset saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving asset:', error);
        showNotification('Failed to save asset. Please try again.', 'error');
    }
}

// Create new asset
async function createAsset(assetData) {
    if (USE_BACKEND) {
        const response = await fetch(`${API_URL}/assets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assetData)
        });
        
        if (!response.ok) throw new Error('Failed to create asset');
        
        const newAsset = await response.json();
        assets.push(newAsset);
    } else {
        const newAsset = {
            id: Date.now(),
            ...assetData
        };
        assets.push(newAsset);
        await saveAssets();
    }
    
    renderAssets();
}

// Update existing asset
async function updateAsset(id, assetData) {
    if (USE_BACKEND) {
        const response = await fetch(`${API_URL}/assets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assetData)
        });
        
        if (!response.ok) throw new Error('Failed to update asset');
        
        const updatedAsset = await response.json();
        const index = assets.findIndex(a => a.id === id);
        if (index !== -1) {
            assets[index] = updatedAsset;
        }
    } else {
        const index = assets.findIndex(a => a.id === id);
        if (index !== -1) {
            assets[index] = {
                id: id,
                ...assetData
            };
            await saveAssets();
        }
    }
    
    renderAssets();
}

// Delete asset
async function deleteAsset(id) {
    if (!confirm('Are you sure you want to delete this asset?')) {
        return;
    }

    try {
        if (USE_BACKEND) {
            const response = await fetch(`${API_URL}/assets/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete asset');
        }
        
        assets = assets.filter(a => a.id !== id);
        await saveAssets();
        renderAssets();
        showNotification('Asset deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting asset:', error);
        showNotification('Failed to delete asset. Please try again.', 'error');
    }
}

// Edit asset
function editAsset(id) {
    const asset = assets.find(a => a.id === id);
    if (!asset) return;

    editingId = id;
    document.getElementById('formTitle').textContent = 'Edit Asset';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    // Populate form
    document.getElementById('assetName').value = asset.name || '';
    document.getElementById('assetType').value = asset.type || '';
    document.getElementById('assetCategory').value = asset.category || '';
    document.getElementById('assetValue').value = asset.value || 0;
    document.getElementById('purchaseDate').value = asset.purchaseDate || '';
    document.getElementById('assetStatus').value = asset.status || 'Active';
    document.getElementById('location').value = asset.location || '';
    document.getElementById('assignedTo').value = asset.assignedTo || '';
    document.getElementById('description').value = asset.description || '';

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancel edit
function cancelEdit() {
    editingId = null;
    document.getElementById('formTitle').textContent = 'Add New Asset';
    document.getElementById('assetForm').reset();
    document.getElementById('cancelBtn').style.display = 'none';
}

// Render assets
function renderAssets() {
    const container = document.getElementById('assetContainer');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const typeFilter = document.getElementById('filterType').value;

    // Filter assets
    let filteredAssets = assets.filter(asset => {
        const matchesSearch = 
            (asset.name && asset.name.toLowerCase().includes(searchTerm)) ||
            (asset.type && asset.type.toLowerCase().includes(searchTerm)) ||
            (asset.category && asset.category.toLowerCase().includes(searchTerm)) ||
            (asset.location && asset.location.toLowerCase().includes(searchTerm)) ||
            (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchTerm));
        
        const matchesStatus = !statusFilter || asset.status === statusFilter;
        const matchesType = !typeFilter || asset.type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    // Render
    if (filteredAssets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No assets found</h3>
                <p>${assets.length === 0 ? 'Add your first asset to get started!' : 'Try adjusting your search or filters'}</p>
            </div>
        `;
    } else {
        container.innerHTML = filteredAssets.map(asset => `
            <div class="asset-card">
                <div class="asset-header">
                    <div class="asset-name">${escapeHtml(asset.name)}</div>
                    <span class="asset-status status-${(asset.status || 'active').toLowerCase()}">${escapeHtml(asset.status)}</span>
                </div>
                <div class="asset-detail"><strong>Type:</strong> ${escapeHtml(asset.type)}</div>
                ${asset.category ? `<div class="asset-detail"><strong>Category:</strong> ${escapeHtml(asset.category)}</div>` : ''}
                ${asset.value > 0 ? `<div class="asset-detail"><strong>Value:</strong> $${asset.value.toFixed(2)}</div>` : ''}
                ${asset.location ? `<div class="asset-detail"><strong>Location:</strong> ${escapeHtml(asset.location)}</div>` : ''}
                ${asset.assignedTo ? `<div class="asset-detail"><strong>Assigned To:</strong> ${escapeHtml(asset.assignedTo)}</div>` : ''}
                ${asset.purchaseDate ? `<div class="asset-detail"><strong>Purchase Date:</strong> ${escapeHtml(asset.purchaseDate)}</div>` : ''}
                ${asset.description ? `<div class="asset-detail"><strong>Notes:</strong> ${escapeHtml(asset.description)}</div>` : ''}
                <div class="asset-actions">
                    <button class="btn btn-small btn-edit" onclick="editAsset(${asset.id})">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="deleteAsset(${asset.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateStats();
}

// Update statistics
function updateStats() {
    document.getElementById('totalAssets').textContent = assets.length;
    document.getElementById('activeAssets').textContent = assets.filter(a => a.status === 'Active').length;
    const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
}

// Show notification
function showNotification(message, type = 'success') {
    // Simple alert for now - can be replaced with a better notification system
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}
