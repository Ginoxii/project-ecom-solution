// ============================================
// ADMIN.JS
// ============================================

const adminUsers = [
  { id:1, name:'Admin EcomSolutions', email:'admin@ecom.com', role:'admin',
    plan:'Agency', status:'actif', joined:'2024-01-01', revenue:0 },
  { id:2, name:'Jean Dupont', email:'user@ecom.com', role:'client',
    plan:'Starter', status:'actif', joined:'2024-01-10', revenue:29 },
  { id:3, name:'Marie Martin', email:'pro@ecom.com', role:'pro',
    plan:'Pro', status:'actif', joined:'2024-01-08', revenue:79 },
    { id:4, name:'Sophie Leroy', email:'sophie@ecom.com', role:'client',
    plan:'Starter', status:'actif', joined:'2024-01-12', revenue:29 },
  { id:5, name:'Thomas Bernard', email:'thomas@ecom.com', role:'client',
    plan:'Pro', status:'suspendu', joined:'2024-01-05', revenue:79 },
  { id:6, name:'Emma Petit', email:'emma@ecom.com', role:'pro',
    plan:'Agency', status:'actif', joined:'2024-01-03', revenue:199 },
  { id:7, name:'Lucas Moreau', email:'lucas@ecom.com', role:'client',
    plan:'Starter', status:'inactif', joined:'2023-12-20', revenue:0 }
];

const plans = [
  { name:'Starter', price:29, users:3, features:['Dashboard','Commandes','Clients','Bot IA (50 msgs/j)'], color:'var(--accent-blue)' },
  { name:'Pro', price:79, users:15, features:['Tout Starter','Publicités','Comptabilité','UGC Studio','Bot IA illimité','Fournisseurs'], color:'var(--accent-purple)' },
  { name:'Agency', price:199, users:12, features:['Tout Pro','Admin panel','Collab équipe','API Access','Support prioritaire','White label'], color:'var(--accent-green)' }
];

let currentAdminTab = 'overview';

function switchAdminTab(tab, el) {
  currentAdminTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderAdminContent();
}

function renderAdminContent() {
  const map = {
    overview: renderOverview,
    users: renderUsers,
    plans: renderPlans,
    settings: renderSettings
  };
  if (map[currentAdminTab]) map[currentAdminTab]();
}

