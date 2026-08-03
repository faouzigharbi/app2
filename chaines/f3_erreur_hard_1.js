const quizData = {
  "id": "f3_erreur_hard_1",
  "title": "(a<sup>n</sup>)<sup>p</sup>=a<sup>n×p</sup> — خطأ — صعب",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(2³)⁴ = 2<sup>3×4</sup> = 2¹²",
        "= 4096",
        "(2³)⁴ = 8⁴ = 4096 ✓"
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
        "(3²)³ × 3 = 3⁶ × 3 = 3⁷",
        "= 2187",
        "27³×3 = 19683×3... "
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "27³=19683 لكن (3²)³=3⁶=729. 729×3=2187 ✓"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(5²)³ = 5⁵",
        "= 3125",
        "لكن 25³=15625"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "(5²)³=5<sup>2×3</sup>=5⁶=15625 وليس 5⁵"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(4³)² = 4⁶ = 4096",
        "(2⁶)² = 2¹² = {2**12}",
        "4⁶ = 2¹² ✓"
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
        "(10²)⁴ = 10⁶",
        "= 1 000 000",
        "أي مليون"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "(10²)⁴=10<sup>2×4</sup>=10⁸=100000000"
    }
  ]
};
window.quizData = quizData;
