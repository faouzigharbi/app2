const quizData = {
  "id": "prio_erreur_expert_1",
  "title": "أولوية العمليات — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2⁴ + 2³ = 2⁷",
        "= 128",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "لا نجمع الأدلة عند الجمع! 16+8=24"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "(2+3)³ = 5³ = 125",
        "2³+3³ = 8+27 = 35",
        "125 ≠ 35 إذن القوة لا توزّع ✓"
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
        "3×(2²+1) = 3×(4+1)",
        "= 3×5",
        "= 15 ✓"
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
        "2³×3² = (2×3)<sup>3+2</sup>",
        "= 6⁵",
        "= 7776"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "أساسان وأدلة مختلفة! 2³×3²=8×9=72"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "5²+2×3²-4 = 25+18-4",
        "= 39",
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
