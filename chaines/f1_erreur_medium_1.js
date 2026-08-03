const quizData = {
  "id": "f1_erreur_medium_1",
  "title": "a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup> — خطأ — متوسط",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2<sup>4</sup>×3<sup>2</sup> = 6<sup>6</sup>",
        "= 46656",
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
        "10<sup>3</sup>×10<sup>4</sup> = 10<sup>7</sup>",
        "10<sup>7</sup> = 1 000 000",
        "أي مليون"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "10<sup>7</sup> = 10 000 000 (7 أصفار)"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "6<sup>2</sup>×6<sup>3</sup> = 6<sup>2×3</sup>",
        "= 6<sup>6</sup>",
        "= 46656"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "نجمع! 6<sup>2+3</sup>=6<sup>5</sup>=7776"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "5<sup>2</sup>×5<sup>0</sup> = 5<sup>2</sup>",
        "= 25",
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
        "a<sup>3</sup>×a<sup>7</sup> = a<sup>10</sup>",
        "= 10 أعداد",
        "a<sup>10</sup> = 10a"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "a<sup>10</sup> ≠ 10a!"
    }
  ]
};
window.quizData = quizData;
