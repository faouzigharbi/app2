const quizData = {
  "id": "f3_erreur_expert_1",
  "title": "<span dir=\"ltr\">(a<sup>n</sup>)<sup>p</sup>=a<sup>n×p</sup></span> — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">((2²)³)² = 2<sup>2×3×2</sup></span>",
        "<span dir=\"ltr\">= 2¹²</span>",
        "<span dir=\"ltr\">= 4096</span>"
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
        "<span dir=\"ltr\">(3²)⁴ = 3⁸</span>",
        "<span dir=\"ltr\">= 6561</span>",
        "<span dir=\"ltr\">81⁴ = 6561</span>... "
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">81⁴ = 43046721</span> ≠ 6561. لكن <span dir=\"ltr\">3⁸=6561. L2 dit 81⁴ pas (3²)⁴</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">(2⁵)³ = 2¹⁵</span>",
        "<span dir=\"ltr\">= 32768</span>",
        "<span dir=\"ltr\">32³ = 32768</span> ✓"
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
        "<span dir=\"ltr\">(a²)³ = a<sup>2+3</sup></span>",
        "= a⁵",
        "مثال: <span dir=\"ltr\">(2²)³=2⁵=32</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "<span dir=\"ltr\">(a²)³=a<sup>2×3</sup>=a⁶</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(10¹)ⁿ <span dir=\"ltr\">= 10</span>ⁿ",
        "مثال: <span dir=\"ltr\">(10¹)⁵=10⁵</span>",
        "<span dir=\"ltr\">= 100000</span> ✓"
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
