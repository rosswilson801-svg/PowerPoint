import PyPDF2
import sys

def extract_text(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for i, page in enumerate(reader.pages):
                if i > 5: # Limit to first 6 pages for brevity
                    break
                text += page.extract_text() + "\n--- PAGE BREAK ---\n"
            return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(extract_text(sys.argv[1]))
    else:
        print("Please provide a PDF path.")
