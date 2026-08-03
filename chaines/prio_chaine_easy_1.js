const exerciceData = {
  "id": "prio_chaine_easy_1",
  "title": "أولوية العمليات — سلسلة — سهل",
  "questions": [
    {
      "operation": "احسب: 3+2²×4",
      "steps": [
        "القوة أولا: 2²=4",
        "ثم الضرب: 4×4=16",
        "ثم الجمع: 3+16",
        "= 19"
      ],
      "hint": "القوة ← الضرب ← الجمع"
    },
    {
      "operation": "احسب: 10-2³",
      "steps": [
        "2³=8",
        "10-8",
        "= 2"
      ],
      "hint": "القوة أولا"
    },
    {
      "operation": "احسب: 5×3²",
      "steps": [
        "3²=9",
        "5×9",
        "= 45"
      ],
      "hint": "القوة ثم الضرب"
    },
    {
      "operation": "احسب: 2³+3²",
      "steps": [
        "2³=8",
        "3²=9",
        "8+9=17"
      ],
      "hint": "كل قوة على حدة"
    }
  ]
};
window.exerciceData = exerciceData;
