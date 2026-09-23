// Dados e funções compartilhados entre index.html (leitura) e editor.html (edição).

// Mesmas categorias (e na mesma ordem) do relatório de estoque do JW Hub.
const CATEGORIES = [
  'Bíblias',
  'Livros',
  'Brochuras e livretos',
  'Formulários e itens',
  'Folhetos',
  'Revistas para o público'
];

const CAT_KEY = {
  'Bíblias': 'biblias',
  'Livros': 'livros',
  'Brochuras e livretos': 'brochuras',
  'Formulários e itens': 'formularios',
  'Folhetos': 'folhetos',
  'Revistas para o público': 'revistas'
};

// Nome curto usado nos chips (cabe melhor no celular).
const CAT_SHORT = {
  'Bíblias': 'Bíblias',
  'Livros': 'Livros',
  'Brochuras e livretos': 'Brochuras',
  'Formulários e itens': 'Formulários',
  'Folhetos': 'Folhetos',
  'Revistas para o público': 'Revistas'
};

// Categorias antigas (antes de seguir o JW Hub) -> categoria nova.
const LEGACY_CAT = {
  'Sentinela': 'Revistas para o público',
  'Despertai': 'Revistas para o público',
  'Livro': 'Livros',
  'Livro Letra Grande': 'Livros',
  'Cântico': 'Livros',
  'Brochura': 'Brochuras e livretos',
  'Cartilha': 'Brochuras e livretos',
  'Folheto': 'Folhetos',
  'Outros': 'Formulários e itens'
};

