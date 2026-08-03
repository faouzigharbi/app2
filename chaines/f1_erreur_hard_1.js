const quizData = {
  "id": "f1_erreur_hard_1",
  "title": "<span dir=\"ltr\">a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup></span> — خطأ — صعب",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2<sup>3</sup>+2<sup>4</sup> = 2<sup>7</sup></span>",
        "<span dir=\"ltr\">= 128</span>",
        "<span dir=\"ltr\">8+16 = 128</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القاعدة للجداء × وليس الجمع! <span dir=\"ltr\">8+16=24</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">3<sup>2</sup>×3<sup>3</sup>×3<sup>2</sup> = 3<sup>7</sup></span>",
        "<span dir=\"ltr\">= 2187</span>",
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
        "<span dir=\"ltr\">5<sup>n</sup>×5<sup>3</sup> = 5<sup>n+3</sup></span>",
        "إذا النتيجة <span dir=\"ltr\">5<sup>7</sup>: n+3=7</span>",
        "<span dir=\"ltr\">n = 3</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">n+3=7</span> → <span dir=\"ltr\">n=4</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2<sup>3</sup>×2<sup>4</sup>×2<sup>5</sup> = 2<sup>12</sup></span>",
        "<span dir=\"ltr\">= 4096</span>",
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
        "<span dir=\"ltr\">3<sup>n</sup>×3<sup>n</sup> = 3<sup>n²</sup></span>",
        "مثال: <span dir=\"ltr\">3²×3²=3⁴</span>",
        "<span dir=\"ltr\">n=2: 2²=4</span> ✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "<span dir=\"ltr\">3<sup>n</sup>×3<sup>n</sup>=3<sup>2n</sup></span> وليس <span dir=\"ltr\">3<sup>n²</sup></span>!"
    }
  ]
};
window.quizData = quizData;
