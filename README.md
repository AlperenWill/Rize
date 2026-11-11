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

**Durum:** 3 bölüm de çalışır: Rize Sahili ve Kale, Çay Bahçeleri (UNESCO), Zilkale ve Fırtına Vadisi. Bölüm geçişi defterden veya bölüm bitince çıkan davetten yapılır.
Modeller prosedürel low-poly geometridir (LOD için drei `Detailed`, çalı/ağaç/tahtalar InstancedMesh). `.glb` modeller ileride `useGLTF` ile eklenebilir.
