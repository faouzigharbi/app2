const quizData = {
  "id": "f2_erreur_medium_1",
  "title": "a<sup>n</sup>×b<sup>n</sup>=(ab)<sup>n</sup> — خطأ — متوسط",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "5²×3² = (5×3)<sup>2×2</sup>",
        "= 15⁴",
        "= 50625"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "الدليل لا يتغير! (5×3)²=15²=225"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "4⁵×25⁵ = (4×25)⁵",
        "= 100⁵",
        "= 10 000 000 000"
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
        "2ⁿ×3ⁿ = 6ⁿ",
        "لأن (2×3)ⁿ=6ⁿ",
        "تحقق n=4: 16×81=1296=6⁴ ✓"
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
        "7²×3² = (7+3)² = 10²",
        "= 100",
        "لكن 49×9 = 441"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "نضرب! (7×3)²=21²=441"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "3³×2³ = (3×2)³ = 6³",
        "= 216",
        "27×8 = 216 ✓"
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
