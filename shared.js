// Dados compartilhados entre index.html (leitura) e editor.html (edição).

const CATEGORIES = [
  'Bíblias',
  'Sentinela',
  'Despertai',
  'Livro',
  'Livro Letra Grande',
  'Brochura',
  'Folheto',
  'Cartilha',
  'Cântico',
  'Outros'
];

const CAT_KEY = {
  'Bíblias': 'biblias',
  'Sentinela': 'sentinela',
  'Despertai': 'despertai',
  'Livro': 'livro',
  'Livro Letra Grande': 'livrolg',
  'Brochura': 'brochura',
  'Folheto': 'folheto',
  'Cartilha': 'cartilha',
  'Cântico': 'cantico',
  'Outros': 'outros'
};

// Sigla curta exibida como ícone (evita depender de fontes de emoji).
const ICONS = {
  'Bíblias': 'BB',
  'Sentinela': 'ST',
  'Despertai': 'DP',
  'Livro': 'LV',
  'Livro Letra Grande': 'LG',
  'Brochura': 'BR',
  'Folheto': 'FO',
  'Cartilha': 'CT',
  'Cântico': 'MU',
  'Outros': 'OU'
};

const STATUS_TOKEN = {
  'Pendente': 'pendente',
  'Verificado': 'verificado',
  'Baixo Estoque': 'baixo',
  'Repor': 'repor'
};

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
