// ============================================
// ORDERS.JS
// ============================================

let ordersData = [
  { id:'#1042', client:'Lucas Bernard', email:'lucas@mail.com', product:'Montre LED Premium',
    qty:1, amount:89, status:'livré', date:'2024-01-15', country:'🇫🇷 France', tracking:'FR123456789' },
  { id:'#1041', client:'Emma Petit', email:'emma@mail.com', product:'Coque iPhone MagSafe',
    qty:2, amount:48, status:'expédié', date:'2024-01-15', country:'🇧🇪 Belgique', tracking:'BE987654321' },
  { id:'#1040', client:'Thomas Martin', email:'thomas@mail.com', product:'Écouteurs Bluetooth',
    qty:1, amount:67, status:'en attente', date:'2024-01-14', country:'🇫🇷 France', tracking:'-' },
  { id:'#1039', client:'Sophie Durand', email:'sophie@mail.com', product:'Lampe LED Bureau',
    qty:1, amount:45, status:'livré', date:'2024-01-14', country:'🇨🇭 Suisse', tracking:'CH741852963' },
  { id:'#1038', client:'Julien Moreau', email:'julien@mail.com', product:'Support Téléphone',
    qty:3, amount:57, status:'litige', date:'2024-01-13', country:'🇫🇷 France', tracking:'FR456123789' },
  { id:'#1037', client:'Camille Leroy', email:'camille@mail.com', product:'Chargeur Magnétique',
    qty:2, amount:78, status:'expédié', date:'2024-01-13', country:'🇧🇪 Belgique', tracking:'BE159753468' },
  { id:'#1036', client:'Antoine Girard', email:'antoine@mail.com', product:'Montre LED Premium',
    qty:1, amount:89, status:'livré', date:'2024-01-12', country:'🇫🇷 France', tracking:'FR963852741' },
  { id:'#1035', client:'Laura Simon', email:'laura@mail.com', product:'Gadget Cuisine',
    qty:2, amount:62, status:'remboursé', date:'2024-01-12', country:'🇨🇦 Canada', tracking:'-' },
  { id:'#1034', client:'Maxime Blanc', email:'maxime@mail.com', product:'Écouteurs Bluetooth',
    qty:1, amount:67, status:'livré', date:'2024-01-11', country:'🇫🇷 France', tracking:'FR753159486' },
  { id:'#1033', client:'Julie Rousseau', email:'julie@mail.com', product:'Coque iPhone MagSafe',
    qty:4, amount:96, status:'livré', date:'2024-01-11', country:'🇧🇪 Belgique', tracking:'BE357951246' }
];

let selectedOrderId = null;

