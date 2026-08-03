const quizData = {
  "id": "def_erreur_medium_1",
  "title": "تعريف القوة — اكتشف الخطأ — متوسط",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "7<sup>3</sup> = 7×7×7 = 49×7",
        "49 × 7 = 353",
        "إذن 7<sup>3</sup> = 353"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "49×7 = 343 وليس 353"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "6<sup>2</sup> = 36",
        "6<sup>4</sup> = 6<sup>2</sup> + 6<sup>2</sup> = 72",
        "6<sup>4</sup> = 72"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "6<sup>4</sup> ≠ 6<sup>2</sup>+6<sup>2</sup>. القوة ليست جمعا. 6<sup>4</sup> = 1296"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "1<sup>100</sup> = 1",
        "0<sup>5</sup> = 0",
        "0<sup>0</sup> = 0"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "0<sup>0</sup> غير معرّف"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2<sup>5</sup> = 2×2×2×2×2 = 32",
        "2<sup>6</sup> = 32 × 2",
        "2<sup>6</sup> = 62"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "32×2 = 64 وليس 62"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "3<sup>4</sup> = 3×3×3×3 = 81",
        "3<sup>4</sup> = 12",
        "القوة تعني الضرب المتكرّر"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "3<sup>4</sup> = 81 وليس 12. ربما الخلط مع 3×4"
    }
  ]
};
window.quizData = quizData;
