const exerciceData = {
  "id": "nat_chaine_medium_1",
  "title": "أولوية العمليات في ℕ — سلسلة — متوسط",
  "questions": [
    {
      "operation": "احسب: <span dir=\"ltr\">E = 52 × 4 - 3 × 6</span>",
      "steps": [
        "نحدّد الأولوية: الضربان قبل الطرح",
        "ننجز الضربين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">52 × 4 = 208</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">3 × 6 = 18</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">208 - 18</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 190</span>"
      ],
      "hint": "أنجز كل عمليات الضرب ثم اطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">F = 52 + 4 × 3 - 6</span>",
      "steps": [
        "نحدّد الأولوية: الضرب أولا",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">4 × 3 = 12</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">52 + 12 - 6</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">52 + 12 = 64</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">64 - 6 = 58</span>"
      ],
      "hint": "الجمع والطرح لهما نفس الأولوية: من اليسار إلى اليمين"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">I = 24 × 6 + 3 × 4</span>",
      "steps": [
        "نحدّد الأولوية: الضربان قبل الجمع",
        "ننجز الضربين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">24 × 6 = 144</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">3 × 4 = 12</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">144 + 12</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 156</span>"
      ],
      "hint": "ضربان مستقلان ثم جمع"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">M = 45 × 100 - 12 × 5</span>",
      "steps": [
        "نحدّد الأولوية: الضربان قبل الطرح",
        "ننجز الضربين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">45 × 100 = 4500</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 × 5 = 60</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">4500 - 60</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 4440</span>"
      ],
      "hint": "الضرب في 100 يعني إضافة صفرين"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">K = 142 × 100 + 2 × 1000</span>",
      "steps": [
        "نحدّد الأولوية: الضربان قبل الجمع",
        "ننجز الضربين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">142 × 100 = 14200</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">2 × 1000 = 2000</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">14200 + 2000</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 16200</span>"
      ],
      "hint": "انتبه لعدد الأصفار"
    }
  ]
};
window.exerciceData = exerciceData;
