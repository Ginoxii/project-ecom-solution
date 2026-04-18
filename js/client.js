// ============================================
// CLIENTS.JS
// ============================================

const clientsData = [
  { id:1, name:'Lucas Bernard', email:'lucas@mail.com', phone:'+33 6 12 34 56 78',
    orders:8, total:712, segment:'vip', lastOrder:'2024-01-15', country:'France', avatar:'LB' },
  { id:2, name:'Emma Petit', email:'emma@mail.com', phone:'+32 4 98 76 54 32',
    orders:5, total:348, segment:'fidele', lastOrder:'2024-01-15', country:'Belgique', avatar:'EP' },
  { id:3, name:'Thomas Martin', email:'thomas@mail.com', phone:'+33 7 23 45 67 89',
    orders:1, total:67, segment:'nouveau', lastOrder:'2024-01-14', country:'France', avatar:'TM' },
  { id:4, name:'Sophie Durand', email:'sophie@mail.com', phone:'+41 78 123 45 67',
    orders:12, total:1240, segment:'vip', lastOrder:'2024-01-14', country:'Suisse', avatar:'SD' },
  { id:5, name:'Julien Moreau', email:'julien@mail.com', phone:'+33 6 45 67 89 01',
    orders:3, total:189, segment:'fidele', lastOrder:'2024-01-13', country:'France', avatar:'JM' },
  { id:6, name:'Camille Leroy', email:'camille@mail.com', phone:'+32 4 56 78 90 12',
    orders:2, total:156, segment:'nouveau', lastOrder:'2024-01-13', country:'Belgique', avatar:'CL' },
  { id:7, name:'Antoine Girard', email:'antoine@mail.com', phone:'+33 6 78 90 12 34',
    orders:0, total:0, segment:'inactif', lastOrder:'2023-11-20', country:'France', avatar:'AG' },
  { id:8, name:'Laura Simon', email:'laura@mail.com', phone:'+1 514 234 5678',
    orders:1, total:62, segment:'nouveau', lastOrder:'2024-01-12', country:'Canada', avatar:'LS' }
];

function getSegmentBadge(segment) {
  const map = {
    'vip': '<span class="badge badge-purple">⭐ VIP</span>',
    'fidele': '<span class="badge badge-blue">💙 Fidèle</span>',
    'nouveau': '<span class="badge badge-green">🆕 Nouveau</span>',
    'inactif': '<span class="badge badge-gray">😴 Inactif</span>'
  };
  return map[segment] || '';
}

