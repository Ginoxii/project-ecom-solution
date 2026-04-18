// ============================================
// COMPTA.JS
// ============================================

const transactions = [
  { id:'TXN001', type:'recette', label:'Vente Montre LED Premium', amount:89, date:'2024-01-15', cat:'Ventes', method:'Stripe' },
  { id:'TXN002', type:'recette', label:'Vente Écouteurs Bluetooth', amount:67, date:'2024-01-15', cat:'Ventes', method:'PayPal' },
  { id:'TXN003', type:'depense', label:'Achat publicitaire Meta Ads', amount:250, date:'2024-01-14', cat:'Marketing', method:'CB' },
  { id:'TXN004', type:'recette', label:'Vente Coque iPhone x2', amount:48, date:'2024-01-14', cat:'Ventes', method:'Stripe' },
  { id:'TXN005', type:'depense', label:'Fournisseur AliExpress', amount:180, date:'2024-01-13', cat:'Achats', method:'CB' },
  { id:'TXN006', type:'recette', label:'Vente Lampe LED Bureau', amount:45, date:'2024-01-13', cat:'Ventes', method:'Stripe' },
  { id:'TXN007', type:'depense', label:'Abonnement Shopify', amount:79, date:'2024-01-12', cat:'Logiciel', method:'CB' },
  { id:'TXN008', type:'recette', label:'Vente Support Téléphone x3', amount:57, date:'2024-01-12', cat:'Ventes', method:'PayPal' },
  { id:'TXN009', type:'depense', label:'TikTok Ads', amount:150, date:'2024-01-11', cat:'Marketing', method:'CB' },
  { id:'TXN010', type:'recette', label:'Vente Chargeur Magnétique x2', amount:78, date:'2024-01-11', cat:'Ventes', method:'Stripe' }
];

const invoices = [
  { id:'FAC-2024-001', client:'Lucas Bernard', amount:89, date:'2024-01-15', due:'2024-02-15', status:'payée' },
  { id:'FAC-2024-002', client:'Emma Petit', amount:48, date:'2024-01-15', due:'2024-02-15', status:'payée' },
  { id:'FAC-2024-003', client:'Thomas Martin', amount:67, date:'2024-01-14', due:'2024-02-14', status:'en attente' },
  { id:'FAC-2024-004', client:'Sophie Durand', amount:45, date:'2024-01-14', due:'2024-02-14', status:'payée' },
  { id:'FAC-2024-005', client:'Julien Moreau', amount:57, date:'2024-01-13', due:'2024-02-13', status:'en retard' }
];

let currentComptaTab = 'dashboard';

function switchComptaTab(tab, el) {
  currentComptaTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderComptaContent();
}

function renderComptaContent() {
  const map = {
    dashboard: renderComptaDashboard,
    transactions: renderTransactions,
    invoices: renderInvoices,
    reports: renderReports
  };
  if (map[currentComptaTab]) map[currentComptaTab]();
}

