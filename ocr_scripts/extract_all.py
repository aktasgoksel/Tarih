import fitz, pytesseract, json, glob, time, re
from PIL import Image
import numpy as np

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

pdfs = sorted(glob.glob(r'C:\Users\Hp\Desktop\2024 BENİM HOCAM KPSS TARİH SORU BANKASI*.pdf'))
all_pages = []
for pdf in pdfs:
    doc = fitz.open(pdf)
    for i in range(len(doc)):
        all_pages.append((pdf, i, doc))

results = {}
total_tests = 62
t0 = time.time()

for N in range(1, total_tests + 1):
    p1 = 2 + 5 * N
    p2 = 3 + 5 * N
    test_paras = []
    
    for p in [p1, p2]:
        pdf, i, doc = all_pages[p]
        pix = doc[i].get_pixmap(dpi=200) # Higher DPI for better OCR accuracy
        img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        img = Image.fromarray(img_np)
        
        txt = pytesseract.image_to_string(img, lang='tur')
        paras = [para.strip() for para in txt.split('\n\n') if len(para.strip()) > 50]
        # Filter out headers
        paras = [para for para in paras if not re.match(r'^(KPSS|slamiyet|Osmanl|lk Trk|TEST).*', para, re.IGNORECASE) and 'SORU BANKASI' not in para]
        
        test_paras.extend(paras)
        
    results[N] = test_paras
    print(f'Test {N} processed: {len(test_paras)} paragraphs')

with open('solutions.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f'Done in {time.time()-t0:.1f}s')
