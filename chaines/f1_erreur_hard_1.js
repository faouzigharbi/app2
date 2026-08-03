const quizData = {
  "id": "f1_erreur_hard_1",
  "title": "a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup> — خطأ — صعب",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2<sup>3</sup>+2<sup>4</sup> = 2<sup>7</sup>",
        "= 128",
        "8+16 = 128"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القاعدة للجداء × وليس الجمع! 8+16=24"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "3<sup>2</sup>×3<sup>3</sup>×3<sup>2</sup> = 3<sup>7</sup>",
        "= 2187",
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
        "5<sup>n</sup>×5<sup>3</sup> = 5<sup>n+3</sup>",
        "إذا النتيجة 5<sup>7</sup>: n+3=7",
        "n = 3"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "n+3=7 → n=4"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2<sup>3</sup>×2<sup>4</sup>×2<sup>5</sup> = 2<sup>12</sup>",
        "= 4096",
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
        "3<sup>n</sup>×3<sup>n</sup> = 3<sup>n²</sup>",
        "مثال: 3²×3²=3⁴",
        "n=2: 2²=4 ✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "3<sup>n</sup>×3<sup>n</sup>=3<sup>2n</sup> وليس 3<sup>n²</sup>!"
    }
  ]
};
window.quizData = quizData;
