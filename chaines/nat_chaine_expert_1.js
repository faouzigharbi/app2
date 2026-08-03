const exerciceData = {
  "id": "nat_chaine_expert_1",
  "title": "أولوية العمليات في ℕ — سلسلة — خبير",
  "questions": [
    {
      "operation": "احسب: <span dir=\"ltr\">M = 8 × [16 - (8 + 4)]</span>",
      "steps": [
        "نحدّد الأولوية: القوس الداخلي أولا",
        "القوس الداخلي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(8 + 4) = 12</span>",
        "القوس الخارجي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[16 - 12] = 4</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">8 × 4</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 32</span>"
      ],
      "hint": "من الداخل إلى الخارج"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">N = [18 - (8 - 2)] × 3</span>",
      "steps": [
        "نحدّد الأولوية: القوس الداخلي أولا",
        "القوس الداخلي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(8 - 2) = 6</span>",
        "القوس الخارجي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[18 - 6] = 12</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">12 × 3</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 36</span>"
      ],
      "hint": "أفرغ القوس الداخلي قبل الخارجي"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">J = 5 × [17 - (13 + 2)]</span>",
      "steps": [
        "نحدّد الأولوية: القوس الداخلي أولا",
        "القوس الداخلي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(13 + 2) = 15</span>",
        "القوس الخارجي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[17 - 15] = 2</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × 2</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 10</span>"
      ],
      "hint": "النتيجة داخل القوس صغيرة، وهذا عادي"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">P = (30 - 29) × [40 - (15 - 5)]</span>",
      "steps": [
        "نحدّد الأولوية: الأقواس أولا",
        "القوس الأول: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(30 - 29) = 1</span>",
        "القوس الداخلي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(15 - 5) = 10</span>",
        "القوس الخارجي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[40 - 10] = 30</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">1 × 30</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 30</span>"
      ],
      "hint": "الضرب في 1 لا يغيّر العدد"
    },
    {
      "operation": "احسب: <span dir=\"ltr\">S = 5 × [(3 + 4) - (8 - 6)]</span>",
      "steps": [
        "نحدّد الأولوية: القوسان الداخليان أولا",
        "القوسان الداخليان: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(3 + 4) = 7</span> و <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">(8 - 6) = 2</span>",
        "القوس الخارجي: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">[7 - 2] = 5</span>",
        "ننجز الضرب: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">5 × 5</span>",
        "النتيجة: <span dir=\"ltr\" style=\"display:inline-block;white-space:nowrap\">= 25</span>"
      ],
      "hint": "قوسان داخليان في نفس المستوى"
    }
  ]
};
window.exerciceData = exerciceData;
