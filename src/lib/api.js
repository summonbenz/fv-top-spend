import { PUBLIC_API_URL } from '$env/static/public';
export const API_URL = PUBLIC_API_URL;

export function maskPhone(phone) {
  if (!phone || phone.length < 10) return phone;
  return phone.slice(0, 3) + '-xxx-xx' + phone.slice(-2);
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

export async function fetchAllSpenders() {
  const res = await fetch(`${API_URL}?action=getAllSpenders&_=${Date.now()}`);
  return res.json();
}

export async function addTransaction(phone, name, amount) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addTransaction', phone, name, amount })
  });
  return res.json();
}
