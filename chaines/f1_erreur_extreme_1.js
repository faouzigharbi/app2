const quizData = {
  "id": "f1_erreur_extreme_1",
  "title": "a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup> — خطأ — متقدّم",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "125×25 = 5<sup>3</sup>×5<sup>2</sup> = 5<sup>5</sup>",
        "= 3125",
        "125×25 = 3025"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "125×25 = 3125 وليس 3025"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2<sup>n</sup>×2 = 2<sup>n+1</sup>",
        "كل قوة ضعف السابقة",
        "2<sup>10</sup>=2×512=1024 ✓"
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
        "9<sup>4</sup> = 3<sup>8</sup> = 81×81",
        "= 6561",
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
        "256×512 = 2<sup>8</sup>×2<sup>9</sup>",
        "= 2<sup>17</sup>",
        "= 130072"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "2<sup>17</sup> = 131072 وليس 130072"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "a<sup>1</sup>×a<sup>1</sup>×a<sup>1</sup> = a<sup>3</sup>",
        "a×a×a = a<sup>3</sup>",
        "a<sup>3</sup> = 3a"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "a<sup>3</sup>≠3a!"
    }
  ]
};
window.quizData = quizData;
