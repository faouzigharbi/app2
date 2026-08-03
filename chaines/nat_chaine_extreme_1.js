const exerciceData = {
  "id": "nat_chaine_extreme_1",
  "title": "أولوية العمليات في ℕ — سلسلة — متقدّم",
  "questions": [
    {
      "operation": "احسب: <span dir=\"ltr\">t = 120 - 4 × 5 - 7 × 8 + 54 : 9</span>",
      "steps": [
        "نحدّد الأولوية: الضرب والقسمة قبل الجمع والطرح",
        "ننجز الضرب والقسمة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">4 × 5 = 20</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 × 8 = 56</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">54 : 9 = 6</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">120 - 20 - 56 + 6</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">120 - 20 = 100</span>",
        "ثم: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">100 - 56 = 44</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">44 + 6 = 50</span>"
      ],
      "hint": "أنجز كل الضرب والقسمة أولا ثم امش من اليسار إلى اليمين"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">y = 12 - 2 - 5 + 15 × 2</span>",
      "steps": [
        "نحدّد الأولوية: الضرب أولا",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">15 × 2 = 30</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 - 2 - 5 + 30</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 - 2 = 10</span>",
        "ثم: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">10 - 5 = 5</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 + 30 = 35</span>"
      ],
      "hint": "الطرح المتتالي يُنجز من اليسار إلى اليمين"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">B = 7 + 5 × 2 + 3 × (6 - 4)</span>",
      "steps": [
        "نحدّد الأولوية: القوس ثم الضرب ثم الجمع",
        "ننجز القوس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(6 - 4) = 2</span>",
        "ننجز الضربين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × 2 = 10</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">3 × 2 = 6</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 10 + 6</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 23</span>"
      ],
      "hint": "القوس أولا، ثم كل عمليات الضرب"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">C = (7 + 5) × (2 + 3) × (6 - 4)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس الثلاثة أولا",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(7 + 5) = 12</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(2 + 3) = 5</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(6 - 4) = 2</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 × 5 × 2</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 × 5 = 60</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">60 × 2 = 120</span>"
      ],
      "hint": "أفرغ كل الأقواس ثم اضرب"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">R = 4 × (2 + 3 × 6) × 5</span>",
      "steps": [
        "نحدّد الأولوية: داخل القوس أيضا الضرب قبل الجمع",
        "داخل القوس — الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">3 × 6 = 18</span>",
        "داخل القوس — الجمع: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(2 + 18) = 20</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">4 × 20 × 5</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">4 × 20 = 80</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">80 × 5 = 400</span>"
      ],
      "hint": "قاعدة الأولوية تُطبّق أيضا داخل القوس"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">T = [4 × (2 + 3 × 6)] : 8 + 5</span>",
      "steps": [
        "نحدّد الأولوية: القوس الداخلي ثم الخارجي ثم القسمة",
        "داخل القوس — الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">3 × 6 = 18</span>",
        "داخل القوس — الجمع: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(2 + 18) = 20</span>",
        "القوس الخارجي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[4 × 20] = 80</span>",
        "ننجز القسمة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">80 : 8 = 10</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">10 + 5 = 15</span>"
      ],
      "hint": "القسمة قبل الجمع"
    }
  ]
};
window.exerciceData = exerciceData;
