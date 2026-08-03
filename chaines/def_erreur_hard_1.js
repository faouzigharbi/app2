const quizData = {
  "id": "def_erreur_hard_1",
  "title": "تعريف القوة — اكتشف الخطأ — صعب",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">5<sup>4</sup> = 25 × 25</span>",
        "<span dir=\"ltr\">25 × 25 = 525</span>",
        "إذن <span dir=\"ltr\">5<sup>4</sup> = 525</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "<span dir=\"ltr\">25×25 = 625</span> وليس 525"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">11<sup>2</sup> = 111</span>",
        "<span dir=\"ltr\">11 × 11 = 121</span>",
        "إذن <span dir=\"ltr\">11<sup>2</sup> = 121</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 0,
      "explanation": "<span dir=\"ltr\">11<sup>2</sup> = 121</span> وليس 111"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">9<sup>3</sup> = 9×9×9</span>",
        "<span dir=\"ltr\">9×9 = 81</span>",
        "<span dir=\"ltr\">81×9 = 819</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">81×9 = 729</span> وليس 819"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">2<sup>10</sup> = (2<sup>5</sup>)<sup>2</sup> = 32<sup>2</sup></span>",
        "<span dir=\"ltr\">32<sup>2</sup> = 1044</span>",
        "إذن <span dir=\"ltr\">2<sup>10</sup> = 1044</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 1,
      "explanation": "<span dir=\"ltr\">32<sup>2</sup> = 1024</span> وليس 1044"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">12<sup>2</sup> = (10+2)<sup>2</sup> = 10<sup>2</sup>+2<sup>2</sup></span>",
        "<span dir=\"ltr\">= 100+4 = 104</span>",
        "لكن <span dir=\"ltr\">12×12 = 144</span>"
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
