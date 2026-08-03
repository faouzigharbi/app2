window.CENTRALE_EXERCICES = [
  {
    id: "9-QCM-0001",

    niveau: 9,
    chapitre: "تمارين متعددة الاختيارات",
    lecon: "مبرهنة طالس و الجذور المربعة و المساحات",

    source: "المدرسة الإعدادية ع فرحات برادس ـ فرض تأليفي عدد2 ـ الرياضيات ـ السنة الدراسية 2020-2021 ـ تاسعة أساسي : 1، 2، 3، 4، 6، 7 ـ ساعتان ـ يسمح باستعمال الآلة الحاسبة",
    page: 1,
    ordre: 1,

    type: "اختيار من متعدد",
    difficulte: null,
    points: null,

    enonce_ar: "تمرين عدد 1 ( 3 نقاط )\nيلي كل سؤال ثلاث إجابات احداها فقط صحيحة. أكتب على ورقة تحريرك رقم السؤال و الإجابة الصحيحة الموافقة له.\n1) إذا كانت M و N نقطتين من قطعة مستقيم [AB] حيث \\( \\dfrac{AM}{3} = \\dfrac{MB}{2} = NB \\) فإنَ :\nأ) \\( MB = \\dfrac{2}{5} AB \\)\nب) \\( MB = \\dfrac{1}{3} AB \\)\nج) \\( MB = \\dfrac{1}{2} AB \\)\n2) نعتبر العبارة \\( B = \\sqrt{b^{2} - b + \\dfrac{1}{4}} + \\dfrac{1}{2} \\) حيث b عدد حقيقي سالب فإنَ B تساوي :\nأ) \\( -b \\)\nب) \\( b + 1 \\)\nج) \\( 1 - b \\)\n3) في الشكل المقابل ABCD مربع و ABE مثلث متقايس الأضلاع قيس طول ارتفاعه يساوي 3. المساحة الملونة تساوي\nأ) \\( 12 - 3\\sqrt{3} \\)\nب) \\( 6\\sqrt{3} - 3 \\)\nج) \\( 9 - 2\\sqrt{3} \\)",

    latex: "\\dfrac{AM}{3} = \\dfrac{MB}{2} = NB \\quad ; \\quad MB = \\dfrac{2}{5} AB \\quad ; \\quad MB = \\dfrac{1}{3} AB \\quad ; \\quad MB = \\dfrac{1}{2} AB \\quad ; \\quad B = \\sqrt{b^{2} - b + \\dfrac{1}{4}} + \\dfrac{1}{2} \\quad ; \\quad -b \\quad ; \\quad b + 1 \\quad ; \\quad 1 - b \\quad ; \\quad 12 - 3\\sqrt{3} \\quad ; \\quad 6\\sqrt{3} - 3 \\quad ; \\quad 9 - 2\\sqrt{3}",

    reponse: [],

    indice: "",

    correction: "",

    figure: `(function (THREE, container) {
  var W = container.clientWidth || 420, H = container.clientHeight || 420;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  var s = 2 * Math.sqrt(3), h = 3, pad = 1.2;
  var camera = new THREE.OrthographicCamera(-pad, s + pad, s + pad, -pad, -100, 100);
  camera.position.set(0, 0, 10);
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);
  var A = new THREE.Vector3(0, 0, 0), B = new THREE.Vector3(s, 0, 0),
      C = new THREE.Vector3(s, s, 0), D = new THREE.Vector3(0, s, 0),
      E = new THREE.Vector3(s / 2, h, 0), P = new THREE.Vector3(s / 2, 0, 0);
  function fill(pts, color) {
    var sh = new THREE.Shape();
    sh.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) sh.lineTo(pts[i].x, pts[i].y);
    sh.closePath();
    var m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: color }));
    scene.add(m);
    return m;
  }
  function seg(a, b) {
    var g = new THREE.BufferGeometry().setFromPoints([a, b]);
    var l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x000000 }));
    l.position.z = 0.2;
    scene.add(l);
  }
  function dot(p) {
    var m = new THREE.Mesh(new THREE.CircleGeometry(0.07, 24), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    m.position.set(p.x, p.y, 0.3);
    scene.add(m);
  }
  function label(t, x, y) {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    var g = c.getContext('2d');
    g.font = 'bold 64px serif'; g.fillStyle = '#000';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(t, 64, 64);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true }));
    sp.position.set(x, y, 0.5);
    sp.scale.set(0.55, 0.55, 1);
    scene.add(sp);
  }
  fill([A, B, C, D], 0xd0d0d0);
  fill([A, B, E], 0xffffff);
  seg(A, B); seg(B, C); seg(C, D); seg(D, A);
  seg(A, E); seg(B, E); seg(E, P);
  var r = 0.22;
  seg(new THREE.Vector3(P.x, P.y + r, 0), new THREE.Vector3(P.x - r, P.y + r, 0));
  seg(new THREE.Vector3(P.x - r, P.y + r, 0), new THREE.Vector3(P.x - r, P.y, 0));
  dot(A); dot(B); dot(C); dot(D); dot(E);
  label('A', A.x - 0.35, A.y - 0.3);
  label('B', B.x + 0.35, B.y - 0.3);
  label('C', C.x + 0.35, C.y + 0.3);
  label('D', D.x - 0.35, D.y + 0.3);
  label('E', E.x, E.y + 0.4);
  label('3', P.x + 0.3, h / 2);
  renderer.render(scene, camera);
  return { scene: scene, camera: camera, renderer: renderer };
})`,

    competences: [
      "توظيف مبرهنة طالس و النسب في قطعة مستقيم",
      "تبسيط عبارة تحتوي على جذر مربع",
      "حساب مساحة مربع و مثلث متقايس الأضلاع"
    ],

    tags: ["طالس", "جذر مربع", "مساحة", "مربع", "مثلث متقايس الأضلاع", "اختيار من متعدد", "9 أساسي"]
  },
  {
    id: "9-CAL-0001",

    niveau: 9,
    chapitre: "الحساب على العبارات الجبرية",
    lecon: "التحليل و حل المعادلات و توظيفها في الهندسة",

    source: "المدرسة الإعدادية ع فرحات برادس ـ فرض تأليفي عدد2 ـ الرياضيات ـ السنة الدراسية 2020-2021 ـ تاسعة أساسي : 1، 2، 3، 4، 6، 7 ـ ساعتان ـ يسمح باستعمال الآلة الحاسبة",
    page: 1,
    ordre: 2,

    type: "تمرين",
    difficulte: null,
    points: null,

    enonce_ar: "تمرين عدد2 (4 نقاط )\nنعتبر العبارة : \\( E = 2x^{2} - \\dfrac{1}{2}x - \\dfrac{5}{2} \\) حيث \\( x \\in \\mathbb{R} \\).\n1) أ) بيّن أنَ : \\( E = \\dfrac{1}{2}\\left[\\left(2x - \\dfrac{1}{4}\\right)^{2} - \\dfrac{81}{16}\\right] \\)\nب) استنتج أنَ : \\( E = (x + 1)\\left(2x - \\dfrac{5}{2}\\right) \\)\nج) حل في \\( \\mathbb{R} \\) المعادلة \\( E = 0 \\)\n2) في الرسم المقابل نصف دائرة \\( \\xi \\) قطرها [AB] و \\( D \\in \\xi \\) و C المسقط العمودي لـ D على [AB] حيث \\( DC = \\alpha \\) و \\( AC = \\alpha - 1 \\) و \\( BC = 3\\alpha + \\dfrac{5}{2} \\) حيث \\( \\alpha > 1 \\)\nأ) بيّن أنَ : \\( 2\\alpha^{2} - \\dfrac{1}{2}\\alpha - \\dfrac{5}{2} = 0 \\)\nب) بيّن أنَ شعاع نصف الدائرة \\( \\xi \\) يساوي \\( \\dfrac{13}{4} \\)",

    latex: "E = 2x^{2} - \\dfrac{1}{2}x - \\dfrac{5}{2} \\quad ; \\quad x \\in \\mathbb{R} \\quad ; \\quad E = \\dfrac{1}{2}\\left[\\left(2x - \\dfrac{1}{4}\\right)^{2} - \\dfrac{81}{16}\\right] \\quad ; \\quad E = (x + 1)\\left(2x - \\dfrac{5}{2}\\right) \\quad ; \\quad E = 0 \\quad ; \\quad D \\in \\xi \\quad ; \\quad DC = \\alpha \\quad ; \\quad AC = \\alpha - 1 \\quad ; \\quad BC = 3\\alpha + \\dfrac{5}{2} \\quad ; \\quad \\alpha > 1 \\quad ; \\quad 2\\alpha^{2} - \\dfrac{1}{2}\\alpha - \\dfrac{5}{2} = 0 \\quad ; \\quad \\dfrac{13}{4}",

    reponse: [],

    indice: "",

    correction: "",

    figure: `(function (THREE, container) {
  var W = container.clientWidth || 520, H = container.clientHeight || 320;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  var R = 13 / 4, cx = R, pad = 0.9;
  var camera = new THREE.OrthographicCamera(-pad, 2 * R + pad, 1.0, -(R + pad), -100, 100);
  camera.position.set(0, 0, 10);
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);
  var A = new THREE.Vector3(0, 0, 0), B = new THREE.Vector3(2 * R, 0, 0),
      C = new THREE.Vector3(0.25, 0, 0), D = new THREE.Vector3(0.25, -1.25, 0);
  function seg(a, b) {
    var g = new THREE.BufferGeometry().setFromPoints([a, b]);
    scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x000000 })));
  }
  function arc() {
    var pts = [];
    for (var i = 0; i <= 180; i++) {
      var t = Math.PI + (i / 180) * Math.PI;
      pts.push(new THREE.Vector3(cx + R * Math.cos(t), R * Math.sin(t), 0));
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x000000 })));
  }
  function label(t, x, y, sz) {
    var c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    var g = c.getContext('2d');
    g.font = 'bold 56px serif'; g.fillStyle = '#000';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(t, 128, 64);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true }));
    sp.position.set(x, y, 0.5);
    sp.scale.set(sz || 1.1, (sz || 1.1) / 2, 1);
    scene.add(sp);
  }
  arc();
  seg(A, B); seg(C, D); seg(A, D); seg(D, B);
  var r = 0.16;
  seg(new THREE.Vector3(C.x, C.y - r, 0), new THREE.Vector3(C.x + r, C.y - r, 0));
  seg(new THREE.Vector3(C.x + r, C.y - r, 0), new THREE.Vector3(C.x + r, C.y, 0));
  label('A', A.x - 0.3, 0.25, 0.7);
  label('B', B.x + 0.3, 0.25, 0.7);
  label('C', C.x + 0.15, 0.28, 0.7);
  label('D', D.x - 0.3, D.y - 0.2, 0.7);
  label('a - 1', (A.x + C.x) / 2, 0.32, 1.0);
  label('3a + 5/2', (C.x + B.x) / 2, 0.32, 1.6);
  label('a', C.x + 0.28, D.y / 2, 0.6);
  label('ξ', 2 * R - 0.75, -R + 0.55, 0.6);
  renderer.render(scene, camera);
  return { scene: scene, camera: camera, renderer: renderer };
})`,

    competences: [
      "تحليل عبارة جبرية إلى جداء عوامل",
      "حل معادلة من الدرجة الثانية بالتحليل",
      "توظيف العلاقات المترية في مثلث قائم الزاوية",
      "استعمال خاصية المثلث المرسوم داخل نصف دائرة"
    ],

    tags: ["نشر", "تحليل", "معادلة", "نصف دائرة", "مسقط عمودي", "شعاع", "9 أساسي"]
  },
  {
    id: "9-CAL-0002",

    niveau: 9,
    chapitre: "الحساب على العبارات الجبرية",
    lecon: "الجذور المربعة و المقارنة و النشر و التحليل و المعادلات",

    source: "المدرسة الإعدادية ع فرحات برادس ـ فرض تأليفي عدد2 ـ الرياضيات ـ السنة الدراسية 2020-2021 ـ تاسعة أساسي : 1، 2، 3، 4، 6، 7 ـ ساعتان ـ يسمح باستعمال الآلة الحاسبة",
    page: 2,
    ordre: 3,

    type: "تمرين",
    difficulte: null,
    points: null,

    enonce_ar: "تمرين 3 (6 نقاط )\nI) نعتبر العددين \\( a = 2 + \\sqrt{3} \\) و \\( b = \\sqrt{13} \\)\n1) بيّن أنَ : \\( a^{2} - b^{2} = 4\\sqrt{3} - 6 \\)\n2) أ) قارن العددان \\( 4\\sqrt{3} \\) و 6 ثمَ استنتج مقارنة العددين a و b.\nب) بيّن أنَ \\( 1 + \\sqrt{3} < \\sqrt{13} - 1 \\)\nII) لتكن العبارتين التاليتين : \\( A = 3x^{2} - x - 2 \\) و \\( B = 2x^{2} + x + 1 + 2\\sqrt{3} \\) حيث \\( x \\in \\mathbb{R} \\)\n1) جد القيمة العددية للعبارة A إذا كان \\( x = -\\dfrac{2}{3} \\)\n2) أ) بيّن أنَ : \\( A = (3x + 2)^{2} - (6x^{2} + 13x + 6) \\)\nب) انشر و اختصر العبارة : \\( (3 + 2x)(2 + 3x) \\) ثمَ استنتج أنَ : \\( A = (3x + 2)(x - 1) \\)\nج) حل في \\( \\mathbb{R} \\) المعادلة : \\( A = 0 \\).\n3) أ) بيّن أنَ : \\( A - B = (x - 1)^{2} - (1 + \\sqrt{3})^{2} \\)\nب) قارن العبارتين A و B في حالة \\( x = \\sqrt{13} \\)\nج) حل في \\( \\mathbb{R} \\) المعادلة : \\( A = B \\)",

    latex: "a = 2 + \\sqrt{3} \\quad ; \\quad b = \\sqrt{13} \\quad ; \\quad a^{2} - b^{2} = 4\\sqrt{3} - 6 \\quad ; \\quad 4\\sqrt{3} \\quad ; \\quad 1 + \\sqrt{3} < \\sqrt{13} - 1 \\quad ; \\quad A = 3x^{2} - x - 2 \\quad ; \\quad B = 2x^{2} + x + 1 + 2\\sqrt{3} \\quad ; \\quad x \\in \\mathbb{R} \\quad ; \\quad x = -\\dfrac{2}{3} \\quad ; \\quad A = (3x + 2)^{2} - (6x^{2} + 13x + 6) \\quad ; \\quad (3 + 2x)(2 + 3x) \\quad ; \\quad A = (3x + 2)(x - 1) \\quad ; \\quad A = 0 \\quad ; \\quad A - B = (x - 1)^{2} - (1 + \\sqrt{3})^{2} \\quad ; \\quad x = \\sqrt{13} \\quad ; \\quad A = B",

    reponse: [],

    indice: "",

    correction: "",

    figure: "",

    competences: [
      "المقارنة بين عددين حقيقيين يحتويان على جذور مربعة",
      "حساب القيمة العددية لعبارة جبرية",
      "النشر و الاختصار و التحليل",
      "حل معادلات في مجموعة الأعداد الحقيقية"
    ],

    tags: ["جذور مربعة", "مقارنة", "متطابقات شهيرة", "نشر", "تحليل", "معادلة", "9 أساسي"]
  },
  {
    id: "9-GEO-0001",

    niveau: 9,
    chapitre: "الهندسة المستوية",
    lecon: "شبه المنحرف و مبرهنة طالس و مركز ثقل مثلث",

    source: "المدرسة الإعدادية ع فرحات برادس ـ فرض تأليفي عدد2 ـ الرياضيات ـ السنة الدراسية 2020-2021 ـ تاسعة أساسي : 1، 2، 3، 4، 6، 7 ـ ساعتان ـ يسمح باستعمال الآلة الحاسبة",
    page: 2,
    ordre: 4,

    type: "تمرين",
    difficulte: null,
    points: null,

    enonce_ar: "تمرين4 (7نقاط )\nنعتبر شبه منحرف ABCD قائم في A و B حيث \\( AB = 8 \\) و \\( AD = \\dfrac{32}{3} \\) و \\( BC = 6 \\) و O منتصف [BD]. (الرسم في الصفحة3)\n1) بيّن أنَ \\( BD = \\dfrac{40}{3} \\) و أنَ \\( AC = 10 \\).\n2) المستقيمان (BD) و (AC) يتقاطعان في نقطة F.\nأ) بيّن أنَ \\( \\dfrac{FC}{FA} = \\dfrac{FB}{FD} = \\dfrac{9}{16} \\).\nب) استنتج أنَ : \\( 16 \\times (AC - FA) = 9 \\times FA \\) ثم بيّن أنَ \\( FA = 6{,}4 \\).\nج) بيّن أنَ \\( FB = 4{,}8 \\)\nد) بيّن أنَ المثلث ABF قائم الزاوية في F.\n3) أ) عيّن على [AD] نقطة M حيث \\( AM = \\dfrac{2}{3} AD \\).\nب) المستقيم المار من M و الموازي لـ (BD) يقطع [AO] في G .\nبيّن أنَ G مركز ثقل المثلث ABD\n4) المستقيم (DG) يقطع [AB] في I و المستقيم العمودي على (AO) في النقطة O يقطع (AB) في J.\nأ) بيّن أنَ : \\( (OI) \\perp (AB) \\) و أنَ \\( OI = \\dfrac{16}{3} \\)\nب) بيّن أنَ : \\( BJ = \\dfrac{28}{9} \\).\n(الصفحة 3) الإسم و اللقب :................................... 9 أساسي........",

    latex: "AB = 8 \\quad ; \\quad AD = \\dfrac{32}{3} \\quad ; \\quad BC = 6 \\quad ; \\quad BD = \\dfrac{40}{3} \\quad ; \\quad AC = 10 \\quad ; \\quad \\dfrac{FC}{FA} = \\dfrac{FB}{FD} = \\dfrac{9}{16} \\quad ; \\quad 16 \\times (AC - FA) = 9 \\times FA \\quad ; \\quad FA = 6{,}4 \\quad ; \\quad FB = 4{,}8 \\quad ; \\quad AM = \\dfrac{2}{3} AD \\quad ; \\quad (OI) \\perp (AB) \\quad ; \\quad OI = \\dfrac{16}{3} \\quad ; \\quad BJ = \\dfrac{28}{9}",

    reponse: [],

    indice: "",

    correction: "",

    figure: `(function (THREE, container) {
  var W = container.clientWidth || 420, H = container.clientHeight || 460;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  var pad = 1.6;
  var camera = new THREE.OrthographicCamera(-pad, 8 + pad, 32 / 3 + pad, -pad, -100, 100);
  camera.position.set(0, 0, 10);
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);
  var A = new THREE.Vector3(0, 0, 0), B = new THREE.Vector3(8, 0, 0),
      C = new THREE.Vector3(8, 6, 0), D = new THREE.Vector3(0, 32 / 3, 0),
      O = new THREE.Vector3(4, 16 / 3, 0);
  function seg(a, b) {
    var g = new THREE.BufferGeometry().setFromPoints([a, b]);
    scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x000000 })));
  }
  function dot(p, r) {
    var m = new THREE.Mesh(new THREE.CircleGeometry(r || 0.16, 24), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    m.position.set(p.x, p.y, 0.3);
    scene.add(m);
  }
  function square(p, dx, dy) {
    var r = 0.55;
    var p1 = new THREE.Vector3(p.x + r * dx, p.y, 0.1);
    var p2 = new THREE.Vector3(p.x + r * dx, p.y + r * dy, 0.1);
    var p3 = new THREE.Vector3(p.x, p.y + r * dy, 0.1);
    seg(p1, p2); seg(p2, p3);
  }
  function label(t, x, y) {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    var g = c.getContext('2d');
    g.font = 'bold 64px serif'; g.fillStyle = '#000';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(t, 64, 64);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true }));
    sp.position.set(x, y, 0.5);
    sp.scale.set(0.9, 0.9, 1);
    scene.add(sp);
  }
  seg(A, B); seg(B, C); seg(C, D); seg(D, A); seg(D, B);
  square(A, 1, 1); square(B, -1, 1);
  dot(A); dot(B); dot(C); dot(D); dot(O, 0.12);
  label('A', A.x - 0.6, A.y - 0.55);
  label('B', B.x + 0.6, B.y - 0.55);
  label('C', C.x + 0.6, C.y + 0.55);
  label('D', D.x - 0.6, D.y + 0.55);
  label('O', O.x - 0.15, O.y + 0.6);
  renderer.render(scene, camera);
  return { scene: scene, camera: camera, renderer: renderer };
})`,

    competences: [
      "حساب أطوال بتوظيف مبرهنة فيتاغور",
      "توظيف مبرهنة طالس و مبرهنة طالس العكسية",
      "التعرف على مركز ثقل مثلث",
      "توظيف خاصيات التعامد و التوازي في المستوي"
    ],

    tags: ["شبه منحرف", "طالس", "فيتاغور", "مركز ثقل", "تعامد", "توازي", "9 أساسي"]
  },
  {
    id: "9-ESP-0001",

    niveau: 9,
    chapitre: "الهندسة الفضائية",
    lecon: "الهرم المنتظم و التعامد و التوازي في الفضاء",

    source: "المدرسة الإعدادية النموذجية ضفاف البحيرة ـ مراجعة للمناظرة ـ الهندسة الفضائية ـ 9 أساسي ـ فوزي الغربي",
    page: 1,
    ordre: 1,

    type: "تمرين",
    difficulte: null,
    points: null,

    enonce_ar: "تمرين رقم1\nSABC هرم كل أحرفه متقايسة \\( AB = 4\\sqrt{3} \\) و I منتصف [BC] و O مركز المثلث ABC .\n1) أ) بين أن \\( OA = 4 \\)\nب) بين أن \\( SO = 4\\sqrt{2} \\)\n2) بين أن \\( (BC) \\perp (SAI) \\)\n3) ليكن \\( \\Delta \\) المستقيم المار من A و العمودي على (ABC) و E النقطة من \\( \\Delta \\) بحيث \\( EA = 4\\sqrt{2} \\)\nأ) بين أن \\( EB = EC \\)\nب) استنتج أن \\( E \\in (SAI) \\)\n4) بين أن \\( (ES) // (ABC) \\)\n5) لتكن M نقطة تقاطع (EI) و(OS)\nبين أن \\( \\dfrac{OM}{AE} = \\dfrac{IM}{IE} = \\dfrac{1}{3} \\)",

    latex: "AB = 4\\sqrt{3} \\quad ; \\quad OA = 4 \\quad ; \\quad SO = 4\\sqrt{2} \\quad ; \\quad (BC) \\perp (SAI) \\quad ; \\quad EA = 4\\sqrt{2} \\quad ; \\quad EB = EC \\quad ; \\quad E \\in (SAI) \\quad ; \\quad (ES) // (ABC) \\quad ; \\quad \\dfrac{OM}{AE} = \\dfrac{IM}{IE} = \\dfrac{1}{3}",

    reponse: [],

    indice: "",

    correction: "1) أ) ABC مثلث متقايس الأضلاع و I منتصف [BC] إذن [AI] موسط و بالتالي [AI] ارتفاع إذن \\( AI = BC\\dfrac{\\sqrt{3}}{2} = 4\\sqrt{3} \\times \\dfrac{\\sqrt{3}}{2} = 6 \\)\nABC متقايس الأضلاع و O مركزه إذن O هو مركز ثقله إذن \\( OA = \\dfrac{2}{3} AI = \\dfrac{2}{3} \\times 6 = 4 \\)\nب) SABC هرم منتظم ارتفاعه [OS] إذن\n\\( AS = \\sqrt{OA^{2} + OS^{2}} \\)\n\\( 4\\sqrt{3} = \\sqrt{16 + OS^{2}} \\)\n\\( 48 = 16 + OS^{2} \\)\n\\( OS^{2} = 48 - 16 = 32 \\)\n\\( OS = \\sqrt{32} = 4\\sqrt{2} \\)\n2) لنا [AI] ارتفاع للمثلث ABC إذن \\( (AI) \\perp (BC) \\)\nSBC مثلث متقايس الضلعين قمته الرئيسية S ز I منتصف [BC] إذن (SI) هو الموسط العمودي لـ [BC] إذن \\( (SI) \\perp (BC) \\)\n\\( \\begin{cases} (BC) \\perp (AI) \\\\ (BC) \\perp (SI) \\\\ (AI) \\subset (SAI) \\\\ (SI) \\subset (SAI) \\\\ (AI) \\cap (SI) = \\{I\\} \\end{cases} \\)\nإذن \\( (BC) \\perp (SAI) \\)\n3) أ) \\( \\begin{cases} (AE) \\perp (ABC) \\\\ (AB) \\subset (ABC) \\\\ (AE) \\cap (AB) = \\{A\\} \\end{cases} \\) إذن \\( (AE) \\perp (AB) \\) إذن المثلث ABE قائم في A حسب بيتاغور\n\\( EB^{2} = EA^{2} + AB^{2} \\)\n\\( EB^{2} = (4\\sqrt{2})^{2} + (4\\sqrt{3})^{2} = 32 + 48 = 80 = (4\\sqrt{5})^{2} \\)\n\\( EB = 4\\sqrt{5} \\)\nبنفس الطريقة نبين ان \\( EC = 4\\sqrt{5} \\)\nإذن EB=EC\nب) EBC مثلث متقايس الضلعين و I منتصف [BC] إذن (EI) و (BC) متعامدان و بما ان (BC) يعامد (AI) و (EI) متقاطعان في I و محتويان في AEI فإن \\( (AEI) \\perp (BC) \\)\n\\( \\begin{cases} (BC) \\perp (AEI) \\\\ (BC) \\perp (SAI) \\end{cases} \\Longrightarrow (AEI) // (SAI) \\) و بما ان للمستويان (AEI) و (SAI) نقطة مشتركة I فهما متطابقان إذن \\( E \\in (SAI) \\)\n4) \\( \\begin{cases} (SO) \\perp (ABC) \\\\ (AE) \\perp (ABC) \\end{cases} \\Longrightarrow (AE) // (SO) \\) و بما أن AE=SO فإن AESO مستطيل إذن\n\\( (ES) // (AO) \\)\n\\( \\begin{cases} (SE) // (AO) \\\\ (AO) \\subset (ABC) \\end{cases} \\Longrightarrow (SE) // (ABC) \\)\n5) في المستوي (AEI)\nفي المثلث AEI لنا \\( M \\in (EI) \\) ; \\( O \\in (AI) \\) ; \\( (OM) // (AE) \\)\nإذن حسب طالس \\( \\dfrac{OM}{AE} = \\dfrac{IM}{IE} = \\dfrac{IO}{IA} = \\dfrac{1}{3} \\)",

    figure: `(function (THREE, container) {
  var W = container.clientWidth || 480, H = container.clientHeight || 520;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  var camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 500);
  camera.position.set(9, 8, 22);
  camera.lookAt(0, 3, 0);
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);
  var k = 4 * Math.sqrt(2);
  var A = new THREE.Vector3(-4, 0, 0);
  var B = new THREE.Vector3(2, 0, -2 * Math.sqrt(3));
  var C = new THREE.Vector3(2, 0, 2 * Math.sqrt(3));
  var O = new THREE.Vector3(0, 0, 0);
  var S = new THREE.Vector3(0, k, 0);
  var I = new THREE.Vector3(2, 0, 0);
  var E = new THREE.Vector3(-4, k, 0);
  var D1 = new THREE.Vector3(-4, -2, 0);
  var D2 = new THREE.Vector3(-4, k + 3, 0);
  function seg(a, b, dashed) {
    var g = new THREE.BufferGeometry().setFromPoints([a, b]);
    var m = dashed
      ? new THREE.LineDashedMaterial({ color: 0x000000, dashSize: 0.45, gapSize: 0.3 })
      : new THREE.LineBasicMaterial({ color: 0x000000 });
    var l = new THREE.Line(g, m);
    if (dashed) l.computeLineDistances();
    scene.add(l);
  }
  function dot(p) {
    var m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    m.position.copy(p);
    scene.add(m);
  }
  function label(t, p, dx, dy) {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    var g = c.getContext('2d');
    g.font = 'bold 64px serif'; g.fillStyle = '#000';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(t, 64, 64);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true }));
    sp.position.set(p.x + dx, p.y + dy, p.z);
    sp.scale.set(1.1, 1.1, 1);
    scene.add(sp);
  }
  seg(A, B); seg(B, C); seg(A, C, true);
  seg(S, A); seg(S, B); seg(S, C);
  seg(S, O, true); seg(A, I, true);
  seg(D1, D2);
  dot(A); dot(B); dot(C); dot(S); dot(O); dot(I); dot(E);
  label('S', S, 0, 0.75);
  label('A', A, -0.75, 0);
  label('B', B, 0, -0.75);
  label('C', C, 0.75, 0);
  label('O', O, -0.55, -0.45);
  label('I', I, 0.55, -0.45);
  label('E', E, -0.8, 0.2);
  renderer.render(scene, camera);
  return { scene: scene, camera: camera, renderer: renderer };
})`,

    competences: [
      "توظيف خاصيات الهرم المنتظم",
      "حساب أطوال في الفضاء بتوظيف مبرهنة فيتاغور",
      "إثبات تعامد مستقيم و مستو",
      "إثبات توازي مستقيم و مستو",
      "توظيف مبرهنة طالس في الفضاء"
    ],

    tags: ["هندسة فضائية", "هرم منتظم", "تعامد", "توازي", "فيتاغور", "طالس", "مناظرة", "9 أساسي"]
  }
];
