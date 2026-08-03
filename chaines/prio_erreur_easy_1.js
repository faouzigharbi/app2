const quizData = {
  "id": "prio_erreur_easy_1",
  "title": "أولوية العمليات — خطأ — سهل",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "3 + 2² = 3 + 4",
        "= 7",
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
        "3 + 2² = 5²",
        "= 25",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القوة أولا: 3+4=7 وليس (3+2)²=25"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "5 × 2³ = 5 × 8",
        "= 40",
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
        "2 + 3 × 4 = 20",
        "= 2 + 12 = 14",
        "الصحيح 14"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "الضرب قبل الجمع: 2+3×4=2+12=14 وليس 20"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "10 - 3² = 10 - 9",
        "= 1",
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
