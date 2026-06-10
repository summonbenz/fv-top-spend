# Fleurvive Top Spender

ระบบ Leaderboard แสดงอันดับยอดซื้อสูงสุดแบบ Real-time สำหรับงาน Fleurvive

## Tech Stack

- **Framework:** SvelteKit + Svelte 5
- **Backend:** Google Apps Script Web App
- **Deploy:** Static export (adapter-static)

## หน้าที่มี

| Route | คำอธิบาย |
|-------|----------|
| `/dashboard` | แสดง Leaderboard Top 10 อัปเดตอัตโนมัติทุก 60 วิ |
| `/staff` | ฟอร์มสำหรับ Staff บันทึกยอดซื้อ |

## การติดตั้ง

```bash
npm install
npm run dev
```

## การ Deploy

```bash
npm run build
```

ผลลัพธ์อยู่ใน `build/` — upload ขึ้น static hosting ได้เลย (Netlify, GitHub Pages, ฯลฯ)

## Config

แก้ไข API URL ใน `src/lib/api.js`:

```js
export const API_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```
