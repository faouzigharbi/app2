const quizData = {
  "id": "f1_erreur_expert_1",
  "title": "<span dir=\"ltr\">a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup></span> — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">8×32 = 2<sup>3</sup>×2<sup>5</sup> = 2<sup>8</sup></span>",
        "<span dir=\"ltr\">= 256</span>",
        "<span dir=\"ltr\">8×32 = 256</span> ✓"
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
        "<span dir=\"ltr\">2<sup>5</sup>×4<sup>3</sup> = 2<sup>5</sup>×2<sup>6</sup></span>",
        "<span dir=\"ltr\">= 2<sup>11</sup></span>",
        "<span dir=\"ltr\">= 2048</span>"
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
        "<span dir=\"ltr\">10<sup>3</sup>×10<sup>n</sup> = 10<sup>3+n</sup></span>",
        "النتيجة مليون: <span dir=\"ltr\">3+n=6</span>",
        "<span dir=\"ltr\">n = 2</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">n=3</span> وليس 2!"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">a×a×a = a<sup>3</sup></span>",
        "<span dir=\"ltr\">a<sup>3</sup> = 3a</span>",
        "مثال: <span dir=\"ltr\">2³=6</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "<span dir=\"ltr\">a<sup>3</sup></span>≠3a! مثلا <span dir=\"ltr\">2<sup>3</sup>=8</span>≠6"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">16×64 = 2<sup>4</sup>×2<sup>6</sup> = 2<sup>10</sup></span>",
        "<span dir=\"ltr\">= 1024</span>",
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
