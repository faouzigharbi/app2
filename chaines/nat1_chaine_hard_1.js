const exerciceData = {
  "id": "nat1_chaine_hard_1",
  "title": "أولوية العمليات — سلسلة — صعب",
  "questions": [
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">B = 9 × (3 + 4)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">9 × 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 63</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">U = (6 + 3) × 7</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">9 × 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 63</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">E = 7 × (9 - 2)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 × 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 49</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">S = (10 - 5) × (5 + 2)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 35</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">O = (4 + 7) × (14 - 10)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">11 × 4</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 44</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">M = (7 + 2) × (3 + 5)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">9 × 8</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 72</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">L = (7 + 2) × 3 + 5</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">9 × 3 + 5</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">27 + 5</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 32</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">U = 7 + 2 × 3 + 5</span>",
      "steps": [
        "نحدّد الأولوية: الضرب والقسمة قبل الجمع والطرح",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 6 + 5</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">13 + 5</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 18</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">N = 7 + 5 + 2 × (3 + 5)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 5 + 2 × 8</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">7 + 5 + 16</span>",
        "من اليسار إلى اليمين: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 + 16</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 28</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">Q = 6 × 5 - (4 - 3)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">6 × 5 - 1</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">30 - 1</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 29</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">B = 1230 - (625 + 175)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">1230 - 800</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 430</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">C = 3111 - (654 - 543)</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">3111 - 111</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 3000</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    },
    {
      "operation": "احسب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">V = (24 - 13) × 8 + 7</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس ← الضرب والقسمة ← الجمع والطرح",
        "ننجز الأقواس: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">11 × 8 + 7</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">88 + 7</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 95</span>"
      ],
      "hint": "الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح"
    }
  ]
};
window.exerciceData = exerciceData;
