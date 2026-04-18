// ============================================
// DASHBOARD.JS
// ============================================

const KPI_DATA = [
  { icon: '💰', label: "Chiffre d'affaires", value: '12 847€',
    change: '+23.4%', positive: true, color: '#3b82f6',
    mini: [30,45,28,60,75,55,80,95,70,88,100,92] },
  { icon: '📦', label: 'Commandes', value: '284',
    change: '+12.1%', positive: true, color: '#10b981',
    mini: [20,35,25,40,55,45,60,70,58,75,80,72] },
  { icon: '📊', label: 'Taux de conversion', value: '3.8%',
    change: '-0.4%', positive: false, color: '#f59e0b',
    mini: [4.2,3.9,4.1,3.8,3.6,3.9,4.0,3.7,3.8,3.6,3.8,3.8] },
  { icon: '🛒', label: 'Panier moyen', value: '45.24€',
    change: '+8.7%', positive: true, color: '#8b5cf6',
    mini: [38,41,39,44,42,45,43,46,44,47,45,45] }
];

const CHART_DATA = {
  day: {
    labels: ['06h','09h','12h','15h','18h','21h','24h'],
    values: [120,340,280,520,680,430,210]
  },
  week: {
    labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    values: [890,1240,980,1560,2100,1800,650]
  },
  month: {
    labels: ['S1','S2','S3','S4'],
    values: [4200,5800,4900,7200]
  }
};

const AI_TIPS = [
  {
    icon: '🎯',
    title: 'Optimisez vos publicités TikTok',
    text: 'Votre CTR TikTok est 40% sous la moyenne. Testez des hooks plus accrocheurs dans les 3 premières secondes.'
  },
  {
    icon: '📦',
    title: 'Rupture de stock imminente',
    text: '3 produits bestsellers ont moins de 10 unités. Réapprovisionnez-vous avant 72h pour éviter les pertes.'
  },
  {
    icon: '💰',
    title: 'Augmentez votre panier moyen',
    text: 'Proposez des bundles sur vos 5 produits les plus vendus. Potentiel : +18% de revenu par commande.'
  }
];

const RECENT_ORDERS = [
  { id: '#1042', client: 'Lucas Bernard', product: 'Montre LED', amount: '89€', status: 'livré' },
  { id: '#1041', client: 'Emma Petit', product: 'Coque iPhone', amount: '24€', status: 'expédié' },
  { id: '#1040', client: 'Thomas Martin', product: 'Écouteurs BT', amount: '67€', status: 'en attente' },
  { id: '#1039', client: 'Sophie Durand', product: 'Lampe LED', amount: '45€', status: 'livré' },
  { id: '#1038', client: 'Julien Moreau', product: 'Support Tel', amount: '19€', status: 'litige' }
];

const TOP_PRODUCTS = [
  { name: 'Montre LED Premium', sales: 142, revenue: '12 638€', trend: '📈' },
  { name: 'Écouteurs Bluetooth', sales: 98, revenue: '6 566€', trend: '📈' },
  { name: 'Coque iPhone MagSafe', sales: 87, revenue: '2 088€', trend: '📊' },
  { name: 'Lampe LED Bureau', sales: 65, revenue: '2 925€', trend: '📉' },
  { name: 'Support Téléphone', sales: 54, revenue: '1 026€', trend: '📈' }
];

const ALERTS = [
  { type: 'warning', icon: '⚠️', title: 'Stock critique', desc: 'Montre LED : 2 unités restantes', time: '2 min' },
  { type: 'info', icon: '📊', title: 'Tendance détectée', desc: 'Les chargeurs solaires sont en forte hausse cette semaine', time: '1h' },
  { type: 'success', icon: '🎉', title: 'Record journalier', desc: 'Vous avez dépassé votre record de CA avec 892€ aujourd\'hui', time: '3h' }
];

