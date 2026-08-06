const quizData = {
  "id": "def_erreur_expert_1",
  "title": "تعريف القوة — اكتشف الخطأ — خبير",
  "questions": [
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">3<sup>5</sup> = 3×81 = 243</span>",
        "<span dir=\"ltr\">3<sup>6</sup> = 3×243 = 729</span>",
        "<span dir=\"ltr\">3<sup>7</sup> = 3×729 = 2197</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">3×729 = 2187</span> وليس 2197"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">4<sup>3</sup> = (2<sup>2</sup>)<sup>3</sup> = 2<sup>6</sup></span>",
        "<span dir=\"ltr\">2<sup>6</sup> = 64</span>",
        "<span dir=\"ltr\">4×4×4 = 4×16 = 60</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">4×16 = 64</span> وليس 60"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">8<sup>2</sup>+6<sup>2</sup> = 64+36 = 100</span>",
        "<span dir=\"ltr\">100 = 10<sup>2</sup></span>",
        "إذن <span dir=\"ltr\">(8+6)<sup>2</sup> = 10<sup>2</sup> = 100</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": 2,
      "explanation": "<span dir=\"ltr\">(8+6)<sup>2</sup> = 14<sup>2</sup> = 196</span> ≠ 100"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">15<sup>2</sup> = 15×15</span>",
        "<span dir=\"ltr\">= 150+75</span>",
        "<span dir=\"ltr\">= 225</span>"
      ],
      "options": [
        "L1",
        "L2",
        "L3"
      ],
      "correct": -1,
      "explanation": "صحيح! <span dir=\"ltr\">15<sup>2</sup> = 225</span> ✓"
    },
    {
      "prompt": "حدد السطر الخاطئ:",
      "steps": [
        "<span dir=\"ltr\">99<sup>2</sup> = (100-1)<sup>2</sup> = 100<sup>2</sup>-1<sup>2</sup></span>",
        "<span dir=\"ltr\">= 10000-1 = 9999</span>",
        "لكن <span dir=\"ltr\">99×99 = 9801</span>"
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
