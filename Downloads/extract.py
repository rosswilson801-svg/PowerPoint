import PyPDF2
import sys
import os

def extract_text(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            print(f"Total pages: {len(reader.pages)}")
            text = ""
            for i, page in enumerate(reader.pages):
                if i > 15: # Limit to first 16 pages
                    break
                page_text = page.extract_text()
                text += f"\n--- PAGE {i} ---\n{page_text}"
            return text
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(extract_text(sys.argv[1]))
    else:
        print("Please provide a PDF path.")
