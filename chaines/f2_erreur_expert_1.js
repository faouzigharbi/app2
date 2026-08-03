const quizData = {
  "id": "f2_erreur_expert_1",
  "title": "a<sup>n</sup>×b<sup>n</sup>=(ab)<sup>n</sup> — خطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "4³×25³ = 100³",
        "= 100 000",
        "لكن 64×15625=1000000"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "100³=1000000 وليس 100000"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "14² = (2×7)² = 2²×7²",
        "= 4×49",
        "= 196 ✓"
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
        "50³ = 5³×10³",
        "= 125×1000",
        "= 12500"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "125×1000=125000"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2¹⁰×5¹⁰ = 10¹⁰",
        "= 10 milliards",
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
        "6² = (2×3)² = 2²+3²",
        "= 4+9 = 13",
        "لكن 6²=36"
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
