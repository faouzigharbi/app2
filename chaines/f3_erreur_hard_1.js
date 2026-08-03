const quizData = {
  "id": "f3_erreur_hard_1",
  "title": "<span dir=\"ltr\">(a<sup>n</sup>)<sup>p</sup>=a<sup>n×p</sup></span> — خطأ — صعب",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">(2³)⁴ = 2<sup>3×4</sup> = 2¹²</span>",
        "<span dir=\"ltr\">= 4096</span>",
        "<span dir=\"ltr\">(2³)⁴ = 8⁴ = 4096</span> ✓"
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
        "<span dir=\"ltr\">(3²)³ × 3 = 3⁶ × 3 = 3⁷</span>",
        "<span dir=\"ltr\">= 2187</span>",
        "<span dir=\"ltr\">27³×3 = 19683×3</span>... "
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">27³=19683</span> لكن <span dir=\"ltr\">(3²)³=3⁶=729. 729×3=2187</span> ✓"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">(5²)³ = 5⁵</span>",
        "<span dir=\"ltr\">= 3125</span>",
        "لكن <span dir=\"ltr\">25³=15625</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "<span dir=\"ltr\">(5²)³=5<sup>2×3</sup>=5⁶=15625</span> وليس 5⁵"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">(4³)² = 4⁶ = 4096</span>",
        "<span dir=\"ltr\">(2⁶)² = 2¹² = {2**12}</span>",
        "<span dir=\"ltr\">4⁶ = 2¹²</span> ✓"
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
        "<span dir=\"ltr\">(10²)⁴ = 10⁶</span>",
        "<span dir=\"ltr\">= 1 000 000</span>",
        "أي مليون"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "<span dir=\"ltr\">(10²)⁴=10<sup>2×4</sup>=10⁸=100000000</span>"
    }
  ]
};
window.quizData = quizData;
