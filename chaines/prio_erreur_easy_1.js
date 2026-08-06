const quizData = {
  "id": "prio_erreur_easy_1",
  "title": "أولوية العمليات — خطأ — سهل",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">3 + 2² = 3 + 4</span>",
        "<span dir=\"ltr\">= 7</span>",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": -1,
      "explanation": "صحيح! القوة أولا ثم الجمع"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">3 + 2² = 5²</span>",
        "<span dir=\"ltr\">= 25</span>",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القوة أولا: <span dir=\"ltr\">3+4=7</span> وليس <span dir=\"ltr\">(3+2)²=25</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">5 × 2³ = 5 × 8</span>",
        "<span dir=\"ltr\">= 40</span>",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": -1,
      "explanation": "صحيح!"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2 + 3 × 4 = 20</span>",
        "<span dir=\"ltr\">= 2 + 12 = 14</span>",
        "الصحيح 14"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "الضرب قبل الجمع: <span dir=\"ltr\">2+3×4=2+12=14</span> وليس 20"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">10 - 3² = 10 - 9</span>",
        "<span dir=\"ltr\">= 1</span>",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": -1,
      "explanation": "صحيح!"
    }
  ]
};
window.quizData = quizData;
