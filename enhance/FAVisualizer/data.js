window._seulex_shape = 'rect'; let data = {
  "nodes": [
    {
      "key": "K0",
      "label": "I0\n=======\nexpr' -> ●expr  § SP_END\n-------\n\nexpr -> ●expr PLUS expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\nexpr -> ●expr MINUS expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\nexpr -> ●expr MULTIPLY expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\nexpr -> ●expr DIVIDE expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\nexpr -> ●NUMBER  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS",
      "color": "#FFFFFF"
    },
    {
      "key": "K1",
      "label": "I1\n=======\nexpr -> NUMBER● § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K2",
      "label": "I2\n=======\nexpr' -> expr● § SP_END\n-------\n\nexpr -> expr ●PLUS expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\nexpr -> expr ●MINUS expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\nexpr -> expr ●MULTIPLY expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\nexpr -> expr ●DIVIDE expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS",
      "color": "#FFFFFF"
    },
    {
      "key": "K3",
      "label": "I3\n=======\nexpr -> expr MINUS ●expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> ●expr PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●NUMBER  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K4",
      "label": "I4\n=======\nexpr -> expr PLUS ●expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> ●expr PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●NUMBER  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K5",
      "label": "I5\n=======\nexpr -> expr MULTIPLY ●expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> ●expr PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●NUMBER  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K6",
      "label": "I6\n=======\nexpr -> expr DIVIDE ●expr  § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> ●expr PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●expr DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> ●NUMBER  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K7",
      "label": "I7\n=======\nexpr -> expr DIVIDE expr● § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> expr ●PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K8",
      "label": "I8\n=======\nexpr -> expr MULTIPLY expr● § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> expr ●PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K9",
      "label": "I9\n=======\nexpr -> expr PLUS expr● § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> expr ●PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K10",
      "label": "I10\n=======\nexpr -> expr MINUS expr● § SP_END/DIVIDE/MULTIPLY/MINUS/PLUS\n-------\n\nexpr -> expr ●PLUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MINUS expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●MULTIPLY expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END\nexpr -> expr ●DIVIDE expr  § PLUS/DIVIDE/MULTIPLY/MINUS/SP_END",
      "color": "#FFFFFF"
    }
  ],
  "edges": [
    {
      "source": "K0",
      "target": "K1",
      "name": "K0_1",
      "label": "NUMBER"
    },
    {
      "source": "K0",
      "target": "K2",
      "name": "K0_2",
      "label": "expr"
    },
    {
      "source": "K2",
      "target": "K3",
      "name": "K2_3",
      "label": "MINUS"
    },
    {
      "source": "K2",
      "target": "K4",
      "name": "K2_4",
      "label": "PLUS"
    },
    {
      "source": "K2",
      "target": "K5",
      "name": "K2_5",
      "label": "MULTIPLY"
    },
    {
      "source": "K2",
      "target": "K6",
      "name": "K2_6",
      "label": "DIVIDE"
    },
    {
      "source": "K3",
      "target": "K1",
      "name": "K3_1",
      "label": "NUMBER"
    },
    {
      "source": "K3",
      "target": "K10",
      "name": "K3_10",
      "label": "expr"
    },
    {
      "source": "K4",
      "target": "K1",
      "name": "K4_1",
      "label": "NUMBER"
    },
    {
      "source": "K4",
      "target": "K9",
      "name": "K4_9",
      "label": "expr"
    },
    {
      "source": "K5",
      "target": "K1",
      "name": "K5_1",
      "label": "NUMBER"
    },
    {
      "source": "K5",
      "target": "K8",
      "name": "K5_8",
      "label": "expr"
    },
    {
      "source": "K6",
      "target": "K1",
      "name": "K6_1",
      "label": "NUMBER"
    },
    {
      "source": "K6",
      "target": "K7",
      "name": "K6_7",
      "label": "expr"
    },
    {
      "source": "K7",
      "target": "K3",
      "name": "K7_3",
      "label": "MINUS"
    },
    {
      "source": "K7",
      "target": "K4",
      "name": "K7_4",
      "label": "PLUS"
    },
    {
      "source": "K7",
      "target": "K5",
      "name": "K7_5",
      "label": "MULTIPLY"
    },
    {
      "source": "K7",
      "target": "K6",
      "name": "K7_6",
      "label": "DIVIDE"
    },
    {
      "source": "K8",
      "target": "K3",
      "name": "K8_3",
      "label": "MINUS"
    },
    {
      "source": "K8",
      "target": "K4",
      "name": "K8_4",
      "label": "PLUS"
    },
    {
      "source": "K8",
      "target": "K5",
      "name": "K8_5",
      "label": "MULTIPLY"
    },
    {
      "source": "K8",
      "target": "K6",
      "name": "K8_6",
      "label": "DIVIDE"
    },
    {
      "source": "K9",
      "target": "K3",
      "name": "K9_3",
      "label": "MINUS"
    },
    {
      "source": "K9",
      "target": "K4",
      "name": "K9_4",
      "label": "PLUS"
    },
    {
      "source": "K9",
      "target": "K5",
      "name": "K9_5",
      "label": "MULTIPLY"
    },
    {
      "source": "K9",
      "target": "K6",
      "name": "K9_6",
      "label": "DIVIDE"
    },
    {
      "source": "K10",
      "target": "K3",
      "name": "K10_3",
      "label": "MINUS"
    },
    {
      "source": "K10",
      "target": "K4",
      "name": "K10_4",
      "label": "PLUS"
    },
    {
      "source": "K10",
      "target": "K5",
      "name": "K10_5",
      "label": "MULTIPLY"
    },
    {
      "source": "K10",
      "target": "K6",
      "name": "K10_6",
      "label": "DIVIDE"
    }
  ]
}