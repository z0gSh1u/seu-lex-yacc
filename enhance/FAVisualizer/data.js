window._seulex_shape = 'rect'; let data = {
  "nodes": [
    {
      "key": "K0",
      "label": "I0\n=======\nS' -> ●S  § [END]\n-------\n\nS -> ●'(' L ')'  § [END]\nS -> ●a  § [END]",
      "color": "#FFFFFF"
    },
    {
      "key": "K1",
      "label": "I1\n=======\nS -> '(' ●L ')'  § [END]\n-------\n\nL -> ●L ',' S  § ')'/','\nL -> ●S  § ')'/','\nS -> ●'(' L ')'  § ')'/','\nS -> ●a  § ')'/','",
      "color": "#FFFFFF"
    },
    {
      "key": "K2",
      "label": "I2\n=======\nS -> a● § [END]\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K3",
      "label": "I3\n=======\nS' -> S● § [END]\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K4",
      "label": "I4\n=======\nS -> '(' ●L ')'  § ')'/','\n-------\n\nL -> ●L ',' S  § ')'/','\nL -> ●S  § ')'/','\nS -> ●'(' L ')'  § ')'/','\nS -> ●a  § ')'/','",
      "color": "#FFFFFF"
    },
    {
      "key": "K5",
      "label": "I5\n=======\nS -> a● § ')'/','\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K6",
      "label": "I6\n=======\nL -> S● § ')'/','\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K7",
      "label": "I7\n=======\nS -> '(' L ●')'  § [END]\n-------\n\nL -> L ●',' S  § ')'/','",
      "color": "#FFFFFF"
    },
    {
      "key": "K8",
      "label": "I8\n=======\nS -> '(' L ')'● § [END]\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K9",
      "label": "I9\n=======\nL -> L ',' ●S  § ')'/','\n-------\n\nS -> ●'(' L ')'  § ','/')'\nS -> ●a  § ','/')'",
      "color": "#FFFFFF"
    },
    {
      "key": "K10",
      "label": "I10\n=======\nL -> L ',' S● § ')'/','\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K11",
      "label": "I11\n=======\nS -> '(' L ●')'  § ')'/','\n-------\n\nL -> L ●',' S  § ')'/','",
      "color": "#FFFFFF"
    },
    {
      "key": "K12",
      "label": "I12\n=======\nS -> '(' L ')'● § ')'/','\n-------",
      "color": "#FFFFFF"
    }
  ],
  "edges": [
    {
      "source": "K0",
      "target": "K1",
      "name": "K0_1",
      "label": "("
    },
    {
      "source": "K0",
      "target": "K2",
      "name": "K0_2",
      "label": "a"
    },
    {
      "source": "K0",
      "target": "K3",
      "name": "K0_3",
      "label": "S"
    },
    {
      "source": "K1",
      "target": "K4",
      "name": "K1_4",
      "label": "("
    },
    {
      "source": "K1",
      "target": "K5",
      "name": "K1_5",
      "label": "a"
    },
    {
      "source": "K1",
      "target": "K6",
      "name": "K1_6",
      "label": "S"
    },
    {
      "source": "K1",
      "target": "K7",
      "name": "K1_7",
      "label": "L"
    },
    {
      "source": "K4",
      "target": "K4",
      "name": "K4_4",
      "label": "("
    },
    {
      "source": "K4",
      "target": "K5",
      "name": "K4_5",
      "label": "a"
    },
    {
      "source": "K4",
      "target": "K6",
      "name": "K4_6",
      "label": "S"
    },
    {
      "source": "K4",
      "target": "K11",
      "name": "K4_11",
      "label": "L"
    },
    {
      "source": "K7",
      "target": "K8",
      "name": "K7_8",
      "label": ")"
    },
    {
      "source": "K7",
      "target": "K9",
      "name": "K7_9",
      "label": ","
    },
    {
      "source": "K9",
      "target": "K4",
      "name": "K9_4",
      "label": "("
    },
    {
      "source": "K9",
      "target": "K5",
      "name": "K9_5",
      "label": "a"
    },
    {
      "source": "K9",
      "target": "K10",
      "name": "K9_10",
      "label": "S"
    },
    {
      "source": "K11",
      "target": "K12",
      "name": "K11_12",
      "label": ")"
    },
    {
      "source": "K11",
      "target": "K9",
      "name": "K11_9",
      "label": ","
    }
  ]
}