# RainAksh Network — Complete Deployment Guide (GitHub Pages & Hosting)

This guide details how to resolve the **blank screen issue** on `https://rainaksh.github.io/` and host the **RainAksh Network** web application with full production performance.

---

## 🔴 Blank Page Problem (ब्लैंक स्क्रीन आने का कारण और समाधान)

### ❓ Blank Screen क्यों आ रहा था? (Why was it blank?)
1. **Uncompiled TypeScript (.tsx):** GitHub Pages केवल स्टैटिक HTML/CSS/JS सर्व करता है। जब आप रिपॉजिटरी में सोर्स कोड पुश करते हैं, तो रूट `index.html` में `<script type="module" src="/src/main.tsx"></script>` होता है। ब्राउज़र बिना कम्पाइल किए `.tsx` कोड को रन नहीं कर सकता, जिससे स्क्रीन पूरी तरह से ब्लैंक (White) दिखती है।
2. **Missing Relative Paths:** डिफ़ॉल्ट Vite में पाथ `/assets/` होते हैं, जबकि GitHub Pages के लिए `./assets/` (Relative Base) आवश्यक होता है।
3. **Nojekyll & SPA 404 Routing:** GitHub Pages में जेकील इंजन को बायपास करने के लिए `.nojekyll` और रीफ्रेश पर 404 एरर रोकने के लिए `404.html` आवश्यक है।

---

## 🟢 We Have Fully Fixed This in the Codebase!

इस समस्या के स्थायी समाधान के लिए निम्नलिखित सेटअप पूर्ण कर दिया गया है:
- ✅ `vite.config.ts` में `base: './'` सेट किया गया।
- ✅ `public/.nojekyll` और `public/404.html` जोड़े गए।
- ✅ `.github/workflows/deploy-pages.yml` ऑटोमेटेड GitHub Actions वर्कफ़्लो बना दिया गया है।
- ✅ `/docs` फ़ोल्डर में पूरी कम्पाइल्ड प्रोडक्शन बिल्ड (`index.html`, `assets/`, `.nojekyll`, `404.html`) प्री-कम्पाइल करके रख दी गई है।

---

## 🚀 GitHub Pages Setup Steps (2 आसान तरीक़े)

अपनी GitHub Repository में जाकर केवल 2 क्लिक में लाइव करें:

### 🌟 तरीक़ा 1 (Recommended): GitHub Actions द्वारा ऑटोमेटेड लाइव
1. अपने GitHub Repository पेज पर जाएँ (`https://github.com/accaiwork/rainaksh-network` या जो भी आपकी रिपॉजिटरी है)।
2. ऊपर **Settings** टैब पर क्लिक करें।
3. बाएँ मेनू (Left Sidebar) में **Pages** पर क्लिक करें।
4. **Build and deployment** के अंदर **Source** ड्रॉपडाउन देखें:
   - **"GitHub Actions"** सेलेक्ट करें।
5. बस! अब **Actions** टैब में जाकर देखेंगे कि **Deploy RainAksh to GitHub Pages** वर्कफ़्लो अपने आप चलना शुरू हो गया है और 1 मिनट के भीतर `https://rainaksh.github.io/` पर वेबसाइट 100% लाइव हो जाएगी।

---

### ⚡ तरीक़ा 2 (Instant): Branch `/docs` फ़ोल्डर से तुरंत लाइव
अगर आप कोई ऑटोमेशन वर्कफ़्लो नहीं चलाना चाहते, तो सीधे `/docs` फ़ोल्डर से लाइव कर सकते हैं:
1. GitHub Repository में **Settings** -> **Pages** में जाएँ।
2. **Source** ड्रॉपडाउन में **"Deploy from a branch"** चुनें।
3. **Branch** सेक्शन में:
   - पहली ड्रॉपडाउन: **`main`** (या `master`) चुनें।
   - दूसरी फ़ोल्डर ड्रॉपडाउन: **`/docs`** चुनें।
4. **Save** बटन दबाएँ।
5. 30 से 60 सेकंड में `https://rainaksh.github.io/` रिफ्रेश करें—वेबसाइट तुरंत लोड हो जाएगी!

---

## 🌐 अन्य होस्टिंग विकल्प (Alternative Free Deployments)

### 1. Vercel (सुपर फ़ास्ट 1-क्लिक डिप्लॉय)
1. [Vercel.com](https://vercel.com) पर जाएँ और GitHub से लॉगिन करें।
2. **"Add New Project"** पर क्लिक करें और अपनी रिपॉजिटरी इम्पोर्ट करें।
3. Framework **Vite** अपने आप डिटेक्ट हो जाएगा।
4. **Deploy** पर क्लिक करें—30 सेकंड में SSL डोमेन के साथ लाइव!

### 2. Netlify
1. [Netlify.com](https://www.netlify.com) पर जाएँ।
2. **"Import from Git"** चुनें।
3. Build command: `npm run build`, Publish directory: `dist`.
4. Deploy site पर क्लिक करें।

---

## 🔑 मास्टर कंट्रोल पैनल (Master Control Panel)
- वेबसाइट के हेडर या बॉटम मेनू में **Control Panel** पर क्लिक करें।
- मास्टर पासकोड दर्ज करके यूज़र्स के फॉर्म रिस्पॉन्स, पासवर्ड, एडिट/अपडेट हिस्ट्री, पेमेंट स्क्रीनशॉट और पेआउट्स को नियंत्रित करें।

---

## 📞 संपर्क एवं सपोर्ट (Help Desk)
- **Telegram:** [@rainaksh](https://t.me/rainaksh)
- **Email:** [accaiwork@gmail.com](mailto:accaiwork@gmail.com)
- **UPI Desk:** `8877490845@spicepay`
