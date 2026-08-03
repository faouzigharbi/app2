const quizData = {
  "id": "f3_erreur_medium_1",
  "title": "(a<sup>n</sup>)<sup>p</sup>=a<sup>n×p</sup> — خطأ — متوسط",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(2⁴)³ = 2<sup>4×3</sup> = 2¹²",
        "= 4096",
        "تحقق: 16³=4096 ✓"
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
        "(3³)² = 3<sup>3+2</sup>",
        "= 3⁵",
        "= 243"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "نضرب! 3<sup>3×2</sup>=3⁶=729"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(5¹)⁴ = 5<sup>1×4</sup>",
        "= 5⁴",
        "= 625"
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
        "(2²)⁴ = 2⁸",
        "= 256",
        "16⁴ = 256"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "16⁴ = 65536 ≠ 256. لكن 2⁸=256 صحيح."
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(10³)² = 10⁶",
        "= 1 000 000",
        "أي مليون ✓"
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