const MONTHS = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function monthKey(d){
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function monthLabel(key){
  if(!key) return '—';
  const [y, m] = key.split('-').map(Number);
  return MONTHS[m - 1] + ' de ' + y;
}
function monthLabelCap(key){
  const s = monthLabel(key);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function prevMonthKey(key){
  const [y, m] = key.split('-').map(Number);
  return monthKey(new Date(y, m - 2, 1));
}

// Garante o formato atual dos dados, mesmo lendo um data.json antigo.
function normalizePayload(payload){
  payload = payload || {};
  const items = (payload.items || []).map(it => {
    const o = Object.assign({}, it);
    if(!CATEGORIES.includes(o.cat)) o.cat = LEGACY_CAT[o.cat] || 'Formulários e itens';
    if(o.reorder === undefined) o.reorder = o.status === 'Baixo Estoque';
    if(o.countedMonth === undefined){
      const m = /^\d{2}\/(\d{2})\/(\d{4})/.exec(o.lastChecked || '');
      o.countedMonth = m ? (m[2] + '-' + m[1]) : null;
    }
    delete o.status;
    if(o.quantity === null || o.quantity === undefined) o.quantity = 0;
    o.note = o.note || '';
    o.image = o.image || '';
    return o;
  });
  return {
    version: 2,
    updatedAt: payload.updatedAt || null,
    survey: payload.survey || { month: monthKey(), startedAt: null, closedAt: null, closedBy: null },
    history: payload.history || {},
    items
  };
}

// Mês "da vez": sempre o mês corrente. Na virada do mês tudo volta a ficar pendente sozinho.
function currentMonth(){ return monthKey(); }

function isCounted(it){ return it.countedMonth === currentMonth(); }

// 'pendente' (ainda não contado este mês) | 'falta' (contado, zero) | 'contado'
function itemState(it){
  if(!isCounted(it)) return 'pendente';
  return (Number(it.quantity) || 0) === 0 ? 'falta' : 'contado';
}
const STATE_LABEL = { pendente: 'Pendente', falta: 'Em falta', contado: 'Contado' };

function needsAttention(it){
  return it.reorder || itemState(it) === 'falta';
}

// Snapshot mais recente ANTES do mês informado (o "mês anterior" da comparação).
function baselineKey(history, month){
  const keys = Object.keys(history || {}).filter(k => k < month).sort();
  return keys.length ? keys[keys.length - 1] : null;
}

function sortItems(list){
  return list.slice().sort((a, b) =>
    a.code.localeCompare(b.code, 'pt-BR', { numeric: true, sensitivity: 'base' }));
}

function itemsByCategory(items){
  return CATEGORIES.map(cat => ({ cat, items: sortItems(items.filter(it => it.cat === cat)) }));
}

function esc(s){
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmt(n){ return (Number(n) || 0).toLocaleString('pt-BR'); }

function catStyle(cat){
  const key = CAT_KEY[cat] || 'formularios';
  return `--cat-color:var(--${key});--cat-bg:var(--${key}-bg);`;
}

// Capa pequena; se a imagem não existir/falhar, fica aparecendo o código no lugar.
function thumbHTML(it){
  const img = it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy" onerror="this.remove()">` : '';
  return `<span class="rthumb" data-c="${esc(it.code)}">${img}</span>`;
}

// Tabela "mês anterior x mês atual", agrupada por categoria.
function compareHTML(items, history, opts){
  opts = opts || {};
  const month = currentMonth();
  const bKey = baselineKey(history, month);
  const base = bKey ? (history[bKey].qty || {}) : {};
  const onlyChanged = !!opts.onlyChanged;
  let totalPrev = 0, totalNow = 0;

  const groups = itemsByCategory(items).map(({ cat, items: list }) => {
    let catPrev = 0, catNow = 0;
    const rows = list.map(it => {
      const hasPrev = Object.prototype.hasOwnProperty.call(base, it.code);
      const prev = hasPrev ? Number(base[it.code]) || 0 : null;
      const counted = isCounted(it);
      const now = Number(it.quantity) || 0;
      if(hasPrev) catPrev += prev;
      if(counted) catNow += now;
      const diff = (counted && hasPrev) ? now - prev : null;
      if(onlyChanged && !(diff !== null && diff !== 0) && !(counted && !hasPrev && now > 0)) return '';
      const diffHTML = diff === null ? '<span class="muted">—</span>'
        : diff === 0 ? '<span class="muted">=</span>'
        : `<span class="${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '+' : '−'}${fmt(Math.abs(diff))}</span>`;
      return `<tr>
        <td class="mono">${esc(it.code)}</td>
        <td>${esc(it.title)}</td>
        <td class="num">${hasPrev ? fmt(prev) : '<span class="muted">—</span>'}</td>
        <td class="num">${counted ? fmt(now) : '<span class="pend">pendente</span>'}</td>
        <td class="num">${diffHTML}</td>
      </tr>`;
    }).join('');
    totalPrev += catPrev; totalNow += catNow;
    if(!rows) return '';
    return `<tbody style="${catStyle(cat)}">
      <tr class="cat-row"><th colspan="2">${esc(cat)}</th><th class="num">${fmt(catPrev)}</th><th class="num">${fmt(catNow)}</th><th></th></tr>
      ${rows}
    </tbody>`;
  }).join('');

  const head = `<div class="compare-head">
      <span><b>Anterior:</b> ${bKey ? esc(history[bKey].label || monthLabel(bKey)) : 'sem registro'}</span>
      <span><b>Atual:</b> levantamento de ${monthLabel(month)}</span>
    </div>`;
  if(!groups) return head + '<div class="empty">Nenhuma diferença até agora.</div>';
  return head + `<div class="table-scroll"><table class="inv-table compare">
    <thead><tr><th>Código</th><th>Título</th><th class="num">Anterior</th><th class="num">Atual</th><th class="num">Dif.</th></tr></thead>
    ${groups}
    <tfoot><tr><th colspan="2">Total</th><th class="num">${fmt(totalPrev)}</th><th class="num">${fmt(totalNow)}</th><th></th></tr></tfoot>
  </table></div>`;
}

function utf8ToBase64(str){
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function base64ToUtf8(b64){
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for(let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

function formatDateTime(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  if(isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function nowBR(){
  return new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Lista de grupos no estilo do relatório do JW Hub (um bloco por categoria).
// opts.clickable: cada linha vira botão com data-cat; opts.extra: HTML de uma linha final (ex.: Revisão).
function groupListHTML(items, opts){
  opts = opts || {};
  const tag = opts.clickable ? 'button' : 'div';
  const rows = CATEGORIES.map(cat => {
    const list = items.filter(it => it.cat === cat);
    const done = list.filter(isCounted).length;
    const withQty = list.filter(it => isCounted(it) && (Number(it.quantity) || 0) > 0).length;
    const left = list.length - done;
    const pct = list.length ? Math.round(done / list.length * 100) : 0;
    const state = left === 0 ? 'ok' : done > 0 ? 'part' : 'none';
    const badge = left === 0
      ? '<span class="gcheck" aria-label="Completo"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
      : `<span class="gleft ${state}">${done ? 'faltam ' + left : 'pendente'}</span>`;
    return `<${tag} class="grow ${state}" data-cat="${esc(cat)}" style="${catStyle(cat)}">
      <span class="gmain">
        <span class="gname">${esc(cat)}</span>
        <span class="gsub">Itens com alguma quantidade: <b>${withQty}</b> · ${done} de ${list.length} contados</span>
        <span class="gbar"><span style="width:${pct}%"></span></span>
      </span>
      ${badge}
    </${tag}>`;
  }).join('');
  return `<div class="groups">${rows}${opts.extra || ''}</div>`;
}
