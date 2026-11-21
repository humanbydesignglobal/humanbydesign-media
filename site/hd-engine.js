// Human Design chart engine. Needs global Astronomy (astronomy-engine).
(function (root) {
  var ORDER = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];
  var CENTER_GATES = {
    Head:[64,61,63], Ajna:[47,24,4,17,43,11], Throat:[62,23,56,35,12,45,33,8,31,20,16],
    G:[7,1,13,10,25,46,2,15], Heart:[21,40,26,51], Spleen:[48,57,44,50,32,28,18],
    SolarPlexus:[6,37,22,36,30,55,49], Sacral:[5,14,29,59,9,3,42,27,34], Root:[53,60,52,19,39,41,58,38,54]
  };
  var CHANNELS = [
    [1,8,'Inspiration'],[2,14,'The Beat'],[3,60,'Mutation'],[4,63,'Logic'],[5,15,'Rhythm'],[6,59,'Intimacy'],
    [7,31,'The Alpha'],[9,52,'Concentration'],[10,20,'Awakening'],[10,34,'Exploration'],[10,57,'Perfected Form'],
    [11,56,'Curiosity'],[12,22,'Openness'],[13,33,'The Prodigal'],[16,48,'The Wavelength'],[17,62,'Acceptance'],
    [18,58,'Judgment'],[19,49,'Synthesis'],[20,34,'Charisma'],[20,57,'The Brainwave'],[21,45,'Money'],
    [23,43,'Structuring'],[24,61,'Awareness'],[25,51,'Initiation'],[26,44,'Surrender'],[27,50,'Preservation'],
    [28,38,'Struggle'],[29,46,'Discovery'],[30,41,'Recognition'],[32,54,'Transformation'],[34,57,'Power'],
    [35,36,'Transitoriness'],[37,40,'Community'],[39,55,'Emoting'],[42,53,'Maturation'],[47,64,'Abstraction']
  ];
  var MOTORS = ['Sacral','Heart','SolarPlexus','Root'];
  var GATE_CENTER = {};
  Object.keys(CENTER_GATES).forEach(function (c) { CENTER_GATES[c].forEach(function (g) { GATE_CENTER[g] = c; }); });

  function norm(x) { x %= 360; return x < 0 ? x + 360 : x; }
  function d2r(x) { return x * Math.PI / 180; }
  function gateLine(lon) {
    var x = norm(lon - 302), idx = Math.floor(x / 5.625);
    return { gate: ORDER[idx], line: Math.floor((x - idx * 5.625) / 0.9375) + 1, lon: lon };
  }
  function sunLon(date) { return Astronomy.SunPosition(date).elon; }
  function bodyLon(body, date) { return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon; }
  function trueNode(date) {
    var T = (Astronomy.MakeTime(date).tt) / 36525;
    var D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
    var M = 357.5291092 + 35999.0502909 * T;
    var Mp = 134.9633964 + 477198.8675055 * T;
    var F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
    var Om = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T;
    Om = Om - 1.4979 * Math.sin(d2r(2 * (D - F))) - 0.1500 * Math.sin(d2r(M)) - 0.1226 * Math.sin(d2r(2 * D))
      + 0.1176 * Math.sin(d2r(2 * F)) - 0.0801 * Math.sin(d2r(2 * (Mp - F)));
    return norm(Om);
  }
  function activations(date) {
    var B = Astronomy.Body, s = sunLon(date), n = trueNode(date);
    var list = [
      ['Sun', s], ['Earth', s + 180], ['North Node', n], ['South Node', n + 180],
      ['Moon', Astronomy.EclipticGeoMoon(date).lon],
      ['Mercury', bodyLon(B.Mercury, date)], ['Venus', bodyLon(B.Venus, date)], ['Mars', bodyLon(B.Mars, date)],
      ['Jupiter', bodyLon(B.Jupiter, date)], ['Saturn', bodyLon(B.Saturn, date)], ['Uranus', bodyLon(B.Uranus, date)],
      ['Neptune', bodyLon(B.Neptune, date)], ['Pluto', bodyLon(B.Pluto, date)]
    ];
    return list.map(function (p) { var gl = gateLine(norm(p[1])); gl.planet = p[0]; return gl; });
  }
  function designDate(birth) {
    var target = norm(sunLon(birth) - 88), t = new Date(birth.getTime() - 88.5 * 86400000);
    for (var i = 0; i < 8; i++) {
      var diff = norm(sunLon(t) - target); if (diff > 180) diff -= 360;
      t = new Date(t.getTime() - diff / 0.98565 * 86400000);
    }
    return t;
  }
  function tzOffsetMs(utcMs, tz) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var p = {}; f.formatToParts(new Date(utcMs)).forEach(function (x) { p[x.type] = x.value; });
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - utcMs;
  }
  function localToUtc(y, mo, d, h, mi, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi);
    var utc = guess - tzOffsetMs(guess, tz);
    utc = guess - tzOffsetMs(utc, tz);
    return new Date(utc);
  }
  function chart(birthUtc) {
    var dd = designDate(birthUtc);
    var pers = activations(birthUtc), des = activations(dd);
    var gates = {};
    pers.concat(des).forEach(function (a) { gates[a.gate] = true; });
    var chans = CHANNELS.filter(function (c) { return gates[c[0]] && gates[c[1]]; }).map(function (c) {
      return { a: c[0], b: c[1], name: c[2], from: GATE_CENTER[c[0]], to: GATE_CENTER[c[1]] };
    });
    var defined = {};
    chans.forEach(function (c) { defined[c.from] = true; defined[c.to] = true; });
    var adj = {};
    chans.forEach(function (c) { (adj[c.from] = adj[c.from] || []).push(c.to); (adj[c.to] = adj[c.to] || []).push(c.from); });
    function reach(start) { var seen = {}, st = [start]; seen[start] = true; while (st.length) { var c = st.pop(); (adj[c] || []).forEach(function (n) { if (!seen[n]) { seen[n] = true; st.push(n); } }); } return seen; }
    var throatReach = defined.Throat ? reach('Throat') : {};
    var motorToThroat = MOTORS.some(function (m) { return defined[m] && throatReach[m]; });
    var type;
    if (defined.Sacral) type = motorToThroat ? 'Manifesting Generator' : 'Generator';
    else if (motorToThroat) type = 'Manifestor';
    else if (Object.keys(defined).length) type = 'Projector';
    else type = 'Reflector';
    var authority;
    if (defined.SolarPlexus) authority = 'Emotional';
    else if (defined.Sacral) authority = 'Sacral';
    else if (defined.Spleen) authority = 'Splenic';
    else if (defined.Heart) authority = throatReach.Heart ? 'Ego Manifested' : 'Ego Projected';
    else if (defined.G) authority = 'Self-Projected';
    else if (type === 'Reflector') authority = 'Lunar';
    else authority = 'Mental';
    var comps = 0, seen = {};
    Object.keys(defined).forEach(function (c) { if (!seen[c]) { comps++; var r = reach(c); Object.keys(r).forEach(function (k) { seen[k] = true; }); } });
    var definition = ['No Definition', 'Single Definition', 'Split Definition', 'Triple Split Definition', 'Quadruple Split Definition'][comps] || 'Split Definition';
    return {
      type: type, authority: authority, definition: definition,
      profile: pers[0].line + '/' + des[0].line, pLine: pers[0].line, dLine: des[0].line,
      defined: defined, channels: chans, gates: Object.keys(gates).map(Number).sort(function (a, b) { return a - b; }),
      personality: pers, design: des, designDate: dd,
      cross: [pers[0].gate, pers[1].gate, des[0].gate, des[1].gate]
    };
  }
  root.HD = { chart: chart, localToUtc: localToUtc, GATE_CENTER: GATE_CENTER, CENTER_GATES: CENTER_GATES };
})(typeof window !== 'undefined' ? window : globalThis);
