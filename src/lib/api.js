export const API_URL = 'https://script.google.com/macros/s/AKfycbx-rnofjZSVdH_zfywCkSXbIqlNESb7yqTx2yv6zGO3rtS2U7QtXM8RuKgefYRvZPWrQg/exec';

export function maskPhone(phone) {
  if (!phone || phone.length < 4) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-3);
}

export function formatAmount(n) {
  return Math.round(n).toLocaleString('th-TH');
}

export async function fetchTopSpenders() {
  const res = await fetch(`${API_URL}?action=getTopSpenders&_=${Date.now()}`);
  return res.json();
}

export async function checkPhone(phone) {
  const res = await fetch(`${API_URL}?action=checkPhone&phone=${phone}`);
  return res.json();
}

export async function addTransaction(phone, name, amount) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addTransaction', phone, name, amount })
  });
  return res.json();
}
