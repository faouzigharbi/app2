const quizData = {
  "id": "f3_erreur_expert_1",
  "title": "(a<sup>n</sup>)<sup>p</sup>=a<sup>n×p</sup> — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "((2²)³)² = 2<sup>2×3×2</sup>",
        "= 2¹²",
        "= 4096"
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
        "(3²)⁴ = 3⁸",
        "= 6561",
        "81⁴ = 6561... "
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "81⁴ = 43046721 ≠ 6561. لكن 3⁸=6561. L2 dit 81⁴ pas (3²)⁴"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(2⁵)³ = 2¹⁵",
        "= 32768",
        "32³ = 32768 ✓"
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
        "(a²)³ = a<sup>2+3</sup>",
        "= a⁵",
        "مثال: (2²)³=2⁵=32"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "(a²)³=a<sup>2×3</sup>=a⁶"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(10¹)ⁿ = 10ⁿ",
        "مثال: (10¹)⁵=10⁵",
        "= 100000 ✓"
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