function renderComptaDashboard() {
  const recettes = transactions.filter(t=>t.type==='recette').reduce((s,t)=>s+t.amount,0);
  const depenses = transactions.filter(t=>t.type==='depense').reduce((s,t)=>s+t.amount,0);
  const benefice = recettes - depenses;
  const tva = Math.round(recettes * 0.2);

  document.getElementById('comptaContent').innerHTML = `
    <div class="grid-4" style="gap:16px;margin-bottom:28px;">
      <div class="kpi-card">
        <div class="kpi-icon">💚</div>
        <div class="kpi-value" style="color:var(--accent-green);">${recettes.toLocaleString()}€</div>
        <div class="kpi-label">Recettes ce mois</div>
        <span class="kpi-change positive">▲ +23% vs janvier</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">❤️</div>
        <div class="kpi-value" style="color:var(--accent-red);">${depenses.toLocaleString()}€</div>
        <div class="kpi-label">Dépenses ce mois</div>
        <span class="kpi-change negative">▼ -8% vs janvier</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">💰</div>
        <div class="kpi-value" style="color:${benefice>0?'var(--accent-green)':'var(--accent-red)'};">
          ${benefice.toLocaleString()}€
        </div>
        <div class="kpi-label">Bénéfice net</div>
        <span class="kpi-change positive">▲ Marge ${Math.round(benefice/recettes*100)}%</span>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🏛</div>
        <div class="kpi-value" style="color:var(--accent-orange);">${tva.toLocaleString()}€</div>
        <div class="kpi-label">TVA collectée</div>
        <span class="kpi-change" style="color:var(--text-muted);">À reverser</span>
      </div>
    </div>

    <div class="grid-2" style="gap:20px;">
      <!-- Dépenses par catégorie -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Dépenses par catégorie</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;padding:8px 0;">
          ${Object.entries(
            transactions.filter(t=>t.type==='depense')
              .reduce((acc,t)=>{ acc[t.cat]=(acc[t.cat]||0)+t.amount; return acc; },{})
          ).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) => {
            const pct = Math.round(amt/depenses*100);
            const colors = { Marketing:'var(--accent-blue)', Achats:'var(--accent-orange)',
              Logiciel:'var(--accent-purple)', Transport:'var(--accent-green)' };
            const color = colors[cat] || 'var(--accent-blue)';
            return `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="font-size:0.88rem;font-weight:500;">${cat}</span>
                  <span style="font-size:0.85rem;color:var(--accent-red);font-weight:600;">${amt}€ (${pct}%)</span>
                </div>
                <div style="height:8px;background:var(--bg-secondary);border-radius:4px;">
                  <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Recettes par méthode -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">💳 Recettes par moyen de paiement</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;padding:8px 0;">
          ${Object.entries(
            transactions.filter(t=>t.type==='recette')
              .reduce((acc,t)=>{ acc[t.method]=(acc[t.method]||0)+t.amount; return acc; },{})
          ).sort((a,b)=>b[1]-a[1]).map(([method,amt]) => {
            const pct = Math.round(amt/recettes*100);
            const icons = { Stripe:'💳', PayPal:'🅿️', CB:'💰' };
            return `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="font-size:0.88rem;font-weight:500;">${icons[method]||'💳'} ${method}</span>
                  <span style="font-size:0.85rem;color:var(--accent-green);font-weight:600;">${amt}€ (${pct}%)</span>
                </div>
                <div style="height:8px;background:var(--bg-secondary);border-radius:4px;">
                  <div style="height:100%;width:${pct}%;background:var(--accent-green);border-radius:4px;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderTransactions() {
  document.getElementById('comptaContent').innerHTML = `
    <div class="card" style="margin-bottom:20px;">
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <input type="text" class="form-control" placeholder="🔍 Rechercher..." style="flex:1;">
        <select class="form-control" style="width:160px;" onchange="filterTxn(this.value)">
          <option value="">Tout type</option>
          <option value="recette">💚 Recettes</option>
          <option value="depense">❤️ Dépenses</option>
        </select>
        <button class="btn btn-primary" onclick="addTransaction()">➕ Ajouter</button>
        <button class="btn btn-secondary" onclick="exportTxn()">📥 Export CSV</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">💳 Toutes les transactions</span>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr><th>ID</th><th>Libellé</th><th>Catégorie</th><th>Méthode</th><th>Date</th><th>Type</th><th>Montant</th></tr>
          </thead>
          <tbody>
            ${transactions.map(t => `
              <tr>
                <td><code style="font-size:0.78rem;background:var(--bg-secondary);
                  padding:2px 6px;border-radius:4px;">${t.id}</code></td>
                <td style="font-size:0.88rem;font-weight:500;">${t.label}</td>
                <td><span class="badge badge-blue">${t.cat}</span></td>
                <td style="font-size:0.83rem;">${t.method}</td>
                <td style="font-size:0.82rem;color:var(--text-muted);">${t.date}</td>
                <td><span class="badge ${t.type==='recette'?'badge-green':'badge-red'}">
                  ${t.type==='recette'?'💚 Recette':'❤️ Dépense'}</span></td>
                <td><strong style="color:${t.type==='recette'?'var(--accent-green)':'var(--accent-red)'};">
                  ${t.type==='recette'?'+':'−'}${t.amount}€
                </strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderInvoices() {
  document.getElementById('comptaContent').innerHTML = `
    <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="createInvoice()">➕ Nouvelle facture</button>
      <button class="btn btn-secondary" onclick="exportInvoices()">📥 Export PDF</button>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">🧾 Factures</span>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr><th>N° Facture</th><th>Client</th><th>Montant</th><th>Émise le</th><th>Échéance</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${invoices.map(inv => {
              const statusMap = {
                payée: 'badge-green', 'en attente': 'badge-orange', 'en retard': 'badge-red'
              };
              return `
                <tr>
                  <td><strong style="color:var(--accent-blue);">${inv.id}</strong></td>
                  <td style="font-weight:500;">${inv.client}</td>
                  <td><strong style="color:var(--accent-green);">${inv.amount}€</strong></td>
                  <td style="font-size:0.82rem;color:var(--text-muted);">${inv.date}</td>
                  <td style="font-size:0.82rem;color:var(--text-muted);">${inv.due}</td>
                  <td><span class="badge ${statusMap[inv.status]}">${inv.status}</span></td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button class="btn btn-secondary btn-sm" onclick="downloadInvoice('${inv.id}')">📄</button>
                      <button class="btn btn-secondary btn-sm" onclick="sendInvoice('${inv.id}')">📧</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderReports() {
  document.getElementById('comptaContent').innerHTML = `
    <div class="grid-2" style="gap:20px;">
      ${[
        { title:'📊 Rapport mensuel', desc:'Résumé complet du mois en cours', icon:'📅', color:'var(--accent-blue)' },
        { title:'📈 Rapport annuel', desc:'Bilan comptable de l\'année 2024', icon:'📆', color:'var(--accent-purple)' },
        { title:'🏛 Déclaration TVA', desc:'Export pour déclaration TVA trimestrielle', icon:'🏛', color:'var(--accent-orange)' },
        { title:'💰 Compte de résultat', desc:'P&L détaillé sur la période', icon:'💼', color:'var(--accent-green)' }
      ].map(r => `
        <div class="card" style="cursor:pointer;transition:var(--transition);"
          onclick="generateReport('${r.title}')"
          onmouseover="this.style.borderColor='${r.color}'"
          onmouseout="this.style.borderColor='var(--border)'">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
            <div style="width:52px;height:52px;background:${r.color}20;border-radius:12px;
              display:flex;align-items:center;justify-content:center;font-size:1.6rem;">
              ${r.icon}
            </div>
            <div>
              <h3 style="font-size:1rem;font-weight:700;">${r.title}</h3>
              <p style="font-size:0.83rem;color:var(--text-muted);">${r.desc}</p>
            </div>
          </div>
          <button class="btn btn-primary" style="width:100%;background:${r.color}20;
            color:${r.color};border:1px solid ${r.color}40;">
            📥 Télécharger
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function addTransaction() { showToast('Ajouter transaction — Bientôt disponible', 'info'); }
function filterTxn(val) { showToast(`Filtre: ${val || 'Tout'}`, 'info'); }
function exportTxn() { showToast('Export CSV transactions téléchargé !', 'success'); }
function createInvoice() { showToast('Nouvelle facture — Bientôt disponible', 'info'); }
function exportInvoices() { showToast('Export PDF en cours...', 'info'); }
function downloadInvoice(id) { showToast(`Facture ${id} téléchargée !`, 'success'); }
function sendInvoice(id) { showToast(`Facture ${id} envoyée par email !`, 'success'); }
function generateReport(name) { showToast(`${name} en cours de génération...`, 'info'); }

document.addEventListener('DOMContentLoaded', function() {
  const user = requireAuth();
  if (!user) return;
  buildSidebar(user.role === 'admin');
  document.getElementById('topbarContainer').innerHTML =
    buildTopbar('💼 Comptabilité', 'Gestion financière de votre activité');
  renderComptaContent();
});

window.switchComptaTab = switchComptaTab;
window.filterTxn = filterTxn;
window.addTransaction = addTransaction;
window.exportTxn = exportTxn;
window.createInvoice = createInvoice;
window.exportInvoices = exportInvoices;
window.downloadInvoice = downloadInvoice;
window.sendInvoice = sendInvoice;
window.generateReport = generateReport;