function getStatusBadge(status) {
  const map = {
    'livré': 'badge-green',
    'expédié': 'badge-blue',
    'en attente': 'badge-orange',
    'litige': 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function renderKPIs() {
  const grid = document.getElementById('kpiGrid');
  if (!grid) return;

  grid.innerHTML = KPI_DATA.map(kpi => `
    <div class="kpi-card" style="--kpi-color:${kpi.color};">
      <div class="kpi-icon" style="background:${kpi.color}20;">
        ${kpi.icon}
      </div>
      <div class="kpi-value">${kpi.value}</div>
      <div class="kpi-label">${kpi.label}</div>
      <span class="kpi-change ${kpi.positive ? 'positive' : 'negative'}">
        ${kpi.positive ? '▲' : '▼'} ${kpi.change}
      </span>
      <div class="mini-chart" style="margin-top:14px;">
        ${kpi.mini.map(v => `
          <div class="mini-bar" style="height:${(v/100)*40}px;background:${kpi.color}40;"></div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderChart(type = 'day') {
  const container = document.getElementById('revenueChart');
  if (!container) return;

  const data = CHART_DATA[type];
  const max = Math.max(...data.values);

  container.innerHTML = `
    <div class="chart-bars" style="height:180px;align-items:flex-end;display:flex;gap:8px;padding:0 8px;">
      ${data.labels.map((label, i) => {
        const pct = (data.values[i] / max) * 100;
        return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;">
            <div style="width:100%;background:linear-gradient(180deg,#3b82f6,rgba(59,130,246,0.3));
              border-radius:4px 4px 0 0;height:${pct}%;min-height:4px;cursor:pointer;transition:all 0.3s;"
              title="${data.values[i]}€"
              onmouseover="this.style.background='linear-gradient(180deg,#60a5fa,rgba(96,165,250,0.5))'"
              onmouseout="this.style.background='linear-gradient(180deg,#3b82f6,rgba(59,130,246,0.3))'">
            </div>
            <span style="font-size:0.7rem;color:var(--text-muted);">${label}</span>
          </div>
        `;
      }).join('')}
    </div>
    <div style="text-align:right;margin-top:8px;font-size:0.78rem;color:var(--text-muted);">
      Total : <strong style="color:var(--text-primary);">
        ${data.values.reduce((a,b)=>a+b,0).toLocaleString()}€
      </strong>
    </div>
  `;
}

function switchChart(type, btn) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderChart(type);
}

function renderAITips() {
  const container = document.getElementById('aiTipsContainer');
  if (!container) return;

  container.innerHTML = AI_TIPS.map(tip => `
    <div class="ai-tip">
      <div class="ai-tip-icon">${tip.icon}</div>
      <div class="ai-tip-content">
        <h4>${tip.title}</h4>
        <p>${tip.text}</p>
      </div>
    </div>
  `).join('');
}

function refreshTips() {
  const container = document.getElementById('aiTipsContainer');
  container.style.opacity = '0.5';
  setTimeout(() => {
    renderAITips();
    container.style.opacity = '1';
    showToast('Tips IA actualisés !', 'success');
  }, 800);
}

function renderRecentOrders() {
  const container = document.getElementById('recentOrders');
  if (!container) return;

  container.innerHTML = `
    <div class="table-container" style="border:none;">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${RECENT_ORDERS.map(order => `
            <tr onclick="window.location.href='orders.html'" style="cursor:pointer;">
              <td><strong>${order.id}</strong></td>
              <td>${order.client}</td>
              <td><strong style="color:var(--accent-green);">${order.amount}</strong></td>
              <td>${getStatusBadge(order.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderTopProducts() {
  const container = document.getElementById('topProducts');
  if (!container) return;

  container.innerHTML = TOP_PRODUCTS.map((p, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 0;
      border-bottom:1px solid var(--border);" class="${i === TOP_PRODUCTS.length-1 ? '' : ''}">
      <div style="width:28px;height:28px;background:rgba(59,130,246,0.1);border-radius:6px;
        display:flex;align-items:center;justify-content:center;
        font-size:0.75rem;font-weight:700;color:var(--accent-blue);">
        ${i + 1}
      </div>
      <div style="flex:1;">
        <div style="font-size:0.88rem;font-weight:600;color:var(--text-primary);">${p.name}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">${p.sales} ventes</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.88rem;font-weight:700;color:var(--accent-green);">${p.revenue}</div>
        <div style="font-size:0.8rem;">${p.trend}</div>
      </div>
    </div>
  `).join('');
}

function renderAlerts() {
  const container = document.getElementById('alertsContainer');
  if (!container) return;

  const colors = { warning: '#f59e0b', info: '#3b82f6', success: '#10b981' };

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${ALERTS.map(alert => `
        <div style="display:flex;align-items:center;gap:14px;padding:14px;
          background:var(--bg-secondary);border-radius:var(--radius-sm);
          border-left:3px solid ${colors[alert.type]};">
          <span style="font-size:1.2rem;">${alert.icon}</span>
          <div style="flex:1;">
            <div style="font-size:0.88rem;font-weight:600;color:var(--text-primary);">
              ${alert.title}
            </div>
            <div style="font-size:0.8rem;color:var(--text-secondary);">${alert.desc}</div>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);">${alert.time}</span>
          <button onclick="this.parentElement.remove()"
            style="background:none;border:none;color:var(--text-muted);cursor:pointer;">✕</button>
        </div>
      `).join('')}
    </div>
  `;
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', function() {
  const user = requireAuth();
  if (!user) return;

  buildSidebar(user.role === 'admin');

  document.getElementById('topbarContainer').innerHTML =
    buildTopbar('Dashboard', 'Vue d\'ensemble');

  document.getElementById('welcomeTitle').textContent =
    `Bonjour ${user.firstName} 👋`;

  renderKPIs();
  renderChart('day');
  renderAITips();
  renderRecentOrders();
  renderTopProducts();
  renderAlerts();
});

window.switchChart = switchChart;
window.refreshTips = refreshTips;