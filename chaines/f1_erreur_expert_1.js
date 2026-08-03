const quizData = {
  "id": "f1_erreur_expert_1",
  "title": "a<sup>n</sup>×a<sup>p</sup>=a<sup>n+p</sup> — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "8×32 = 2<sup>3</sup>×2<sup>5</sup> = 2<sup>8</sup>",
        "= 256",
        "8×32 = 256 ✓"
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
        "2<sup>5</sup>×4<sup>3</sup> = 2<sup>5</sup>×2<sup>6</sup>",
        "= 2<sup>11</sup>",
        "= 2048"
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
        "10<sup>3</sup>×10<sup>n</sup> = 10<sup>3+n</sup>",
        "النتيجة مليون: 3+n=6",
        "n = 2"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "n=3 وليس 2!"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "a×a×a = a<sup>3</sup>",
        "a<sup>3</sup> = 3a",
        "مثال: 2³=6"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "a<sup>3</sup>≠3a! مثلا 2<sup>3</sup>=8≠6"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "16×64 = 2<sup>4</sup>×2<sup>6</sup> = 2<sup>10</sup>",
        "= 1024",
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
