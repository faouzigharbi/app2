const quizData = {
  "id": "def_erreur_hard_1",
  "title": "تعريف القوة — اكتشف الخطأ — صعب",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "5<sup>4</sup> = 25 × 25",
        "25 × 25 = 525",
        "إذن 5<sup>4</sup> = 525"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "25×25 = 625 وليس 525"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "11<sup>2</sup> = 111",
        "11 × 11 = 121",
        "إذن 11<sup>2</sup> = 121"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "11<sup>2</sup> = 121 وليس 111"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "9<sup>3</sup> = 9×9×9",
        "9×9 = 81",
        "81×9 = 819"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "81×9 = 729 وليس 819"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "2<sup>10</sup> = (2<sup>5</sup>)<sup>2</sup> = 32<sup>2</sup>",
        "32<sup>2</sup> = 1044",
        "إذن 2<sup>10</sup> = 1044"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "32<sup>2</sup> = 1024 وليس 1044"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "12<sup>2</sup> = (10+2)<sup>2</sup> = 10<sup>2</sup>+2<sup>2</sup>",
        "= 100+4 = 104",
        "لكن 12×12 = 144"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "القوة لا توزّع على الجمع!"
    }
  ]
};
window.quizData = quizData;
