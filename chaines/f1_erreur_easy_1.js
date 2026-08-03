const quizData = {
  "id": "f1_erreur_easy_1",
  "title": "a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup> — خطأ — سهل",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "5<sup>3</sup>×5<sup>2</sup> = 5<sup>3×2</sup>",
        "= 5<sup>6</sup>",
        "= 15625"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "نجمع الأدلة! 5<sup>3+2</sup>=5<sup>5</sup>=3125"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2<sup>3</sup>×2<sup>5</sup> = 2<sup>8</sup>",
        "= 256",
        "تحقق: 8×32 = 256 ✓"
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
        "3<sup>2</sup>×3<sup>4</sup> = 3<sup>6</sup>",
        "= 729",
        "تحقق: 9×81 = 729 ✓"
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
        "4<sup>2</sup>×4<sup>3</sup> = 4<sup>5</sup>",
        "4<sup>5</sup> = 1024",
        "تحقق: 16×64 = 1024 ✓"
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
        "7<sup>1</sup>×7<sup>1</sup> = 7<sup>1×1</sup>",
        "= 7<sup>1</sup>",
        "= 7"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "نجمع! 7<sup>1+1</sup>=7<sup>2</sup>=49"
    }
  ]
};
window.quizData = quizData;