// ============================================
// OVERVIEW
// ============================================
function renderOverview() {
  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter(u => u.status === 'actif').length;
  const mrr = adminUsers.filter(u => u.status === 'actif').reduce((s, u) => s + u.revenue, 0);
  const arr = mrr * 12;

  document.getElementById('adminContent').innerHTML = `
    <!-- KPI STATS -->
    <div class="grid-4" style="gap:16px;margin-bottom:28px;">
      <div class="kpi-card">
        <div class="kpi-icon">👤</div>
        <div class="kpi-value">${totalUsers}</div>
        <div class="kpi-label">Utilisateurs total</div>
        <span class="kpi-change positive">▲ +3 ce mois</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">✅</div>
        <div class="kpi-value">${activeUsers}</div>
        <div class="kpi-label">Comptes actifs</div>
        <span class="kpi-change positive">▲ ${Math.round(activeUsers/totalUsers*100)}%</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">💰</div>
        <div class="kpi-value">${mrr.toLocaleString()}€</div>
        <div class="kpi-label">MRR</div>
        <span class="kpi-change positive">▲ +18% vs mois dernier</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">📈</div>
        <div class="kpi-value">${(arr/1000).toFixed(1)}K€</div>
        <div class="kpi-label">ARR projeté</div>
        <span class="kpi-change positive">▲ Tendance haussière</span>
      </div>
    </div>

    <!-- CHARTS ROW -->
    <div class="grid-2" style="gap:20px;margin-bottom:24px;">
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Revenus mensuels</span>
          <span class="badge badge-green">+18%</span>
        </div>
        <canvas id="revenueChart" height="200"></canvas>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">👥 Répartition des plans</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;padding:12px 0;">
          ${plans.map(p => {
            const count = adminUsers.filter(u => u.plan === p.name && u.status === 'actif').length;
            const pct = Math.round(count / activeUsers * 100) || 0;
            return `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="font-size:0.88rem;font-weight:600;">${p.name}</span>
                  <span style="font-size:0.85rem;color:var(--text-muted);">${count} users — ${pct}%</span>
                </div>
                <div style="height:8px;background:var(--bg-secondary);border-radius:4px;">
                  <div style="height:100%;width:${pct}%;background:${p.color};
                    border-radius:4px;transition:width 0.8s ease;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- RECENT ACTIVITY -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">🔔 Activité récente</span>
        <button class="btn btn-secondary btn-sm">Tout voir</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:0;">
        ${[
          { icon:'👤', text:'Nouvel utilisateur : Emma Petit (Agency)', time:'Il y a 5 min', color:'var(--accent-green)' },
          { icon:'💳', text:'Upgrade plan : Thomas → Pro', time:'Il y a 23 min', color:'var(--accent-purple)' },
          { icon:'⚠️', text:'Compte suspendu : thomas@ecom.com', time:'Il y a 1h', color:'var(--accent-red)' },
          { icon:'💬', text:'Support ticket : lucas@ecom.com — Problème facturation', time:'Il y a 2h', color:'var(--accent-orange)' },
          { icon:'🎉', text:'1000ème commande enregistrée sur la plateforme !', time:'Il y a 3h', color:'var(--accent-blue)' }
        ].map(a => `
          <div style="display:flex;align-items:center;gap:14px;padding:14px 0;
            border-bottom:1px solid var(--border);">
            <div style="width:38px;height:38px;background:${a.color}20;border-radius:50%;
              display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">
              ${a.icon}
            </div>
            <div style="flex:1;">
              <div style="font-size:0.88rem;font-weight:500;">${a.text}</div>
              <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">${a.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Draw revenue chart
  setTimeout(() => drawRevenueChart(), 100);
}

function drawRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [820, 960, 1100, 890, 1250, 1380, 1520, 1400, 1680, 1850, 1950, 2100];
  const labels = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const W = canvas.offsetWidth;
  const H = 200;
  canvas.width = W;
  canvas.height = H;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const pad = { top:20, right:20, bottom:30, left:50 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  // Grid lines
  ctx.strokeStyle = '#1e2130';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    const val = max - ((max - min) / 4) * i;
    ctx.fillText(Math.round(val) + '€', pad.left - 6, y + 4);
  }

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
  gradient.addColorStop(0, 'rgba(59,130,246,0.3)');
  gradient.addColorStop(1, 'rgba(59,130,246,0)');

  // Line path
  const points = data.map((v, i) => ({
    x: pad.left + (chartW / (data.length - 1)) * i,
    y: pad.top + chartH - ((v - min) / (max - min)) * chartH
  }));

  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Fill
  ctx.lineTo(points[points.length-1].x, H - pad.bottom);
  ctx.lineTo(points[0].x, H - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Dots
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#0a0a0f';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Labels
  labels.forEach((l, i) => {
    ctx.fillStyle = '#475569';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(l, points[i].x, H - 8);
  });
}

// ============================================
// USERS
// ============================================
function renderUsers() {
  document.getElementById('adminContent').innerHTML = `
    <div class="card" style="margin-bottom:20px;">
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <input type="text" class="form-control" id="searchUsers"
          placeholder="🔍 Rechercher utilisateur..." oninput="filterUsers()" style="flex:1;">
        <select class="form-control" id="filterRole" onchange="filterUsers()" style="width:160px;">
          <option value="">Tous les rôles</option>
          <option value="admin">👑 Admin</option>
          <option value="pro">⭐ Pro</option>
          <option value="client">👤 Client</option>
        </select>
        <select class="form-control" id="filterPlan" onchange="filterUsers()" style="width:160px;">
          <option value="">Tous les plans</option>
          <option value="Starter">Starter</option>
          <option value="Pro">Pro</option>
          <option value="Agency">Agency</option>
        </select>
        <button class="btn btn-primary" onclick="openAddUser()">➕ Ajouter</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">👥 Gestion utilisateurs</span>
        <span class="badge badge-blue" id="userCount">${adminUsers.length} users</span>
      </div>
      <div class="table-container" id="usersTable"></div>
    </div>

    <!-- ADD USER MODAL -->
    <div class="modal-overlay" id="userModal" onclick="closeUserModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title" id="userModalTitle">Nouvel utilisateur</h3>
          <button class="modal-close" onclick="closeUserModal()">✕</button>
        </div>
        <div class="modal-body" id="userModalBody"></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeUserModal()">Annuler</button>
          <button class="btn btn-primary" onclick="saveUser()">💾 Sauvegarder</button>
        </div>
      </div>
    </div>
  `;
  renderUsersTable(adminUsers);
}

function getRoleBadge(role) {
  const map = {
    admin: '<span class="badge badge-purple">👑 Admin</span>',
    pro: '<span class="badge badge-blue">⭐ Pro</span>',
    client: '<span class="badge badge-gray">👤 Client</span>'
  };
  return map[role] || map.client;
}

function getStatusBadge(status) {
  const map = {
    actif: '<span class="badge badge-green">✅ Actif</span>',
    suspendu: '<span class="badge badge-red">⛔ Suspendu</span>',
    inactif: '<span class="badge badge-gray">😴 Inactif</span>'
  };
  return map[status] || map.inactif;
}

function getPlanBadge(plan) {
  const map = {
    Starter: '<span class="badge badge-blue">Starter</span>',
    Pro: '<span class="badge badge-purple">Pro</span>',
    Agency: '<span class="badge badge-green">Agency</span>'
  };
  return map[plan] || plan;
}

function renderUsersTable(data) {
  document.getElementById('usersTable').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Utilisateur</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Plan</th>
          <th>Revenu/mois</th>
          <th>Inscription</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(u => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px;">
                <div class="avatar" style="width:34px;height:34px;font-size:0.78rem;">
                  ${u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <span style="font-weight:600;font-size:0.88rem;">${u.name}</span>
              </div>
            </td>
            <td style="font-size:0.85rem;color:var(--text-muted);">${u.email}</td>
            <td>${getRoleBadge(u.role)}</td>
            <td>${getPlanBadge(u.plan)}</td>
            <td style="font-weight:700;color:${u.revenue>0?'var(--accent-green)':'var(--text-muted)'};">
              ${u.revenue > 0 ? u.revenue + '€' : '—'}
            </td>
            <td style="font-size:0.82rem;color:var(--text-muted);">${u.joined}</td>
            <td>${getStatusBadge(u.status)}</td>
            <td>
              <div style="display:flex;gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="editUser(${u.id})"
                  title="Éditer">✏️</button>
                <button class="btn btn-secondary btn-sm"
                  onclick="toggleUserStatus(${u.id})"
                  title="${u.status==='actif'?'Suspendre':'Activer'}"
                  style="${u.status==='actif'?'':'color:var(--accent-green);'}">
                  ${u.status === 'actif' ? '⛔' : '✅'}
                </button>
                <button class="btn btn-secondary btn-sm"
                  onclick="deleteUser(${u.id})" title="Supprimer"
                  style="color:var(--accent-red);">🗑</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function filterUsers() {
  const search = document.getElementById('searchUsers').value.toLowerCase();
  const role = document.getElementById('filterRole').value;
  const plan = document.getElementById('filterPlan').value;
  const filtered = adminUsers.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search);
    const matchRole = !role || u.role === role;
    const matchPlan = !plan || u.plan === plan;
    return matchSearch && matchRole && matchPlan;
  });
  renderUsersTable(filtered);
  document.getElementById('userCount').textContent = `${filtered.length} users`;
}

function toggleUserStatus(id) {
  const u = adminUsers.find(x => x.id === id);
  if (!u) return;
  u.status = u.status === 'actif' ? 'suspendu' : 'actif';
  renderUsersTable(adminUsers);
  showToast(`${u.name} → ${u.status}`, u.status === 'actif' ? 'success' : 'warning');
}

function deleteUser(id) {
  const idx = adminUsers.findIndex(x => x.id === id);
  if (idx === -1) return;
  const name = adminUsers[idx].name;
  adminUsers.splice(idx, 1);
  renderUsersTable(adminUsers);
  showToast(`${name} supprimé`, 'error');
}

function editUser(id) {
  const u = adminUsers.find(x => x.id === id);
  if (!u) return;
  document.getElementById('userModalTitle').textContent = `Éditer — ${u.name}`;
  document.getElementById('userModalBody').innerHTML = `
    <div class="grid-2" style="gap:12px;">
      <div class="form-group">
        <label class="form-label">Nom complet</label>
        <input type="text" class="form-control" id="editUserName" value="${u.name}">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" id="editUserEmail" value="${u.email}">
      </div>
      <div class="form-group">
        <label class="form-label">Rôle</label>
        <select class="form-control" id="editUserRole">
          <option ${u.role==='admin'?'selected':''} value="admin">👑 Admin</option>
          <option ${u.role==='pro'?'selected':''} value="pro">⭐ Pro</option>
          <option ${u.role==='client'?'selected':''} value="client">👤 Client</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Plan</label>
        <select class="form-control" id="editUserPlan">
          <option ${u.plan==='Starter'?'selected':''} value="Starter">Starter — 29€/mois</option>
          <option ${u.plan==='Pro'?'selected':''} value="Pro">Pro — 79€/mois</option>
          <option ${u.plan==='Agency'?'selected':''} value="Agency">Agency — 199€/mois</option>
        </select>
      </div>
    </div>
    <input type="hidden" id="editUserId" value="${u.id}">
  `;
  document.getElementById('userModal').classList.add('show');
}

function openAddUser() {
  document.getElementById('userModalTitle').textContent = 'Nouvel utilisateur';
  document.getElementById('userModalBody').innerHTML = `
    <div class="grid-2" style="gap:12px;">
      <div class="form-group">
        <label class="form-label">Nom complet *</label>
        <input type="text" class="form-control" id="editUserName" placeholder="Jean Dupont">
      </div>
      <div class="form-group">
        <label class="form-label">Email *</label>
        <input type="email" class="form-control" id="editUserEmail" placeholder="jean@email.com">
      </div>
      <div class="form-group">
        <label class="form-label">Rôle</label>
        <select class="form-control" id="editUserRole">
          <option value="client">👤 Client</option>
          <option value="pro">⭐ Pro</option>
          <option value="admin">👑 Admin</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Plan</label>
        <select class="form-control" id="editUserPlan">
          <option value="Starter">Starter — 29€/mois</option>
          <option value="Pro">Pro — 79€/mois</option>
          <option value="Agency">Agency — 199€/mois</option>
        </select>
      </div>
    </div>
    <input type="hidden" id="editUserId" value="">
  `;
  document.getElementById('userModal').classList.add('show');
}

function saveUser() {
  const id = parseInt(document.getElementById('editUserId').value);
  const name = document.getElementById('editUserName').value;
  const email = document.getElementById('editUserEmail').value;
  const role = document.getElementById('editUserRole').value;
  const plan = document.getElementById('editUserPlan').value;
  const priceMap = { Starter:29, Pro:79, Agency:199 };

  if (!name || !email) {
    showToast('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }

  if (id) {
    const u = adminUsers.find(x => x.id === id);
    if (u) { u.name=name; u.email=email; u.role=role; u.plan=plan; u.revenue=priceMap[plan]; }
    showToast('Utilisateur mis à jour !', 'success');
  } else {
    adminUsers.push({
      id: Date.now(), name, email, role, plan,
      status: 'actif', joined: new Date().toISOString().split('T')[0],
      revenue: priceMap[plan]
    });
    showToast('Utilisateur créé !', 'success');
  }

  closeUserModal();
  renderUsersTable(adminUsers);
}

function closeUserModal() {
  const modal = document.getElementById('userModal');
  if (modal) modal.classList.remove('show');
}

// ============================================
// PLANS
// ============================================
function renderPlans() {
  document.getElementById('adminContent').innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
      gap:20px;margin-bottom:28px;">
      ${plans.map(p => {
        const count = adminUsers.filter(u => u.plan === p.name && u.status === 'actif').length;
        const mrr = count * p.price;
        return `
          <div class="card" style="border:1px solid ${p.color}30;position:relative;overflow:hidden;">
            <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${p.color};"></div>
            <div style="text-align:center;padding:12px 0 20px;">
              <h3 style="font-size:1.3rem;font-weight:800;margin-bottom:4px;">${p.name}</h3>
              <div style="font-size:2.2rem;font-weight:900;color:${p.color};">${p.price}€
                <span style="font-size:0.9rem;color:var(--text-muted);font-weight:400;">/mois</span>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
              <div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">
                <div style="font-size:1.6rem;font-weight:800;color:${p.color};">${count}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">Abonnés actifs</div>
              </div>
              <div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:8px;">
                <div style="font-size:1.6rem;font-weight:800;color:var(--accent-green);">${mrr}€</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">MRR</div>
              </div>
            </div>
            <div style="border-top:1px solid var(--border);padding-top:16px;">
              <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:10px;font-weight:600;">
                FONCTIONNALITÉS INCLUSES
              </p>
              ${p.features.map(f => `
                <div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:0.85rem;">
                  <span style="color:${p.color};">✓</span>
                  <span>${f}</span>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-primary" style="width:100%;margin-top:20px;
              background:${p.color}20;color:${p.color};border:1px solid ${p.color}40;"
              onclick="editPlan('${p.name}')">
              ✏️ Modifier ce plan
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- COUPON SECTION -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">🎟 Codes promo</span>
        <button class="btn btn-primary" onclick="createCoupon()">➕ Créer un coupon</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Réduction</th>
              <th>Plan</th>
              <th>Utilisations</th>
              <th>Expiration</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { code:'LAUNCH50', discount:'50%', plan:'Tous', uses:'24/100', exp:'2024-03-01', active:true },
              { code:'PRO30OFF', discount:'30%', plan:'Pro', uses:'8/50', exp:'2024-02-15', active:true },
              { code:'SUMMER20', discount:'20%', plan:'Starter', uses:'47/∞', exp:'2024-06-30', active:false }
            ].map(c => `
              <tr>
                <td><code style="background:var(--bg-secondary);padding:4px 10px;
                  border-radius:6px;font-size:0.85rem;color:var(--accent-blue);">${c.code}</code></td>
                <td style="font-weight:700;color:var(--accent-green);">${c.discount}</td>
                <td>${c.plan}</td>
                <td style="color:var(--text-muted);">${c.uses}</td>
                <td style="font-size:0.82rem;color:var(--text-muted);">${c.exp}</td>
                <td><span class="badge ${c.active?'badge-green':'badge-gray'}">
                  ${c.active?'✅ Actif':'😴 Inactif'}</span></td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm">✏️</button>
                    <button class="btn btn-secondary btn-sm" style="color:var(--accent-red);">🗑</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function editPlan(name) {
  showToast(`Édition du plan ${name} — Fonctionnalité bientôt disponible`, 'info');
}

function createCoupon() {
  showToast('Créer un coupon — Fonctionnalité bientôt disponible', 'info');
}

// ============================================
// SETTINGS
// ============================================
function renderSettings() {
  document.getElementById('adminContent').innerHTML = `
    <div class="grid-2" style="gap:20px;">

      <!-- GENERAL SETTINGS -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">⚙️ Paramètres généraux</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="form-group">
            <label class="form-label">Nom de la plateforme</label>
            <input type="text" class="form-control" value="EcomSolutions">
          </div>
          <div class="form-group">
            <label class="form-label">Email de support</label>
            <input type="email" class="form-control" value="support@ecomsolutions.io">
          </div>
          <div class="form-group">
            <label class="form-label">URL principale</label>
            <input type="url" class="form-control" value="https://ecomsolutions.io">
          </div>
          <div class="form-group">
            <label class="form-label">Langue par défaut</label>
            <select class="form-control">
              <option selected>🇫🇷 Français</option>
              <option>🇬🇧 English</option>
              <option>🇪🇸 Español</option>
            </select>
          </div>
          <button class="btn btn-primary" onclick="saveSettings()">💾 Sauvegarder</button>
        </div>
      </div>

      <!-- NOTIFICATIONS -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔔 Notifications</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;">
          ${[
            { label:'Nouvel utilisateur inscrit', on:true },
            { label:'Paiement reçu', on:true },
            { label:'Compte suspendu', on:true },
            { label:'Rapport hebdomadaire', on:false },
            { label:'Alerte stock critique', on:true },
            { label:'Nouveau ticket support', on:true }
          ].map((n, i) => `
            <div style="display:flex;align-items:center;justify-content:space-between;
              padding:10px 0;border-bottom:1px solid var(--border);">
              <span style="font-size:0.88rem;">${n.label}</span>
              <div class="toggle ${n.on?'active':''}" onclick="this.classList.toggle('active')"
                id="toggle${i}" style="width:44px;height:24px;background:${n.on?'var(--accent-blue)':'var(--border-light)'};
                border-radius:12px;cursor:pointer;position:relative;transition:all 0.3s;">
                <div style="width:18px;height:18px;background:white;border-radius:50%;
                  position:absolute;top:3px;transition:all 0.3s;
                  left:${n.on?'23px':'3px'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- API KEYS -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🔑 Clés API</span>
          <button class="btn btn-secondary btn-sm" onclick="generateKey()">➕ Générer</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${[
            { name:'API Publique', key:'pk_live_ESxxx...4f2a', status:'active' },
            { name:'API Secrète', key:'sk_live_ESyyy...9d1b', status:'active' },
            { name:'Webhook Secret', key:'whsec_ESzzz...3c7e', status:'active' }
          ].map(k => `
            <div style="padding:12px;background:var(--bg-secondary);border-radius:8px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:0.85rem;font-weight:600;">${k.name}</span>
                <span class="badge badge-green">✅ Actif</span>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <code style="flex:1;font-size:0.8rem;color:var(--text-muted);
                  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${k.key}</code>
                <button class="btn btn-secondary btn-sm"
                  onclick="copyKey('${k.key}')">📋</button>
                <button class="btn btn-secondary btn-sm"
                  style="color:var(--accent-red);">🗑</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- DANGER ZONE -->
      <div class="card" style="border-color:var(--accent-red)30;">
        <div class="card-header">
          <span class="card-title" style="color:var(--accent-red);">⚠️ Zone dangereuse</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${[
            { label:'Vider le cache', desc:'Supprime tous les fichiers en cache', action:'clearCache' },
            { label:'Exporter toutes les données', desc:'Export CSV de toutes les données', action:'exportAll' },
            { label:'Réinitialiser la base de données', desc:'⚠️ Action irréversible !', action:'resetDB', danger:true }
          ].map(a => `
            <div style="display:flex;align-items:center;justify-content:space-between;
              padding:12px;background:var(--bg-secondary);border-radius:8px;
              ${a.danger?'border:1px solid var(--accent-red)30;':''}">
              <div>
                <div style="font-size:0.88rem;font-weight:600;
                  ${a.danger?'color:var(--accent-red);':''}">
                  ${a.label}
                </div>
                <div style="font-size:0.78rem;color:var(--text-muted);">${a.desc}</div>
              </div>
              <button class="btn ${a.danger?'btn-secondary':'btn-secondary'} btn-sm"
                style="${a.danger?'color:var(--accent-red);border-color:var(--accent-red)30;':''}"
                onclick="${a.action}()">
                ${a.danger?'💀':'▶'} Exécuter
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function saveSettings() { showToast('Paramètres sauvegardés !', 'success'); }
function generateKey() { showToast('Nouvelle clé API générée !', 'success'); }
function copyKey(key) {
  navigator.clipboard.writeText(key).then(() => showToast('Clé copiée !', 'success'));
}
function clearCache() { showToast('Cache vidé !', 'success'); }
function exportAll() { showToast('Export en cours...', 'info'); }
function resetDB() { showToast('⚠️ Action bloquée en mode démo', 'error'); }

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const user = requireAuth();
  if (!user) return;
  if (user.role !== 'admin') {
    window.location.href = 'dashboard.html';
    return;
  }
  buildSidebar(true);
  document.getElementById('topbarContainer').innerHTML =
    buildTopbar('👑 Administration', 'Panneau de contrôle global');
  renderAdminContent();
});

window.switchAdminTab = switchAdminTab;
window.filterUsers = filterUsers;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.editUser = editUser;
window.openAddUser = openAddUser;
window.saveUser = saveUser;
window.closeUserModal = closeUserModal;
window.editPlan = editPlan;
window.createCoupon = createCoupon;
window.saveSettings = saveSettings;
window.generateKey = generateKey;
window.copyKey = copyKey;
window.clearCache = clearCache;
window.exportAll = exportAll;
window.resetDB = resetDB;