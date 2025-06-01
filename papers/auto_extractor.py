import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox
import fitz  # PyMuPDF

class PDFExtractor:
    def __init__(self, root):
        self.root = root
        self.root.title("PDF Question Extractor")
        self.root.geometry("600x400")
        
        # Paper data
        self.paper_name = ""
        self.pdf_path = ""
        self.base_path = "C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers"
        
        # Create UI
        self.create_ui()
    
    def create_ui(self):
        # Paper name
        tk.Label(self.root, text="Paper Name (e.g., 2024-2):").pack(anchor="w", padx=10, pady=(10, 0))
        self.paper_name_entry = tk.Entry(self.root, width=30)
        self.paper_name_entry.pack(fill="x", padx=10, pady=(0, 10))
        self.paper_name_entry.insert(0, "2024-2")
        
        # PDF selection
        tk.Label(self.root, text="Select PDF File:").pack(anchor="w", padx=10, pady=(10, 0))
        pdf_frame = tk.Frame(self.root)
        pdf_frame.pack(fill="x", padx=10, pady=(0, 10))
        
        self.pdf_path_var = tk.StringVar()
        tk.Entry(pdf_frame, textvariable=self.pdf_path_var, width=50).pack(side="left", fill="x", expand=True)
        tk.Button(pdf_frame, text="Browse...", command=self.browse_pdf).pack(side="right", padx=(5, 0))
        
        # Options frame
        options_frame = tk.LabelFrame(self.root, text="Options")
        options_frame.pack(fill="x", padx=10, pady=10)
        
        # Questions with options
        self.questions_with_options_var = tk.StringVar(value="1-7,14-17")
        tk.Label(options_frame, text="Questions with Options (e.g., 1-7,14-17):").pack(anchor="w", padx=10, pady=(10, 0))
        tk.Entry(options_frame, textvariable=self.questions_with_options_var, width=30).pack(fill="x", padx=10, pady=(0, 10))
        
        # Page ranges
        tk.Label(options_frame, text="Page Ranges (format: subject:start-end, e.g., Chemistry:1-20,Maths:21-40,Physics:41-60):").pack(anchor="w", padx=10, pady=(10, 0))
        self.page_ranges_var = tk.StringVar(value="Chemistry:1-20,Maths:21-40,Physics:41-60")
        tk.Entry(options_frame, textvariable=self.page_ranges_var, width=50).pack(fill="x", padx=10, pady=(0, 10))
        
        # Extract button
        tk.Button(self.root, text="Extract Questions", command=self.extract_questions, bg="#4CAF50", fg="white", height=2).pack(fill="x", padx=10, pady=10)
        
        # Status
        self.status_var = tk.StringVar(value="Ready")
        tk.Label(self.root, textvariable=self.status_var, bd=1, relief=tk.SUNKEN, anchor=tk.W).pack(side=tk.BOTTOM, fill=tk.X)
    
    def browse_pdf(self):
        file_path = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
        if file_path:
            self.pdf_path = file_path
            self.pdf_path_var.set(file_path)
    
    def extract_questions(self):
        # Get paper name
        paper_name = self.paper_name_entry.get().strip()
        if not paper_name:
            messagebox.showerror("Error", "Please enter a paper name")
            return
        
        # Get PDF path
        pdf_path = self.pdf_path_var.get().strip()
        if not pdf_path or not os.path.exists(pdf_path):
            messagebox.showerror("Error", "Please select a valid PDF file")
            return
        
        # Parse questions with options
        questions_with_options = []
        try:
            for part in self.questions_with_options_var.get().split(','):
                if '-' in part:
                    start, end = map(int, part.split('-'))
                    questions_with_options.extend(range(start, end + 1))
                else:
                    questions_with_options.append(int(part))
        except:
            messagebox.showerror("Error", "Invalid format for questions with options")
            return
        
        # Parse page ranges
        page_ranges = {}
        try:
            for part in self.page_ranges_var.get().split(','):
                subject, page_range = part.split(':')
                start, end = map(int, page_range.split('-'))
                page_ranges[subject] = (start, end)
        except:
            messagebox.showerror("Error", "Invalid format for page ranges")
            return
        
        # Create folder structure
        paper_path = os.path.join(self.base_path, paper_name)
        try:
            # Create main paper directory
            os.makedirs(paper_path, exist_ok=True)
            
            # Create section files
            for i in range(1, 5):
                open(os.path.join(paper_path, f"Section-{i}.png"), 'a').close()
            
            # Create subject folders
            for subject in page_ranges.keys():
                subject_path = os.path.join(paper_path, subject)
                os.makedirs(subject_path, exist_ok=True)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create folder structure: {str(e)}")
            return
        
        # Open PDF
        try:
            pdf_document = fitz.open(pdf_path)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to open PDF: {str(e)}")
            return
        
        # Extract questions
        try:
            self.status_var.set("Extracting questions...")
            self.root.update()
            
            # Process each subject
            for subject, (start_page, end_page) in page_ranges.items():
                subject_path = os.path.join(paper_path, subject)
                
                # Adjust page numbers to 0-based index
                start_page -= 1
                end_page -= 1
                
                # Calculate pages per question
                total_pages = end_page - start_page + 1
                pages_per_question = total_pages / 17  # Assuming 17 questions per subject
                
                # Extract each question
                for q in range(1, 18):
                    # Calculate page for this question
                    q_page = start_page + int((q - 1) * pages_per_question)
                    if q_page > end_page:
                        q_page = end_page
                    
                    # Extract question
                    page = pdf_document[q_page]
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better quality
                    img_path = os.path.join(subject_path, f"Question-{q}.png")
                    pix.save(img_path)
                    
                    # Extract options if this question has options
                    if q in questions_with_options:
                        # For simplicity, we'll just duplicate the question image for options
                        # In a real implementation, you'd need to detect and extract the options
                        for opt in range(1, 5):
                            opt_path = os.path.join(subject_path, f"Question-{q} Option-{opt}.png")
                            pix.save(opt_path)
                    
                    self.status_var.set(f"Extracted {subject} Question {q}")
                    self.root.update()
            
            messagebox.showinfo("Success", f"Extraction complete! Files saved to {paper_path}")
            self.status_var.set("Ready")
        except Exception as e:
            messagebox.showerror("Error", f"Failed during extraction: {str(e)}")
            self.status_var.set("Error occurred")
        finally:
            pdf_document.close()

if __name__ == "__main__":
    root = tk.Tk()
    app = PDFExtractor(root)
    root.mainloop()