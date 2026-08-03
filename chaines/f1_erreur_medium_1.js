const quizData = {
  "id": "f1_erreur_medium_1",
  "title": "<span dir=\"ltr\">a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup></span> — خطأ — متوسط",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2<sup>4</sup>×3<sup>2</sup> = 6<sup>6</sup></span>",
        "<span dir=\"ltr\">= 46656</span>",
        "تحقق"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "أساسان مختلفان! لا يمكن تطبيق القاعدة"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">10<sup>3</sup>×10<sup>4</sup> = 10<sup>7</sup></span>",
        "<span dir=\"ltr\">10<sup>7</sup> = 1 000 000</span>",
        "أي مليون"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "<span dir=\"ltr\">10<sup>7</sup> = 10 000 000 (7</span> أصفار)"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">6<sup>2</sup>×6<sup>3</sup> = 6<sup>2×3</sup></span>",
        "<span dir=\"ltr\">= 6<sup>6</sup></span>",
        "<span dir=\"ltr\">= 46656</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "نجمع! <span dir=\"ltr\">6<sup>2+3</sup>=6<sup>5</sup>=7776</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">5<sup>2</sup>×5<sup>0</sup> = 5<sup>2</sup></span>",
        "<span dir=\"ltr\">= 25</span>",
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
        "<span dir=\"ltr\">a<sup>3</sup>×a<sup>7</sup> = a<sup>10</sup></span>",
        "<span dir=\"ltr\">= 10</span> أعداد",
        "<span dir=\"ltr\">a<sup>10</sup> = 10a</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">a<sup>10</sup></span> ≠ 10a!"
    }
  ]
};
window.quizData = quizData;
