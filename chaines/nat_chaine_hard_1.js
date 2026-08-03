const exerciceData = {
  "id": "nat_chaine_hard_1",
  "title": "أولوية العمليات في ℕ — سلسلة — صعب",
  "questions": [
    {
      "operation": "احسب: <span dir=\"ltr\">U = (6 + 3) × 7</span>",
      "steps": [
        "نحدّد الأولوية: ما بين القوسين أولا",
        "ننجز القوس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(6 + 3) = 9</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">9 × 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 63</span>"
      ],
      "hint": "القوس يغيّر الترتيب المعتاد"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">E = 7 × (9 - 2)</span>",
      "steps": [
        "نحدّد الأولوية: ما بين القوسين أولا",
        "ننجز القوس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(9 - 2) = 7</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 × 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 49</span>"
      ],
      "hint": "الطرح داخل القوس يُنجز قبل الضرب"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">S = (10 - 5) × (5 + 2)</span>",
      "steps": [
        "نحدّد الأولوية: القوسان أولا",
        "ننجز القوسين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(10 - 5) = 5</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(5 + 2) = 7</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 35</span>"
      ],
      "hint": "أفرغ كل قوس ثم اضرب"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">L = (7 + 2) × 3 + 5</span>",
      "steps": [
        "نحدّد الأولوية: القوس ثم الضرب ثم الجمع",
        "ننجز القوس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(7 + 2) = 9</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">9 × 3 + 5</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">9 × 3 = 27</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">27 + 5 = 32</span>"
      ],
      "hint": "قارن هذه العبارة بالعبارة الموالية"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">U = 7 + 2 × 3 + 5</span>",
      "steps": [
        "نحدّد الأولوية: الضرب أولا (لا يوجد قوس)",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">2 × 3 = 6</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 6 + 5</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 18</span>"
      ],
      "hint": "نفس الأعداد بدون قوس تعطي نتيجة مختلفة"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">Q = 6 × 5 - (4 - 3)</span>",
      "steps": [
        "نحدّد الأولوية: القوس أولا ثم الضرب",
        "ننجز القوس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(4 - 3) = 1</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">6 × 5 = 30</span>",
        "نعوّض: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">30 - 1</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 29</span>"
      ],
      "hint": "القوس أولا حتى إن كان بسيطا"
    }
  ]
};
window.exerciceData = exerciceData;
