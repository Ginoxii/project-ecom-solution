// ============================================
// STOCK.JS
// ============================================

let stockData = [
  { id:1, name:'Montre LED Premium', sku:'MON-001', qty:2, min:10, price:89, cost:22, supplier:'AliExpress', category:'Montres' },
  { id:2, name:'Écouteurs Bluetooth', sku:'ECO-001', qty:8, min:15, price:67, cost:18, supplier:'AliExpress', category:'Audio' },
  { id:3, name:'Coque iPhone MagSafe', sku:'COQ-001', qty:45, min:20, price:24, cost:4, supplier:'Alibaba', category:'Accessoires' },
  { id:4, name:'Lampe LED Bureau', sku:'LAM-001', qty:5, min:10, price:45, cost:12, supplier:'AliExpress', category:'Décoration' },
  { id:5, name:'Support Téléphone', sku:'SUP-001', qty:32, min:15, price:19, cost:3, supplier:'Alibaba', category:'Accessoires' },
  { id:6, name:'Chargeur Magnétique', sku:'CHA-001', qty:18, min:10, price:39, cost:9, supplier:'AliExpress', category:'Electronique' },
  { id:7, name:'Gadget Cuisine', sku:'GAD-001', qty:0, min:5, price:31, cost:7, supplier:'Alibaba', category:'Cuisine' }
];

function getStockStatus(qty, min) {
  if (qty === 0) return { status: 'critique', label: '🔴 Rupture', class: 'badge-red' };
  if (qty < min * 0.5) return { status: 'critique', label: '🔴 Critique', class: 'badge-red' };
  if (qty < min) return { status: 'faible', label: '🟠 Faible', class: 'badge-orange' };
  return { status: 'normal', label: '🟢 Normal', class: 'badge-green' };
}

function renderStockStats() {
  const total = stockData.length;
  const critique = stockData.filter(p => getStockStatus(p.qty,p.min).status==='critique').length;
  const valeur = stockData.reduce((s,p)=>s+p.qty*p.cost,0);
  const rupture = stockData.filter(p=>p.qty===0).length;

  document.getElementById('stockStats').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-icon">📦</div>
      <div class="kpi-value">${total}</div>
      <div class="kpi-label">Produits actifs</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">🔴</div>
      <div class="kpi-value">${critique}</div>
      <div class="kpi-label">Stock critique</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">⛔</div>
      <div class="kpi-value">${rupture}</div>
      <div class="kpi-label">En rupture</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">💰</div>
      <div class="kpi-value">${valeur.toLocaleString()}€</div>
      <div class="kpi-label">Valeur inventaire</div>
    </div>
  `;
}

function filterStock() {
  const search = document.getElementById('searchStock').value.toLowerCase();
  const statusFilter = document.getElementById('filterStockStatus').value;
  const filtered = stockData.filter(p => {
    const s = getStockStatus(p.qty, p.min);
    const matchSearch = !search || p.name.toLowerCase().includes(search) ||
      p.sku.toLowerCase().includes(search);
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchStatus;
  });
  renderStockTable(filtered);
  document.getElementById('stockCount').textContent = `${filtered.length} produits`;
}

function renderStockTable(data = stockData) {
  document.getElementById('stockTable').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>SKU</th>
          <th>Catégorie</th>
          <th>Stock</th>
          <th>Niveau min</th>
          <th>Prix vente</th>
          <th>Coût</th>
          <th>Marge</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(p => {
          const s = getStockStatus(p.qty, p.min);
          const margin = Math.round(((p.price-p.cost)/p.price)*100);
          const pct = Math.min(100, Math.round((p.qty/Math.max(p.min*2,1))*100));
          return `
          <tr>
            <td style="font-weight:600;font-size:0.88rem;">${p.name}</td>
            <td><code style="font-size:0.78rem;background:var(--bg-secondary);
              padding:2px 6px;border-radius:4px;">${p.sku}</code></td>
            <td style="font-size:0.83rem;">${p.category}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;">
                <strong style="font-size:1rem;${p.qty<p.min?'color:var(--accent-red);':''}">${p.qty}</strong>
                <div style="width:60px;height:6px;background:var(--bg-secondary);border-radius:3px;">
                  <div style="height:100%;width:${pct}%;background:${p.qty<p.min?'#ef4444':p.qty<p.min*1.5?'#f59e0b':'#10b981'};border-radius:3px;"></div>
                </div>
              </div>
            </td>
            <td style="color:var(--text-muted);font-size:0.85rem;">${p.min}</td>
            <td style="font-weight:600;color:var(--accent-green);">${p.price}€</td>
            <td style="color:var(--text-muted);">${p.cost}€</td>
            <td>
              <span style="font-weight:700;color:${margin>60?'var(--accent-green)':margin>40?'var(--accent-orange)':'var(--accent-red)'};">
                ${margin}%
              </span>
            </td>
            <td><span class="badge ${s.class}">${s.label}</span></td>
            <td>
              <div style="display:flex;gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})">✏️</button>
                <button class="btn btn-primary btn-sm" onclick="reorderProduct(${p.id})">🔄</button>
              </div>
            </td>
          </tr>
        `}).join('')}
      </tbody>
    </table>
  `;
}

