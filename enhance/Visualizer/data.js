window._seulex_shape = 'rect'; let data = {
  "nodes": [
    {
      "key": "K0",
      "label": "I0\n=======\nNS -> ●S  § [END]\nS -> ●C C  § c/d\nC -> ●c C  § c/d/c/d\nC -> ●d e  § c/d/c/d",
      "color": "#FFFFFF"
    },
    {
      "key": "K1",
      "label": "I1\n=======\nC -> c ●C  § c/d/c/d\nC -> ●c C  § c/d/c/d/c/d/c/d\nC -> ●d e  § c/d/c/d/c/d/c/d",
      "color": "#FFFFFF"
    },
    {
      "key": "K2",
      "label": "I2\n=======\nC -> d ●e  § c/d/c/d",
      "color": "#FFFFFF"
    },
    {
      "key": "K3",
      "label": "I3\n=======\nNS -> S● § [END]",
      "color": "#FFFFFF"
    },
    {
      "key": "K4",
      "label": "I4\n=======\nS -> C ●C  § c/d\nC -> ●c C  § c/d/c/d\nC -> ●d e  § c/d/c/d",
      "color": "#FFFFFF"
    },
    {
      "key": "K5",
      "label": "I5\n=======\nS -> C C● § c/d",
      "color": "#FFFFFF"
    },
    {
      "key": "K6",
      "label": "I6\n=======\nC -> d e● § c/d/c/d",
      "color": "#FFFFFF"
    },
    {
      "key": "K7",
      "label": "I7\n=======\nC -> c C● § c/d/c/d",
      "color": "#FFFFFF"
    }
  ],
  "edges": [
    {
      "source": "K0",
      "target": "K1",
      "name": "K0_1",
      "label": "c"
    },
    {
      "source": "K0",
      "target": "K2",
      "name": "K0_2",
      "label": "d"
    },
    {
      "source": "K0",
      "target": "K3",
      "name": "K0_3",
      "label": "S"
    },
    {
      "source": "K0",
      "target": "K4",
      "name": "K0_4",
      "label": "C"
    },
    {
      "source": "K1",
      "target": "K1",
      "name": "K1_1",
      "label": "c"
    },
    {
      "source": "K1",
      "target": "K2",
      "name": "K1_2",
      "label": "d"
    },
    {
      "source": "K1",
      "target": "K7",
      "name": "K1_7",
      "label": "C"
    },
    {
      "source": "K2",
      "target": "K6",
      "name": "K2_6",
      "label": "e"
    },
    {
      "source": "K4",
      "target": "K1",
      "name": "K4_1",
      "label": "c"
    },
    {
      "source": "K4",
      "target": "K2",
      "name": "K4_2",
      "label": "d"
    },
    {
      "source": "K4",
      "target": "K5",
      "name": "K4_5",
      "label": "C"
    }
  ]
}