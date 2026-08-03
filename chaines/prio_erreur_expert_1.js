const quizData = {
  "id": "prio_erreur_expert_1",
  "title": "أولوية العمليات — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2⁴ + 2³ = 2⁷</span>",
        "<span dir=\"ltr\">= 128</span>",
        "✓"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "لا نجمع الأدلة عند الجمع! <span dir=\"ltr\">16+8=24</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">(2+3)³ = 5³ = 125</span>",
        "<span dir=\"ltr\">2³+3³ = 8+27 = 35</span>",
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
        "<span dir=\"ltr\">3×(2²+1) = 3×(4+1)</span>",
        "<span dir=\"ltr\">= 3×5</span>",
        "<span dir=\"ltr\">= 15</span> ✓"
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
        "<span dir=\"ltr\">2³×3² = (2×3)<sup>3+2</sup></span>",
        "<span dir=\"ltr\">= 6⁵</span>",
        "<span dir=\"ltr\">= 7776</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "أساسان وأدلة مختلفة! <span dir=\"ltr\">2³×3²=8×9=72</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">5²+2×3²-4 = 25+18-4</span>",
        "<span dir=\"ltr\">= 39</span>",
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