function editProduct(id) {
  const p = stockData.find(x=>x.id===id);
  if (!p) return;
  document.getElementById('stockModalTitle').textContent = `Éditer — ${p.name}`;
  document.getElementById('stockModalBody').innerHTML = `
    <div class="grid-2" style="gap:12px;">
      <div class="form-group">
        <label class="form-label">Nom</label>
        <input type="text" class="form-control" id="editName" value="${p.name}">
      </div>
      <div class="form-group">
        <label class="form-label">SKU</label>
        <input type="text" class="form-control" id="editSku" value="${p.sku}">
      </div>
      <div class="form-group">
        <label class="form-label">Stock actuel</label>
        <input type="number" class="form-control" id="editQty" value="${p.qty}">
      </div>
      <div class="form-group">
        <label class="form-label">Stock minimum</label>
        <input type="number" class="form-control" id="editMin" value="${p.min}">
      </div>
      <div class="form-group">
        <label class="form-label">Prix de vente (€)</label>
        <input type="number" class="form-control" id="editPrice" value="${p.price}">
      </div>
      <div class="form-group">
        <label class="form-label">Coût (€)</label>
        <input type="number" class="form-control" id="editCost" value="${p.cost}">
      </div>
    </div>
    <input type="hidden" id="editId" value="${p.id}">
  `;
  document.getElementById('stockModal').classList.add('show');
}

function saveProduct() {
  const id = parseInt(document.getElementById('editId')?.value);
  if (id) {
    const p = stockData.find(x=>x.id===id);
    if (p) {
      p.name = document.getElementById('editName').value;
      p.qty = parseInt(document.getElementById('editQty').value);
      p.min = parseInt(document.getElementById('editMin').value);
      p.price = parseFloat(document.getElementById('editPrice').value);
      p.cost = parseFloat(document.getElementById('editCost').value);
    }
  }
  renderStockTable();
  renderStockStats();
  closeModal('stockModal');
  showToast('Produit mis à jour !', 'success');
}

function openAddProduct() {
  document.getElementById('stockModalTitle').textContent = 'Nouveau produit';
  document.getElementById('stockModalBody').innerHTML = `
    <div class="grid-2" style="gap:12px;">
      <div class="form-group">
        <label class="form-label">Nom *</label>
        <input type="text" class="form-control" placeholder="Nom du produit">
      </div>
      <div class="form-group">
        <label class="form-label">SKU</label>
        <input type="text" class="form-control" placeholder="XXX-001">
      </div>
      <div class="form-group">
        <label class="form-label">Stock initial</label>
        <input type="number" class="form-control" placeholder="50">
      </div>
      <div class="form-group">
        <label class="form-label">Stock minimum</label>
        <input type="number" class="form-control" placeholder="10">
      </div>
      <div class="form-group">
        <label class="form-label">Prix de vente (€)</label>
        <input type="number" class="form-control" placeholder="49.99">
      </div>
      <div class="form-group">
        <label class="form-label">Coût (€)</label>
        <input type="number" class="form-control" placeholder="12.00">
      </div>
    </div>
  `;
  document.getElementById('stockModal').classList.add('show');
}

function reorderProduct(id) {
  const p = stockData.find(x=>x.id===id);
  if (p) {
    p.qty += p.min * 3;
    renderStockTable();
    renderStockStats();
    showToast(`Réapprovisionnement de ${p.name} — +${p.min*3} unités`, 'success');
  }
}

function reorderAll() {
  stockData.forEach(p => {
    if (getStockStatus(p.qty,p.min).status !== 'normal') p.qty += p.min * 3;
  });
  renderStockTable();
  renderStockStats();
  showToast('Tous les stocks critiques réapprovisionnés !', 'success');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
  const user = requireAuth();
  if (!user) return;
  buildSidebar(user.role === 'admin');
  document.getElementById('topbarContainer').innerHTML =
    buildTopbar('🏪 Stock', 'Gestion de votre inventaire');
  renderStockStats();
  renderStockTable();
  document.getElementById('stockCount').textContent = `${stockData.length} produits`;
});

window.filterStock = filterStock;
window.editProduct = editProduct;
window.saveProduct = saveProduct;
window.openAddProduct = openAddProduct;
window.reorderProduct = reorderProduct;
window.reorderAll = reorderAll;
window.closeModal = closeModal;