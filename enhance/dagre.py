import json
from dagre_py.core import plot
with open(r'I:\temp.json', 'r') as f:
  file_content = f.read()
  myjson = json.loads(file_content)
  plot(myjson)
