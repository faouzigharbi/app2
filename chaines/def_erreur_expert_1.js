const quizData = {
  "id": "def_erreur_expert_1",
  "title": "تعريف القوة — اكتشف الخطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "3<sup>5</sup> = 3×81 = 243",
        "3<sup>6</sup> = 3×243 = 729",
        "3<sup>7</sup> = 3×729 = 2197"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "3×729 = 2187 وليس 2197"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "4<sup>3</sup> = (2<sup>2</sup>)<sup>3</sup> = 2<sup>6</sup>",
        "2<sup>6</sup> = 64",
        "4×4×4 = 4×16 = 60"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "4×16 = 64 وليس 60"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "8<sup>2</sup>+6<sup>2</sup> = 64+36 = 100",
        "100 = 10<sup>2</sup>",
        "إذن (8+6)<sup>2</sup> = 10<sup>2</sup> = 100"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "(8+6)<sup>2</sup> = 14<sup>2</sup> = 196 ≠ 100"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "15<sup>2</sup> = 15×15",
        "= 150+75",
        "= 225"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": -1,
      "explanation": "صحيح! 15<sup>2</sup> = 225 ✓"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "99<sup>2</sup> = (100-1)<sup>2</sup> = 100<sup>2</sup>-1<sup>2</sup>",
        "= 10000-1 = 9999",
        "لكن 99×99 = 9801"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القوة لا توزّع على الفرق!"
    }
  ]
};
window.quizData = quizData;
