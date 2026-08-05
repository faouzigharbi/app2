// LE CATALOGUE DES ÉNONCÉS — transcrits des feuilles, et d'elles seules.
//
// Trois feuilles de فوزي الغربي sur « الزوايا » en 7ème. Ce qui est engendré,
// c'est le RAISONNEMENT et les NOMBRES ; la question, elle, est celle du
// maître : « أحسب قيس الزاوية … ».
//
//   src     la feuille et l'exercice d'où l'item vient
//   f       la famille — la règle du programme qu'il met en jeu
//   d       la difficulté, lue sur l'item et non décrétée
//   monter  la scène : les demi-droites, les données, l'angle demandé
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Angles;

  const ITEMS = [];
  const item = (src, f, d, monter) => ITEMS.push({ src, f, n: 7, d, monter });
  const cle = F.cleAngle;

  // LA POSE. Un éventail toujours posé à plat se reconnaît sans être lu : on
  // fait donc tourner l'ensemble d'un angle quelconque. Les mesures, elles, ne
  // bougent pas — une rotation ne change aucun angle.
  const pose = () => F.ent(0, 60);

  // ═══════════════════════════════════════════════════════════════════════
  // ANGLES COMPLÉMENTAIRES — « متتامّتان », somme 90°
  // ═══════════════════════════════════════════════════════════════════════

  // ANGLES7_1 ex3 et ex4 — deux adjacentes complémentaires, l'une est donnée
  item('ANGLES7_1 ex3', 'complementaires', 'facile', () => {
    const p = pose(), boc = F.ent(20, 70);
    return {
      sommet: 'O',
      rayons: [{ nom: 'A', deg: p }, { nom: 'B', deg: p + 90 - boc },
               { nom: 'C', deg: p + 90 }],
      arcs: [['A', 'O', 'B', ''], ['B', 'O', 'C', boc + '°']],
      hyp: [['comp', cle('A', 'O', 'B'), cle('B', 'O', 'C')],
            ['mes', cle('B', 'O', 'C'), F.q(boc)]],
      but: cle('A', 'O', 'B'),
      donnees: ['نعتبر زاويتين متجاورتين و متتامّتين AÔB و BÔC.',
                'علما أنّ BÔC = ' + boc + '°.']
    };
  });

  // ANGLES7_PC ex4-أ — le tableau à compléter, cas par cas
  item('angles7_PC ex4', 'complementaires', 'facile', () => {
    const m = F.choix([24, 58, 45, 33, 67, 12]);
    const p = pose();
    return {
      sommet: 'J',
      rayons: [{ nom: 'I', deg: p }, { nom: 'K', deg: p + m },
               { nom: 'L', deg: p + 90 }],
      arcs: [['I', 'J', 'K', m + '°'], ['K', 'J', 'L', '']],
      hyp: [['comp', cle('I', 'J', 'K'), cle('K', 'J', 'L')],
            ['mes', cle('I', 'J', 'K'), F.q(m)]],
      but: cle('K', 'J', 'L'),
      donnees: ['الزاويتان IĴK و KĴL متتامّتان، و IĴK = ' + m + '°.']
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ANGLES SUPPLÉMENTAIRES — « متكاملتان », somme 180°
  // ═══════════════════════════════════════════════════════════════════════

  item('angles7_PC ex4', 'supplementaires', 'facile', () => {
    const m = F.choix([24, 58, 45, 110, 137, 72]);
    const p = pose();
    return {
      sommet: 'F',
      rayons: [{ nom: 'E', deg: p }, { nom: 'G', deg: p + m },
               { nom: 'M', deg: p + 180 }],
      arcs: [['E', 'F', 'G', m + '°'], ['G', 'F', 'M', '']],
      hyp: [['supp', cle('E', 'F', 'G'), cle('G', 'F', 'M')],
            ['mes', cle('E', 'F', 'G'), F.q(m)]],
      but: cle('G', 'F', 'M'),
      donnees: ['الزاويتان EF̂G و GF̂M متكاملتان، و EF̂G = ' + m + '°.']
    };
  });

  // ANGLES7_1 ex5 — adjacentes supplémentaires, l'une vaut la moitié de
  // l'autre : la feuille demande AÔB, et le partage donne tout.
  item('ANGLES7_1 ex5', 'supplementaires', 'moyen', () => {
    const p = pose(), aob = F.choix([120, 100, 140, 60, 90]);
    return {
      sommet: 'O',
      rayons: [{ nom: 'A', deg: p }, { nom: 'B', deg: p + aob },
               { nom: 'C', deg: p + 180 }],
      arcs: [['A', 'O', 'B', aob + '°'], ['B', 'O', 'C', '']],
      hyp: [['supp', cle('A', 'O', 'B'), cle('B', 'O', 'C')],
            ['mes', cle('A', 'O', 'B'), F.q(aob)]],
      but: cle('B', 'O', 'C'),
      donnees: ['نعتبر زاويتين متجاورتين و متكاملتين AÔB و BÔC.',
                'علما أنّ AÔB = ' + aob + '°.']
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // CHASLES — deux angles adjacents font le grand (ANGLES7_PC ex2)
  // ═══════════════════════════════════════════════════════════════════════

  // « احسب دون استعمال المنقلة » : 116° depuis (Oz), 47° depuis (Ox).
  item('angles7_PC ex2', 'chasles', 'moyen', () => {
    const p = pose();
    const xoy = F.ent(35, 60), xot = F.ent(xoy + 10, 115);
    return {
      sommet: 'O',
      rayons: [{ nom: 'x', deg: p }, { nom: 'y', deg: p + xoy },
               { nom: 't', deg: p + xot }, { nom: 'z', deg: p + 180 }],
      arcs: [['x', 'O', 'y', xoy + '°'], ['z', 'O', 't', (180 - xot) + '°']],
      hyp: [['mes', cle('x', 'O', 'y'), F.q(xoy)],
            ['mes', cle('z', 'O', 't'), F.q(180 - xot)],
            ['mes', cle('x', 'O', 'z'), F.q(180)]],
      but: cle('t', 'O', 'y'),
      donnees: ['x و z و O ثلاث نقاط على استقامة واحدة.',
                '[Oy) و [Ot) نصفا مستقيمين حيث xÔy = ' + xoy
                + '° و zÔt = ' + (180 - xot) + '°.'],
      indice: 'الزاوية xÔz منبسطة: قيسها 180°'
    };
  });

  // ANGLES7_1 ex11 — deux adjacentes supplémentaires, puis un troisième rayon
  item('ANGLES7_1 ex11', 'chasles', 'moyen', () => {
    const p = pose(), yoz = F.choix([110, 120, 130, 100]), xot = F.ent(20, 45);
    return {
      sommet: 'O',
      rayons: [{ nom: 'x', deg: p }, { nom: 't', deg: p + xot },
               { nom: 'y', deg: p + 180 - yoz }, { nom: 'z', deg: p + 180 }],
      arcs: [['x', 'O', 't', xot + '°'], ['y', 'O', 'z', yoz + '°']],
      hyp: [['mes', cle('y', 'O', 'z'), F.q(yoz)],
            ['mes', cle('x', 'O', 't'), F.q(xot)],
            ['mes', cle('x', 'O', 'z'), F.q(180)]],
      but: cle('t', 'O', 'y'),
      donnees: ['أرسم زاويتين متجاورتين و متكاملتين xÔy و yÔz حيث yÔz = '
                + yoz + '°.',
                '[Ot) نصف مستقيم حيث xÔt = ' + xot + '°.']
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // BISSECTRICE — « منصّف » (ANGLES7_1 ex6, ex16 ; angles7_PC ex10)
  // ═══════════════════════════════════════════════════════════════════════

  item('ANGLES7_1 ex16', 'bissectrice', 'facile', () => {
    const p = pose(), xoy = 2 * F.ent(15, 45);
    return {
      sommet: 'O',
      rayons: [{ nom: 'x', deg: p }, { nom: 'z', deg: p + xoy / 2 },
               { nom: 'y', deg: p + xoy }],
      arcs: [['x', 'O', 'z', ''], ['z', 'O', 'y', ''], ['x', 'O', 'y', xoy + '°']],
      hyp: [['mes', cle('x', 'O', 'y'), F.q(xoy)],
            ['bis', 'Oz', cle('x', 'O', 'y')]],
      but: cle('x', 'O', 'z'),
      donnees: ['xÔy زاوية قيس فتحتها ' + xoy + '°.',
                '[Oz) هو منصّف الزاوية xÔy.']
    };
  });

  // angles7_PC ex10 — la moitié est donnée, on remonte à l'angle entier
  item('angles7_PC ex10', 'bissectrice', 'moyen', () => {
    const p = pose(), demi = F.ent(20, 44);
    return {
      sommet: 'O',
      rayons: [{ nom: 'x', deg: p }, { nom: 't', deg: p + demi },
               { nom: 'y', deg: p + 2 * demi }],
      arcs: [['x', 'O', 't', demi + '°'], ['t', 'O', 'y', '']],
      hyp: [['bis', 'Ot', cle('x', 'O', 'y')],
            ['mes', cle('x', 'O', 't'), F.q(demi)]],
      but: cle('x', 'O', 'y'),
      donnees: ['[Ot) هو منصّف الزاوية xÔy، و xÔt = ' + demi + '°.']
    };
  });

  // ANGLES7_1 ex6 — le منصّف d'une adjacente supplémentaire
  item('ANGLES7_1 ex6', 'bissectrice', 'difficile', () => {
    const p = pose(), aob = 2 * F.choix([30, 40, 50, 60, 35]);
    return {
      sommet: 'O',
      rayons: [{ nom: 'A', deg: p }, { nom: 'C', deg: p + aob / 2 },
               { nom: 'B', deg: p + aob }, { nom: 'D', deg: p + 180 }],
      arcs: [['A', 'O', 'C', ''], ['C', 'O', 'B', ''], ['B', 'O', 'D', '']],
      hyp: [['supp', cle('A', 'O', 'B'), cle('B', 'O', 'D')],
            ['mes', cle('B', 'O', 'D'), F.q(180 - aob)],
            ['bis', 'OC', cle('A', 'O', 'B')]],
      but: cle('A', 'O', 'C'),
      donnees: ['AÔB و BÔD زاويتان متجاورتان و متكاملتان، و BÔD = '
                + (180 - aob) + '°.',
                '[OC) هو منصّف الزاوية AÔB.'],
      indice: 'احسب أوّلا الزاوية الكاملة، ثمّ اقسمها'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // OPPOSÉES PAR LE SOMMET — « متقابلتان بالرأس » (ANGLES7_1 ex13)
  // ═══════════════════════════════════════════════════════════════════════

  item('ANGLES7_1 ex13', 'opposees-sommet', 'facile', () => {
    const p = pose(), xoy = F.ent(30, 75);
    return {
      sommet: 'O',
      rayons: [{ nom: 'x', deg: p }, { nom: 'y', deg: p + xoy },
               { nom: 'z', deg: p + 180 }, { nom: 't', deg: p + 180 + xoy }],
      arcs: [['x', 'O', 'y', xoy + '°'], ['z', 'O', 't', '']],
      hyp: [['oppose', cle('x', 'O', 'y'), cle('z', 'O', 't')],
            ['mes', cle('x', 'O', 'y'), F.q(xoy)]],
      but: cle('z', 'O', 't'),
      donnees: ['(xz) و (yt) مستقيمان يتقاطعان في O.',
                'xÔy = ' + xoy + '°.']
    };
  });

  // Les opposées, puis l'adjacente : deux règles pour une réponse
  item('ANGLES7_1 ex13', 'opposees-sommet', 'difficile', () => {
    const p = pose(), xoy = F.ent(35, 70);
    return {
      sommet: 'O',
      rayons: [{ nom: 'x', deg: p }, { nom: 'y', deg: p + xoy },
               { nom: 'z', deg: p + 180 }, { nom: 't', deg: p + 180 + xoy }],
      arcs: [['x', 'O', 'y', xoy + '°'], ['y', 'O', 'z', '']],
      hyp: [['mes', cle('x', 'O', 'y'), F.q(xoy)],
            ['supp', cle('x', 'O', 'y'), cle('y', 'O', 'z')],
            ['oppose', cle('y', 'O', 'z'), cle('x', 'O', 't')]],
      but: cle('x', 'O', 't'),
      donnees: ['(xz) و (yt) مستقيمان يتقاطعان في O، و xÔy = ' + xoy + '°.'],
      indice: 'مرّ بالزاوية المجاورة قبل المتقابلة بالرأس'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LA SOMME DES ANGLES D'UN TRIANGLE (ANGLES7_1 ex19 ; angles7_PC ex13)
  // ═══════════════════════════════════════════════════════════════════════

  item('ANGLES7_1 ex19', 'triangle', 'facile', () => {
    const b = F.ent(35, 85), a = F.ent(30, 170 - b);
    const pts = triangle(a, b);
    return {
      sommets: pts,
      cotes: [['A', 'B'], ['B', 'C'], ['C', 'A']],
      arcs: [['B', 'A', 'C', a + '°'], ['C', 'B', 'A', b + '°'], ['A', 'C', 'B', '']],
      triangles: [[cle('B', 'A', 'C'), cle('A', 'B', 'C'), cle('A', 'C', 'B')]],
      hyp: [['mes', cle('B', 'A', 'C'), F.q(a)],
            ['mes', cle('A', 'B', 'C'), F.q(b)]],
      but: cle('A', 'C', 'B'),
      donnees: ['ABC مثلّث حيث BÂC = ' + a + '° و AB̂C = ' + b + '°.']
    };
  });

  // Le triangle rectangle : un angle vaut 90°, et l'on cherche le troisième
  item('ANGLES7_1 ex10', 'triangle', 'moyen', () => {
    const b = F.ent(25, 65), a = 90;
    const pts = triangle(a, b);
    return {
      sommets: pts,
      cotes: [['A', 'B'], ['B', 'C'], ['C', 'A']],
      arcs: [['B', 'A', 'C', '90°'], ['C', 'B', 'A', b + '°'], ['A', 'C', 'B', '']],
      triangles: [[cle('B', 'A', 'C'), cle('A', 'B', 'C'), cle('A', 'C', 'B')]],
      hyp: [['mes', cle('B', 'A', 'C'), F.q(90)],
            ['mes', cle('A', 'B', 'C'), F.q(b)]],
      but: cle('A', 'C', 'B'),
      donnees: ['ABC مثلّث قائم الزاوية في A، و AB̂C = ' + b + '°.']
    };
  });

  // ANGLES7_1 ex20 — les deux bissectrices d'un triangle rectangle
  item('ANGLES7_1 ex20', 'triangle', 'difficile', () => {
    const b = 2 * F.ent(15, 30), c = 90 - b / 2 * 0 - 0;
    const bb = b, cc = 180 - 90 - bb;
    const pts = triangle(90, bb);
    // O est le point de rencontre des deux bissectrices : on ne le dessine pas,
    // on raisonne dessus.
    return {
      sommets: pts,
      cotes: [['A', 'B'], ['B', 'C'], ['C', 'A']],
      arcs: [['B', 'A', 'C', '90°'], ['C', 'B', 'A', bb + '°'], ['A', 'C', 'B', '']],
      triangles: [[cle('B', 'A', 'C'), cle('A', 'B', 'C'), cle('A', 'C', 'B')],
                  [cle('B', 'O', 'C'), cle('O', 'B', 'C'), cle('O', 'C', 'B')]],
      hyp: [['mes', cle('B', 'A', 'C'), F.q(90)],
            ['mes', cle('A', 'B', 'C'), F.q(bb)],
            ['bis', 'BO', cle('A', 'B', 'C')],
            ['bis', 'CO', cle('A', 'C', 'B')]],
      but: cle('B', 'O', 'C'),
      donnees: ['ABC مثلّث قائم الزاوية في A حيث AB̂C = ' + bb + '°.',
                '[BO) و [CO) منصّفا الزاويتين AB̂C و AĈB، و يتقاطعان في O.'],
      indice: 'احسب زوايا المثلّث، ثمّ نصّفها، ثمّ استعمل مجموع زوايا BOC'
    };
  });

  // Les sommets d'un triangle dont on connaît deux angles — pour la figure
  // seulement, et donc en flottants : rien n'est vérifié dessus qu'à un demi
  // degré près.
  function triangle(a, b) {
    const A = [0, 0], B = [1, 0];
    // C est à l'intersection des deux demi-droites partant de A et de B
    const ta = Math.tan(a / F.R), tb = Math.tan(b / F.R);
    const x = (a === 90) ? 0 : (tb / (ta + tb) * (ta === Infinity ? 1 : 1));
    // formule directe : C = (t_b /(tan a + tan b), …) — on la calcule à part
    const cx = (a === 90) ? 0 : tb / (Math.tan(a / F.R) + tb);
    const cy = (a === 90) ? tb : cx * Math.tan(a / F.R);
    return { A, B, C: [a === 90 ? 0 : cx, a === 90 ? tb : cy] };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ÉCARTÉ DE CES FEUILLES, ET POURQUOI
  //
  //   Les exercices de CONSTRUCTION — « أرسم زاوية قيسها 60° », « ابن
  //   منصّفها » — ne se vérifient pas : un tracé juste et un tracé faux ont le
  //   même texte. Ils restent dans l'énoncé comme mise en place.
  //
  //   Les tableaux à cocher (« أتمم الجدول », « أشطب الإفادة الخاطئة ») et les
  //   « أذكر خمسة أزواج » demandent un inventaire, pas un calcul. C'est un bon
  //   exercice de classe et une mauvaise chaîne : rien n'y s'enchaîne.
  //
  //   ANGLES7_1 ex17 et ex18 mêlent l'angle à la DISTANCE — « ابن العمودي
  //   المارّ من M ثمّ قس بعد M عن كلّ ضلع ». Le noyau des angles ne porte pas
  //   les longueurs ; ces exercices-là appartiennent à la fiche « التعامد و
  //   التوازي », qui les mesure exactement.
  // ═══════════════════════════════════════════════════════════════════════

  const par = (f, d) => ITEMS.filter(x => x.f === f && x.d === d);
  const familles = () => [...new Set(ITEMS.map(x => x.f))];

  const API = { ITEMS, par, familles };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
