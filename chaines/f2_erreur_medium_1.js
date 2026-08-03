const quizData = {
  "id": "f2_erreur_medium_1",
  "title": "<span dir=\"ltr\">a<sup>n</sup>×b<sup>n</sup>=(ab)<sup>n</sup></span> — خطأ — متوسط",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">5²×3² = (5×3)<sup>2×2</sup></span>",
        "<span dir=\"ltr\">= 15⁴</span>",
        "<span dir=\"ltr\">= 50625</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "الدليل لا يتغير! <span dir=\"ltr\">(5×3)²=15²=225</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">4⁵×25⁵ = (4×25)⁵</span>",
        "<span dir=\"ltr\">= 100⁵</span>",
        "<span dir=\"ltr\">= 10 000 000 000</span>"
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
        "2ⁿ<span dir=\"ltr\">×3</span>ⁿ <span dir=\"ltr\">= 6</span>ⁿ",
        "لأن <span dir=\"ltr\">(2×3)</span>ⁿ<span dir=\"ltr\">=6</span>ⁿ",
        "تحقق <span dir=\"ltr\">n=4: 16×81=1296=6⁴</span> ✓"
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
        "<span dir=\"ltr\">7²×3² = (7+3)² = 10²</span>",
        "<span dir=\"ltr\">= 100</span>",
        "لكن <span dir=\"ltr\">49×9 = 441</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "نضرب! <span dir=\"ltr\">(7×3)²=21²=441</span>"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">3³×2³ = (3×2)³ = 6³</span>",
        "<span dir=\"ltr\">= 216</span>",
        "<span dir=\"ltr\">27×8 = 216</span> ✓"
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
