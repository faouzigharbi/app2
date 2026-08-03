const quizData = {
  "id": "prio_erreur_medium_1",
  "title": "أولوية العمليات — خطأ — متوسط",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2³ + 3² = 8 + 9",
        "= 17",
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
        "(2+3)² = 2² + 3²",
        "= 4 + 9 = 13",
        "لكن (2+3)²=25"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القوة لا توزّع على الجمع"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "4 × 2³ - 5 = 4 × 8 - 5",
        "= 32 - 5 = 27",
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
        "3² × 2 + 1 = 9 × 2 + 1",
        "= 18 + 1 = 19",
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
        "2 × 3² = 6²",
        "= 36",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القوة قبل الضرب: 2×3²=2×9=18 وليس (2×3)²=36"
    }
  ]
};
window.quizData = quizData;
