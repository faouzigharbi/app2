const exerciceData = {
  "id": "def_chaine_hard_1",
  "title": "تعريف القوة — سلسلة — صعب",
  "questions": [
    {
      "operation": "بيّن أن <span dir=\"ltr\">2<sup>10</sup> = 1024</span>",
      "steps": [
        "<span dir=\"ltr\">2<sup>10</sup> = (2<sup>5</sup>)<sup>2</sup></span>",
        "<span dir=\"ltr\">2<sup>5</sup> = 32</span>",
        "<span dir=\"ltr\">32<sup>2</sup> = 32×32</span>",
        "<span dir=\"ltr\">= 960+64</span>",
        "<span dir=\"ltr\">= 1024</span>"
      ],
      "hint": "استعمل <span dir=\"ltr\">(2<sup>5</sup>)<sup>2</sup></span>"
    },
    {
      "operation": "قارن <span dir=\"ltr\">3<sup>4</sup></span> و <span dir=\"ltr\">4<sup>3</sup></span>",
      "steps": [
        "<span dir=\"ltr\">3<sup>4</sup> = 81</span>",
        "<span dir=\"ltr\">4<sup>3</sup> = 64</span>",
        "81 > 64",
        "إذن <span dir=\"ltr\">3<sup>4</sup></span> > <span dir=\"ltr\">4<sup>3</sup></span>"
      ],
      "hint": "احسب"
    },
    {
      "operation": "أوجد <span dir=\"ltr\">n: 3<sup>n</sup> = 729</span>",
      "steps": [
        "<span dir=\"ltr\">729÷3=243, 243÷3=81</span>",
        "<span dir=\"ltr\">81÷3=27, 27÷3=9</span>",
        "<span dir=\"ltr\">9÷3=3, 3÷3=1</span>",
        "قسمنا 6 مرات → <span dir=\"ltr\">n = 6</span>"
      ],
      "hint": "قسّم على 3"
    }
  ]
};
window.exerciceData = exerciceData;
