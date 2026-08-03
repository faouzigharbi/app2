const quizData = {
  "id": "f1_erreur_extreme_1",
  "title": "<span dir=\"ltr\">a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup></span> — خطأ — متقدّم",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">125×25 = 5<sup>3</sup>×5<sup>2</sup> = 5<sup>5</sup></span>",
        "<span dir=\"ltr\">= 3125</span>",
        "<span dir=\"ltr\">125×25 = 3025</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">125×25 = 3125</span> وليس 3025"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2<sup>n</sup>×2 = 2<sup>n+1</sup></span>",
        "كل قوة ضعف السابقة",
        "<span dir=\"ltr\">2<sup>10</sup>=2×512=1024</span> ✓"
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
        "<span dir=\"ltr\">9<sup>4</sup> = 3<sup>8</sup> = 81×81</span>",
        "<span dir=\"ltr\">= 6561</span>",
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
        "<span dir=\"ltr\">256×512 = 2<sup>8</sup>×2<sup>9</sup></span>",
        "<span dir=\"ltr\">= 2<sup>17</sup></span>",
        "<span dir=\"ltr\">= 130072</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">2<sup>17</sup> = 131072</span> وليس 130072"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">a<sup>1</sup>×a<sup>1</sup>×a<sup>1</sup> = a<sup>3</sup></span>",
        "<span dir=\"ltr\">a×a×a = a<sup>3</sup></span>",
        "<span dir=\"ltr\">a<sup>3</sup> = 3a</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">a<sup>3</sup></span>≠3a!"
    }
  ]
};
window.quizData = quizData;
