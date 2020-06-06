window._seulex_shape = 'rect'; let data = {
  "nodes": [
    {
      "key": "K0",
      "label": "I0\n=======\nS' -> ●S  § SP_END\n-------\n\nS -> ●'(' L ')'  § SP_END\nS -> ●a  § SP_END",
      "color": "#FFFFFF"
    },
    {
      "key": "K1",
      "label": "I1\n=======\nS -> '(' ●L ')'  § SP_END/')'/','\n-------\n\nL -> ●L ',' S  § ')'/','\nL -> ●S  § ')'/','\nS -> ●'(' L ')'  § ')'/','\nS -> ●a  § ')'/','",
      "color": "#FFFFFF"
    },
    {
      "key": "K2",
      "label": "I2\n=======\nS -> a● § SP_END/')'/','\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K3",
      "label": "I3\n=======\nS' -> S● § SP_END\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K4",
      "label": "I4\n=======\nL -> S● § ')'/','\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K5",
      "label": "I5\n=======\nS -> '(' L ●')'  § SP_END/')'/','\n-------\n\nL -> L ●',' S  § ')'/','",
      "color": "#FFFFFF"
    },
    {
      "key": "K6",
      "label": "I6\n=======\nS -> '(' L ')'● § SP_END/')'/','\n-------",
      "color": "#FFFFFF"
    },
    {
      "key": "K7",
      "label": "I7\n=======\nL -> L ',' ●S  § ')'/','\n-------\n\nS -> ●'(' L ')'  § ','/')'\nS -> ●a  § ','/')'",
      "color": "#FFFFFF"
    },
    {
      "key": "K8",
      "label": "I8\n=======\nL -> L ',' S● § ')'/','\n-------",
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
      "target": "K1",
      "name": "K1_1",
      "label": "("
    },
    {
      "source": "K1",
      "target": "K2",
      "name": "K1_2",
      "label": "a"
    },
    {
      "source": "K1",
      "target": "K4",
      "name": "K1_4",
      "label": "S"
    },
    {
      "source": "K1",
      "target": "K5",
      "name": "K1_5",
      "label": "L"
    },
    {
      "source": "K5",
      "target": "K6",
      "name": "K5_6",
      "label": ")"
    },
    {
      "source": "K5",
      "target": "K7",
      "name": "K5_7",
      "label": ","
    },
    {
      "source": "K7",
      "target": "K1",
      "name": "K7_1",
      "label": "("
    },
    {
      "source": "K7",
      "target": "K2",
      "name": "K7_2",
      "label": "a"
    },
    {
      "source": "K7",
      "target": "K8",
      "name": "K7_8",
      "label": "S"
    }
  ]
}