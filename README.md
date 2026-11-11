# Rize Mirası Keşif Simülasyonu

Rize'nin tarihi ve kültürel mirasını 10 yaş grubuna keşfettiren web tabanlı 3D simülasyon.
React + Vite · Three.js (@react-three/fiber, drei) · Tailwind CSS · Zustand · lucide-react

```bash
npm install
npm run dev      # geliştirme
npm run build    # üretim derlemesi
```

**Kontroller:** WASD yürü · Shift koş · Fare bak (sahneye tıkla) · E incele · J defter.
Mobilde sol joystick ile yürü, sağ tarafı sürükleyerek bak.

**Durum:** Bölüm 1 (Rize Kalesi + Tarihi İskele) çalışır. Bölüm 2 ve 3 verisi `src/data/locations.json` içinde hazır, sahneleri sırada.
Modeller şimdilik prosedürel düşük poligonlu geometri; `.glb` modeller ileride `useGLTF` ile eklenebilir.
