const quizData = {
  "id": "f2_erreur_expert_1",
  "title": "<span dir=\"ltr\">a<sup>n</sup>×b<sup>n</sup>=(ab)<sup>n</sup></span> — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">4³×25³ = 100³</span>",
        "<span dir=\"ltr\">= 100 000</span>",
        "لكن <span dir=\"ltr\">64×15625=1000000</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "<span dir=\"ltr\">100³=1000000</span> وليس 100000"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">14² = (2×7)² = 2²×7²</span>",
        "<span dir=\"ltr\">= 4×49</span>",
        "<span dir=\"ltr\">= 196</span> ✓"
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
        "<span dir=\"ltr\">50³ = 5³×10³</span>",
        "<span dir=\"ltr\">= 125×1000</span>",
        "<span dir=\"ltr\">= 12500</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">125×1000=125000</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2¹⁰×5¹⁰ = 10¹⁰</span>",
        "<span dir=\"ltr\">= 10 milliards</span>",
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
        "<span dir=\"ltr\">6² = (2×3)² = 2²+3²</span>",
        "<span dir=\"ltr\">= 4+9 = 13</span>",
        "لكن <span dir=\"ltr\">6²=36</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القاعدة: (ab)²=a²×b² وليس a²+b²"
    }
  ]
};
window.quizData = quizData;