function renderClientStats() {
  const total = clientsData.length;
  const vip = clientsData.filter(c => c.segment === 'vip').length;
  const nouveaux = clientsData.filter(c => c.segment === 'nouveau').length;
  const ltv = Math.round(clientsData.reduce((s,c)=>s+c.total,0)/total);

  document.getElementById('clientStats').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-icon">👥</div>
      <div class="kpi-value">${total}</div>
      <div class="kpi-label">Total clients</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">⭐</div>
      <div class="kpi-value">${vip}</div>
      <div class="kpi-label">Clients VIP</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">🆕</div>
      <div class="kpi-value">${nouveaux}</div>
      <div class="kpi-label">Nouveaux (30j)</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon">💰</div>
      <div class="kpi-value">${ltv}€</div>
      <div class="kpi-label">LTV moyen</div>
    </div>
  `;
}

function filterClients() {
  const search = document.getElementById('searchClient').value.toLowerCase();
  const segment = document.getElementById('filterSegment').value;
  const filtered = clientsData.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search);
    const matchSegment = !segment || c.segment === segment;
    return matchSearch && matchSegment;
  });
  renderClientsTable(filtered);
  document.getElementById('clientCount').textContent = `${filtered.length} clients`;
}

function renderClientsTable(data = clientsData) {
  document.getElementById('clientsTable').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Contact</th>
          <th>Commandes</th>
          <th>Total dépensé</th>
          <th>Dernière commande</th>
          <th>Segment</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(c => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px;">
                <div class="avatar" style="width:34px;height:34px;font-size:0.72rem;">${c.avatar}</div>
                <div>
                  <div style="font-weight:600;font-size:0.88rem;">${c.name}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${c.country}</div>
                </div>
              </div>
            </td>
            <td>
              <div style="font-size:0.82rem;">${c.email}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${c.phone}</div>
            </td>
            <td style="text-align:center;font-weight:600;">${c.orders}</td>
            <td><strong style="color:var(--accent-green);">${c.total}€</strong></td>
            <td style="font-size:0.82rem;color:var(--text-muted);">${c.lastOrder}</td>
            <td>${getSegmentBadge(c.segment)}</td>
            <td>
              <div style="display:flex;gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="viewClient(${c.id})">👁</button>
                <button class="btn btn-secondary btn-sm" onclick="emailClient('${c.email}')">📧</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function viewClient(id) {
  const c = clientsData.find(cl => cl.id === id);
  if (!c) return;
  document.getElementById('clientModalTitle').textContent = `Fiche — ${c.name}`;
  document.getElementById('clientModalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;
      padding:16px;background:var(--bg-secondary);border-radius:var(--radius-sm);">
      <div class="avatar" style="width:56px;height:56px;font-size:1rem;">${c.avatar}</div>
      <div>
        <h3 style="font-size:1.1rem;font-weight:700;">${c.name}</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;">${c.email}</p>
        <div style="margin-top:6px;">${getSegmentBadge(c.segment)}</div>
      </div>
    </div>
    <div class="grid-3" style="gap:12px;margin-bottom:20px;">
      <div style="text-align:center;padding:14px;background:var(--bg-secondary);border-radius:var(--radius-sm);">
        <div style="font-size:1.4rem;font-weight:800;color:var(--accent-blue);">${c.orders}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">Commandes</div>
      </div>
      <div style="text-align:center;padding:14px;background:var(--bg-secondary);border-radius:var(--radius-sm);">
        <div style="font-size:1.4rem;font-weight:800;color:var(--accent-green);">${c.total}€</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">Total dépensé</div>
      </div>
      <div style="text-align:center;padding:14px;background:var(--bg-secondary);border-radius:var(--radius-sm);">
        <div style="font-size:1.4rem;font-weight:800;color:var(--accent-purple);">
          ${c.orders > 0 ? Math.round(c.total/c.orders) : 0}€
        </div>
        <div style="font-size:0.78rem;color:var(--text-muted);">Panier moyen</div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Note client</label>
      <textarea class="form-control" rows="3" placeholder="Ajouter une note..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Changer le segment</label>
      <select class="form-control">
        <option ${c.segment==='vip'?'selected':''} value="vip">⭐ VIP</option>
        <option ${c.segment==='fidele'?'selected':''} value="fidele">💙 Fidèle</option>
        <option ${c.segment==='nouveau'?'selected':''} value="nouveau">🆕 Nouveau</option>
        <option ${c.segment==='inactif'?'selected':''} value="inactif">😴 Inactif</option>
      </select>
    </div>
  `;
  document.getElementById('clientModal').classList.add('show');
}

function emailClient(email) {
  showToast(`Email envoyé à ${email}`, 'success');
}

function openAddClient() {
  document.getElementById('clientModalTitle').textContent = 'Nouveau client';
  document.getElementById('clientModalBody').innerHTML = `
    <div class="grid-2" style="gap:12px;">
      <div class="form-group">
        <label class="form-label">Prénom *</label>
        <input type="text" class="form-control" placeholder="Jean">
      </div>
      <div class="form-group">
        <label class="form-label">Nom *</label>
        <input type="text" class="form-control" placeholder="Dupont">
      </div>
      <div class="form-group">
        <label class="form-label">Email *</label>
        <input type="email" class="form-control" placeholder="client@email.com">
      </div>
      <div class="form-group">
        <label class="form-label">Téléphone</label>
        <input type="tel" class="form-control" placeholder="+33 6 xx xx xx xx">
      </div>
    </div>
  `;
  document.getElementById('clientModal').classList.add('show');
}

function exportClients() {
  const csv = [
    ['Nom','Email','Téléphone','Commandes','Total','Segment'],
    ...clientsData.map(c=>[c.name,c.email,c.phone,c.orders,c.total+'€',c.segment])
  ].map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='clients_ecom.csv'; a.click();
  showToast('Export clients téléchargé !','success');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
  const user = requireAuth();
  if (!user) return;
  buildSidebar(user.role === 'admin');
  document.getElementById('topbarContainer').innerHTML =
    buildTopbar('👥 Clients', 'Gestion de votre base clients');
  renderClientStats();
  renderClientsTable();
  document.getElementById('clientCount').textContent = `${clientsData.length} clients`;
});

window.filterClients = filterClients;
window.viewClient = viewClient;
window.emailClient = emailClient;
window.openAddClient = openAddClient;
window.exportClients = exportClients;
window.closeModal = closeModal;
