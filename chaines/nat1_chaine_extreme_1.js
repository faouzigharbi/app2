const exerciceData = {
  "id": "nat1_chaine_extreme_1",
  "title": "أولوية العمليات — سلسلة — متقدّم",
  "questions": [
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">t = 120 - 4 × 5 - 7 × 8 + 54 : 9</span>",
      "steps": [
        "نحدّد الأولوية: الضرب والقسمة قبل الجمع والطرح",
        "ننجز الضرب والقسمة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">120 - 20 - 56 + 6</span>",
        "نجمّع ما يعطي عددا مستديرا: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(120 - 20) - 56 + 6</span>",
        "ننجز القوس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">100 - 56 + 6</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">44 + 6</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 50</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">R = 4 × (2 + 3 × 6) × 5</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "داخل الأقواس: الضرب أولا: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">4 × (2 + 18) × 5</span>",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">4 × 20 × 5</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 400</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">T = [4 × (2 + 3 × 6)] × 5</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "داخل الأقواس: الضرب أولا: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[4 × (2 + 18)] × 5</span>",
        "ننجز القوس الداخلي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[4 × 20] × 5</span>",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">80 × 5</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 400</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">A = 7 + 5 × 2 + 3 × 6 - 4</span>",
      "steps": [
        "نحدّد الأولوية: الضرب والقسمة قبل الجمع والطرح",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 10 + 18 - 4</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">17 + 18 - 4</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">35 - 4</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 31</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">B = 7 + 5 × 2 + 3 × (6 - 4)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 5 × 2 + 3 × 2</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 10 + 6</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">17 + 6</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 23</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">C = (7 + 5) × (2 + 3) × (6 - 4)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 × 5 × 2</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 120</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">D = (7 + 5) × 2 + 3 × (6 - 4)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 × 2 + 3 × 2</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">24 + 6</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 30</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">W = 5 × 2 + 7 × 3</span>",
      "steps": [
        "نحدّد الأولوية: الضرب والقسمة قبل الجمع والطرح",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">10 + 21</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 31</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">X = 5 × (2 + 7) × 3</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × 9 × 3</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 135</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">Y = 5 × (2 + 7 × 3)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "داخل الأقواس: الضرب أولا: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × (2 + 21)</span>",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × 23</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 115</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">Z = (5 × 2 + 7) × 3</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "داخل الأقواس: الضرب أولا: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(10 + 7) × 3</span>",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">17 × 3</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 51</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    }
  ]
};
window.exerciceData = exerciceData;
