from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Data file path
DATA_FILE = 'assets.json'

def init_data():
    """Initialize data file if it doesn't exist"""
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)
        print(f"✅ Created {DATA_FILE}")

def read_assets():
    """Read assets from file"""
    try:
        if not os.path.exists(DATA_FILE):
            init_data()
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error reading assets: {e}")
        return []

def write_assets(assets):
    """Write assets to file"""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(assets, f, indent=2)
        return True
    except Exception as e:
        print(f"❌ Error writing assets: {e}")
        return False

# Serve index.html at root
@app.route('/')
def index():
    """Serve the main page"""
    try:
        return send_from_directory('.', 'index.html')
    except:
        return """
        <h1>Asset Management System API</h1>
        <p>API is running! Add index.html to see the frontend.</p>
        <p>API endpoints: /api/assets, /api/stats, /api/health</p>
        """, 200

# Serve static files
@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    try:
        return send_from_directory('.', filename)
    except:
        return jsonify({'error': 'File not found'}), 404

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Asset Management API is running',
        'timestamp': datetime.now().isoformat()
    }), 200

# Get all assets
@app.route('/api/assets', methods=['GET'])
def get_assets():
    """Get all assets"""
    try:
        assets = read_assets()
        return jsonify(assets), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get single asset
@app.route('/api/assets/<int:asset_id>', methods=['GET'])
def get_asset(asset_id):
    """Get single asset by ID"""
    try:
        assets = read_assets()
        asset = next((a for a in assets if a['id'] == asset_id), None)
        
        if asset:
            return jsonify(asset), 200
        return jsonify({'error': 'Asset not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create asset
@app.route('/api/assets', methods=['POST'])
def create_asset():
    """Create new asset"""
    try:
        assets = read_assets()
        new_asset = request.json
        
        # Validation
        if not new_asset.get('name'):
            return jsonify({'error': 'Name required'}), 400
        if not new_asset.get('type'):
            return jsonify({'error': 'Type required'}), 400
        
        # Generate ID
        new_asset['id'] = int(datetime.now().timestamp() * 1000)
        new_asset['createdAt'] = datetime.now().isoformat()
        new_asset['updatedAt'] = datetime.now().isoformat()
        
        assets.append(new_asset)
        
        if write_assets(assets):
            return jsonify(new_asset), 201
        return jsonify({'error': 'Failed to save'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update asset
@app.route('/api/assets/<int:asset_id>', methods=['PUT'])
def update_asset(asset_id):
    """Update existing asset"""
    try:
        assets = read_assets()
        index = next((i for i, a in enumerate(assets) if a['id'] == asset_id), None)
        
        if index is None:
            return jsonify({'error': 'Asset not found'}), 404
        
        updated = request.json
        updated['id'] = asset_id
        updated['createdAt'] = assets[index].get('createdAt', datetime.now().isoformat())
        updated['updatedAt'] = datetime.now().isoformat()
        
        assets[index] = updated
        
        if write_assets(assets):
            return jsonify(updated), 200
        return jsonify({'error': 'Failed to update'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete asset
@app.route('/api/assets/<int:asset_id>', methods=['DELETE'])
def delete_asset(asset_id):
    """Delete asset"""
    try:
        assets = read_assets()
        original_len = len(assets)
        assets = [a for a in assets if a['id'] != asset_id]
        
        if len(assets) == original_len:
            return jsonify({'error': 'Asset not found'}), 404
        
        if write_assets(assets):
            return jsonify({'message': 'Deleted successfully'}), 200
        return jsonify({'error': 'Failed to delete'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get stats
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics"""
    try:
        assets = read_assets()
        return jsonify({
            'total': len(assets),
            'active': len([a for a in assets if a.get('status') == 'Active']),
            'totalValue': sum(a.get('value', 0) for a in assets)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_data()
    port = int(os.environ.get('PORT', 10000))
    print(f"🚀 Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
