import codecs
import re

html = codecs.open('index_dev.html', 'r', 'utf-8').read()
ids = re.findall(r'id=["\']([^"\']+)["\']', html)
for id_ in ids:
    if 'err' in id_:
        print(id_)
