export const locales = ["en","hi","ta","te","bn","mr","gu","pa","kn","ml","or"]

export const t = (lang = "en", key, fallback = "") => {
  const dict = translations[locales.includes(lang) ? lang : "en"] || translations.en
  return (dict && dict[key]) || fallback || key
}

export const translations = {
  en: {
    welcome: "Welcome",
    upload_success: "Uploaded successfully",
    deleted: "Deleted"
  },
  hi: {
    welcome: "स्वागत है",
    upload_success: "सफलतापूर्वक अपलोड किया गया",
    deleted: "हटा दिया गया"
  },
  ta: { welcome: "வரவேற்பு", upload_success: "வெற்றிகரமாக பதிவேற்றப்பட்டது", deleted: "அகற்றப்பட்டது" },
  te: { welcome: "స్వాగతం", upload_success: "విజయవంతంగా అప్‌లోడ్ చేయబడింది", deleted: "తొలగించబడింది" },
  bn: { welcome: "স্বাগতম", upload_success: "সফলভাবে আপলোড হয়েছে", deleted: "মুছে ফেলা হয়েছে" },
  mr: { welcome: "स्वागत", upload_success: "यशस्वीरित्या अपलोड केले", deleted: "हटवले" },
  gu: { welcome: "સ્વાગત", upload_success: "સફળતાપૂર્વક અપલોડ થયું", deleted: "કાઢી નાખ્યું" },
  pa: { welcome: "ਸਵਾਗਤ", upload_success: "ਸਫਲਤਾਪੂਰਵਕ ਅਪਲੋਡ ਕੀਤਾ", deleted: "ਹਟਾਇਆ" },
  kn: { welcome: "ಸ್ವಾಗತ", upload_success: "ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ", deleted: "ಅಳಿಸಲಾಗಿದೆ" },
  ml: { welcome: "സ്വാഗതം", upload_success: "വിജയകരമായി അപ്ലോഡ് ചെയ്തു", deleted: "മായ്ക്കി" },
  or: { welcome: "ସ୍ବାଗତ", upload_success: "ସଫଳତାର ସହ ଅପଲୋଡ୍ ହେଲା", deleted: "ମେଚିଦେଲା" }
}