function getStatusBadge(status) {
  const map = {
    'livré': 'badge-green',
    'expédié': 'badge-blue',
    'en attente': 'badge-orange',
    'litige': 'badge-red',
    'remboursé': 'badge-gray'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function renderStats() {
  const total = ordersData.length;
  const delivered = ordersData.filter(o => o.status === 'livré').length;
  const pending = ordersData.filter(o => o.status === 'en attente').length;
  const disputes = ordersData.filter(o => o.status === 'litige').length;
  const revenue = ordersData.reduce((sum, o) => sum + o.amount, 0);

  document.getElementById('orderStats').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-icon">📦</div>
      <div class="kpi-value">${total}</div>
      <div class="kpi-label">Total commandes</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">✅</div>
      <div class="kpi-value">${delivered}</div>
      <div class="kpi-label">Livrées</div>
      <span class="kpi-change positive">▲ ${Math.round(delivered/total*100)}%</span>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">⏳</div>
      <div class="kpi-value">${pending}</div>
      <div class="kpi-label">En attente</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">💰</div>
      <div class="kpi-value">${revenue.toLocaleString()}€</div>
      <div class="kpi-label">Revenus total</div>
      <span class="kpi-change positive">▲ +23%</span>
    </div>
  `;
}

function filterOrders() {
  const search = document.getElementById('searchOrder').value.toLowerCase();
  const status = document.getElementById('filterStatus').value;
  const dateFilter = document.getElementById('filterDate').value;

  let filtered = ordersData.filter(o => {
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search) ||
      o.client.toLowerCase().includes(search) ||
      o.product.toLowerCase().includes(search);
    const matchStatus = !status || o.status === status;
    return matchSearch && matchStatus;
  });

  renderTable(filtered);
  document.getElementById('orderCount').textContent = `${filtered.length} commandes`;
}

function renderTable(data = ordersData) {
  document.getElementById('ordersTable').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Client</th>
          <th>Produit</th>
          <th>Qté</th>
          <th>Montant</th>
          <th>Pays</th>
          <th>Date</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(order => `
          <tr>
            <td><strong style="color:var(--accent-blue);">${order.id}</strong></td>
            <td>
              <div style="font-weight:600;font-size:0.88rem;">${order.client}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${order.email}</div>
            </td>
            <td style="font-size:0.85rem;">${order.product}</td>
            <td style="text-align:center;">${order.qty}</td>
            <td><strong style="color:var(--accent-green);">${order.amount}€</strong></td>
            <td style="font-size:0.85rem;">${order.country}</td>
            <td style="font-size:0.82rem;color:var(--text-muted);">${order.date}</td>
            <td>${getStatusBadge(order.status)}</td>
            <td>
              <div style="display:flex;gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="viewOrder('${order.id}')">👁</button>
                <button class="btn btn-secondary btn-sm" onclick="editOrder('${order.id}')">✏️</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function viewOrder(id) {
  const order = ordersData.find(o => o.id === id);
  if (!order) return;
  selectedOrderId = id;

  document.getElementById('modalTitle').textContent = `Commande ${order.id}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="display:grid;gap:16px;">
      <div class="grid-2" style="gap:12px;">
        <div class="form-group">
          <label class="form-label">Client</label>
          <div class="form-control" style="cursor:default;">${order.client}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <div class="form-control" style="cursor:default;">${order.email}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Produit</label>
          <div class="form-control" style="cursor:default;">${order.product}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Montant</label>
          <div class="form-control" style="cursor:default;color:var(--accent-green);font-weight:700;">
            ${order.amount}€
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Numéro de suivi</label>
          <div class="form-control" style="cursor:default;">${order.tracking}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Pays</label>
          <div class="form-control" style="cursor:default;">${order.country}</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Statut</label>
        <select class="form-control" id="newStatus">
          <option ${order.status==='en attente'?'selected':''} value="en attente">⏳ En attente</option>
          <option ${order.status==='expédié'?'selected':''} value="expédié">📬 Expédié</option>
          <option ${order.status==='livré'?'selected':''} value="livré">✅ Livré</option>
          <option ${order.status==='litige'?'selected':''} value="litige">⚠️ Litige</option>
          <option ${order.status==='remboursé'?'selected':''} value="remboursé">↩️ Remboursé</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Note interne</label>
        <textarea class="form-control" rows="3" placeholder="Ajouter une note..."></textarea>
      </div>
    </div>
  `;

  openModal('orderModal');
}

function editOrder(id) {
  viewOrder(id);
}

function updateOrderStatus() {
  const newStatus = document.getElementById('newStatus').value;
  const order = ordersData.find(o => o.id === selectedOrderId);
  if (order) {
    order.status = newStatus;
    renderTable();
    renderStats();
    closeModal('orderModal');
    showToast(`Commande ${order.id} mise à jour → ${newStatus}`, 'success');
  }
}

function openNewOrder() {
  document.getElementById('modalTitle').textContent = 'Nouvelle commande';
  document.getElementById('modalBody').innerHTML = `
    <div class="grid-2" style="gap:12px;">
      <div class="form-group">
        <label class="form-label">Client *</label>
        <input type="text" class="form-control" id="newClient" placeholder="Nom complet">
      </div>
      <div class="form-group">
        <label class="form-label">Email *</label>
        <input type="email" class="form-control" id="newEmail" placeholder="client@email.com">
      </div>
      <div class="form-group">
        <label class="form-label">Produit *</label>
        <input type="text" class="form-control" id="newProduct" placeholder="Nom du produit">
      </div>
      <div class="form-group">
        <label class="form-label">Montant (€) *</label>
        <input type="number" class="form-control" id="newAmount" placeholder="49.99">
      </div>
    </div>
  `;
  openModal('orderModal');
}

function exportOrders() {
  const csv = [
    ['ID','Client','Email','Produit','Montant','Statut','Date'],
    ...ordersData.map(o => [o.id,o.client,o.email,o.product,o.amount+'€',o.status,o.date])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'commandes_ecom.csv';
  a.click();
  showToast('Export CSV téléchargé !', 'success');
}

function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
  const user = requireAuth();
  if (!user) return;
  buildSidebar(user.role === 'admin');
  document.getElementById('topbarContainer').innerHTML =
    buildTopbar('📦 Commandes', 'Gestion de toutes vos commandes');
  renderStats();
  renderTable();
  document.getElementById('orderCount').textContent = `${ordersData.length} commandes`;
});

window.filterOrders = filterOrders;
window.viewOrder = viewOrder;
window.editOrder = editOrder;
window.updateOrderStatus = updateOrderStatus;
window.openNewOrder = openNewOrder;
window.exportOrders = exportOrders;
window.closeModal = closeModal;