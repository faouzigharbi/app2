const exerciceData = {
  "id": "def_chaine_hard_1",
  "title": "تعريف القوة — سلسلة — صعب",
  "questions": [
    {
      "operation": "بيّن أن 2<sup>10</sup> = 1024",
      "steps": [
        "2<sup>10</sup> = (2<sup>5</sup>)<sup>2</sup>",
        "2<sup>5</sup> = 32",
        "32<sup>2</sup> = 32×32",
        "= 960+64",
        "= 1024"
      ],
      "hint": "استعمل (2<sup>5</sup>)<sup>2</sup>"
    },
    {
      "operation": "قارن 3<sup>4</sup> و 4<sup>3</sup>",
      "steps": [
        "3<sup>4</sup> = 81",
        "4<sup>3</sup> = 64",
        "81 > 64",
        "إذن 3<sup>4</sup> > 4<sup>3</sup>"
      ],
      "hint": "احسب"
    },
    {
      "operation": "أوجد n: 3<sup>n</sup> = 729",
      "steps": [
        "729÷3=243, 243÷3=81",
        "81÷3=27, 27÷3=9",
        "9÷3=3, 3÷3=1",
        "قسمنا 6 مرات → n = 6"
      ],
      "hint": "قسّم على 3"
    }
  ]
};
window.exerciceData = exerciceData;
