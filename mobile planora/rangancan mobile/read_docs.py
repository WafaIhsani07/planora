import zipfile
import xml.etree.ElementTree as ET
import glob

def get_docx_text(path):
    text = []
    try:
        with zipfile.ZipFile(path) as docx:
            tree = ET.XML(docx.read('word/document.xml'))
            for element in tree.iter():
                if element.tag.endswith('}t') and element.text:
                    text.append(element.text)
        return '\n'.join(text)
    except Exception as e:
        return f"Error membaca file: {e}"

files = [
    "Laporan 1 - Development Process - kel 2 - Proyek Integrasi System.docx",
    "Laporan 1 - Progress Report - kel 2 - Proyek Integrasi System.docx",
    "PROPOSAL KELOMPOK 2 - FIX.docx"
]

for doc in files:
    content = get_docx_text(doc)
    
    # Simpan ke file .txt agar bisa dibaca seutuhnya tanpa terpotong di terminal
    txt_filename = doc.replace('.docx', '.txt')
    with open(txt_filename, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Berhasil mengekstrak: {doc} -> {txt_filename}")



HTTP
POST /api/v1/krs HTTP/1.1
Host: api.siakad.universitas.ac.id
Content-Type: application/json
Authorization: Bearer <JWT_Token>
Idempotency-Key: f47ac10b-58cc-4372-a567-0e02b2c3d479
{
  "student_id": "23041050",
  "semester": "2025/2026-Genap",
  "selected_courses": [
    {"course_code": "CS301", "class_group": "A"},
    {"course_code": "IS204", "class_group": "B"}
  ]
}
