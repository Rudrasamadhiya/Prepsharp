import os
import sys
import tkinter as tk
from tkinter import filedialog, simpledialog, ttk
from PIL import ImageGrab, Image
import fitz  # PyMuPDF
import keyboard

class ScreenshotTool:
    def __init__(self, root):
        self.root = root
        self.root.title("JEE Paper Screenshot Tool")
        self.root.geometry("800x600")
        
        # Paper data
        self.paper_name = ""
        self.pdf_path = ""
        self.base_path = "C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers"
        self.questions_with_options = []
        self.question_count = 17
        
        # Current state
        self.current_subject = "Chemistry"
        self.current_question = 1
        self.current_type = "question"  # "question" or "option1", "option2", etc.
        
        # PDF display
        self.pdf_document = None
        self.current_page = 0
        self.zoom_level = 1.5
        
        # Create UI
        self.create_ui()
        
        # Set up keyboard listener
        keyboard.on_press_key("enter", self.on_enter_pressed)
        
    def create_ui(self):
        # Setup frame
        setup_frame = ttk.LabelFrame(self.root, text="Setup")
        setup_frame.pack(fill="x", padx=10, pady=10)
        
        # Paper name
        ttk.Label(setup_frame, text="Paper Name (e.g., 2024-2):").grid(row=0, column=0, sticky="w", padx=5, pady=5)
        self.paper_name_entry = ttk.Entry(setup_frame, width=20)
        self.paper_name_entry.grid(row=0, column=1, sticky="w", padx=5, pady=5)
        
        # PDF selection
        ttk.Label(setup_frame, text="PDF File:").grid(row=1, column=0, sticky="w", padx=5, pady=5)
        self.pdf_path_var = tk.StringVar()
        ttk.Entry(setup_frame, textvariable=self.pdf_path_var, width=40).grid(row=1, column=1, sticky="w", padx=5, pady=5)
        ttk.Button(setup_frame, text="Browse...", command=self.browse_pdf).grid(row=1, column=2, padx=5, pady=5)
        
        # Question count
        ttk.Label(setup_frame, text="Questions per Subject:").grid(row=2, column=0, sticky="w", padx=5, pady=5)
        self.question_count_var = tk.IntVar(value=17)
        ttk.Spinbox(setup_frame, from_=1, to=50, textvariable=self.question_count_var, width=5, 
                   command=self.update_question_options).grid(row=2, column=1, sticky="w", padx=5, pady=5)
        
        # Questions with options
        options_frame = ttk.LabelFrame(self.root, text="Questions with Options")
        options_frame.pack(fill="x", padx=10, pady=10)
        
        self.options_container = ttk.Frame(options_frame)
        self.options_container.pack(fill="x", padx=5, pady=5)
        self.update_question_options()
        
        # Create folders button
        ttk.Button(setup_frame, text="Create Folder Structure", command=self.create_folder_structure).grid(row=3, column=0, columnspan=2, padx=5, pady=5)
        
        # Navigation frame
        nav_frame = ttk.LabelFrame(self.root, text="Navigation")
        nav_frame.pack(fill="x", padx=10, pady=10)
        
        # Subject selection
        ttk.Label(nav_frame, text="Subject:").grid(row=0, column=0, sticky="w", padx=5, pady=5)
        self.subject_var = tk.StringVar(value="Chemistry")
        subject_combo = ttk.Combobox(nav_frame, textvariable=self.subject_var, values=["Chemistry", "Maths", "Physics"], state="readonly", width=15)
        subject_combo.grid(row=0, column=1, sticky="w", padx=5, pady=5)
        subject_combo.bind("<<ComboboxSelected>>", lambda e: self.update_current_path())
        
        # Question selection
        ttk.Label(nav_frame, text="Question:").grid(row=0, column=2, sticky="w", padx=5, pady=5)
        self.question_var = tk.StringVar(value="1")
        self.question_combo = ttk.Combobox(nav_frame, textvariable=self.question_var, state="readonly", width=15)
        self.question_combo.grid(row=0, column=3, sticky="w", padx=5, pady=5)
        self.update_question_dropdown()
        self.question_combo.bind("<<ComboboxSelected>>", lambda e: self.update_capture_options())
        
        # Capture type selection
        ttk.Label(nav_frame, text="Type:").grid(row=0, column=4, sticky="w", padx=5, pady=5)
        self.type_var = tk.StringVar(value="question")
        self.type_combo = ttk.Combobox(nav_frame, textvariable=self.type_var, 
                                      values=["question", "option1", "option2", "option3", "option4"], 
                                      state="readonly", width=15)
        self.type_combo.grid(row=0, column=5, sticky="w", padx=5, pady=5)
        self.type_combo.bind("<<ComboboxSelected>>", lambda e: self.update_current_path())
        
        # PDF navigation
        pdf_nav_frame = ttk.Frame(nav_frame)
        pdf_nav_frame.grid(row=1, column=0, columnspan=6, sticky="w", padx=5, pady=5)
        
        ttk.Label(pdf_nav_frame, text="Page:").pack(side="left", padx=5)
        self.page_var = tk.StringVar(value="1")
        self.page_entry = ttk.Spinbox(pdf_nav_frame, from_=1, to=1, textvariable=self.page_var, width=5)
        self.page_entry.pack(side="left", padx=5)
        self.page_entry.bind("<Return>", lambda e: self.go_to_page())
        
        self.page_count_label = ttk.Label(pdf_nav_frame, text="/ 1")
        self.page_count_label.pack(side="left", padx=5)
        
        ttk.Button(pdf_nav_frame, text="Previous", command=self.prev_page).pack(side="left", padx=5)
        ttk.Button(pdf_nav_frame, text="Next", command=self.next_page).pack(side="left", padx=5)
        ttk.Button(pdf_nav_frame, text="Zoom In", command=self.zoom_in).pack(side="left", padx=5)
        ttk.Button(pdf_nav_frame, text="Zoom Out", command=self.zoom_out).pack(side="left", padx=5)
        
        # Next item button
        ttk.Button(nav_frame, text="Next Item", command=self.next_item).grid(row=2, column=0, columnspan=6, padx=5, pady=5)
        
        # Current path display
        path_frame = ttk.LabelFrame(self.root, text="Current Screenshot Path")
        path_frame.pack(fill="x", padx=10, pady=10)
        
        self.current_path_var = tk.StringVar()
        ttk.Entry(path_frame, textvariable=self.current_path_var, width=80, state="readonly").pack(padx=5, pady=5, fill="x")
        
        # Instructions
        instructions_frame = ttk.LabelFrame(self.root, text="Instructions")
        instructions_frame.pack(fill="x", padx=10, pady=10)
        
        instructions_text = """
        1. Enter paper name and select PDF
        2. Select which questions have options
        3. Click "Create Folder Structure" to create folders
        4. Navigate to the content you want to capture
        5. Press Enter to take a screenshot of the selected area
        6. Use "Next Item" to move to the next question/option
        """
        ttk.Label(instructions_frame, text=instructions_text, justify="left").pack(padx=5, pady=5, anchor="w")
        
        # PDF display canvas
        self.canvas_frame = ttk.LabelFrame(self.root, text="PDF Preview")
        self.canvas_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.canvas = tk.Canvas(self.canvas_frame, bg="gray")
        self.canvas.pack(fill="both", expand=True)
        
        # Update current path
        self.update_current_path()
    
    def browse_pdf(self):
        file_path = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
        if file_path:
            self.pdf_path = file_path
            self.pdf_path_var.set(file_path)
            self.load_pdf()
    
    def load_pdf(self):
        try:
            self.pdf_document = fitz.open(self.pdf_path)
            self.current_page = 0
            self.page_count_label.config(text=f"/ {len(self.pdf_document)}")
            self.page_entry.config(to=len(self.pdf_document))
            self.render_page()
        except Exception as e:
            tk.messagebox.showerror("Error", f"Failed to load PDF: {str(e)}")
    
    def render_page(self):
        if not self.pdf_document:
            return
        
        # Get the page
        page = self.pdf_document[self.current_page]
        
        # Render page to an image
        mat = fitz.Matrix(self.zoom_level, self.zoom_level)
        pix = page.get_pixmap(matrix=mat)
        
        # Convert to PIL Image
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # Convert to PhotoImage
        from PIL import ImageTk
        self.current_image = ImageTk.PhotoImage(image=img)
        
        # Update canvas
        self.canvas.config(width=pix.width, height=pix.height)
        self.canvas.create_image(0, 0, anchor="nw", image=self.current_image)
        
        # Update page number
        self.page_var.set(str(self.current_page + 1))
    
    def prev_page(self):
        if self.pdf_document and self.current_page > 0:
            self.current_page -= 1
            self.render_page()
    
    def next_page(self):
        if self.pdf_document and self.current_page < len(self.pdf_document) - 1:
            self.current_page += 1
            self.render_page()
    
    def go_to_page(self):
        if not self.pdf_document:
            return
        
        try:
            page_num = int(self.page_var.get()) - 1
            if 0 <= page_num < len(self.pdf_document):
                self.current_page = page_num
                self.render_page()
        except ValueError:
            pass
    
    def zoom_in(self):
        self.zoom_level += 0.25
        self.render_page()
    
    def zoom_out(self):
        if self.zoom_level > 0.5:
            self.zoom_level -= 0.25
            self.render_page()
    
    def update_question_options(self):
        # Clear existing options
        for widget in self.options_container.winfo_children():
            widget.destroy()
        
        # Get question count
        self.question_count = self.question_count_var.get()
        
        # Reset questions with options
        self.questions_with_options = []
        
        # Create checkboxes for each question
        for i in range(1, self.question_count + 1):
            var = tk.BooleanVar(value=(i <= 7 or i >= 14))
            if var.get():
                self.questions_with_options.append(i)
            
            frame = ttk.Frame(self.options_container)
            frame.pack(side="left", padx=2)
            
            cb = ttk.Checkbutton(frame, variable=var, text=f"{i}", 
                               command=lambda i=i, var=var: self.toggle_question_option(i, var))
            cb.pack()
        
        # Update question dropdown
        self.update_question_dropdown()
    
    def toggle_question_option(self, question_num, var):
        if var.get() and question_num not in self.questions_with_options:
            self.questions_with_options.append(question_num)
        elif not var.get() and question_num in self.questions_with_options:
            self.questions_with_options.remove(question_num)
        
        # Update capture options
        self.update_capture_options()
    
    def update_question_dropdown(self):
        # Update question dropdown values
        values = [str(i) for i in range(1, self.question_count + 1)]
        self.question_combo.config(values=values)
        
        # Make sure current question is valid
        if int(self.question_var.get()) > self.question_count:
            self.question_var.set("1")
        
        # Update capture options
        self.update_capture_options()
    
    def update_capture_options(self):
        # Get current question
        question = int(self.question_var.get())
        
        # Check if this question has options
        has_options = question in self.questions_with_options
        
        # Update type dropdown
        if has_options:
            self.type_combo.config(state="readonly")
        else:
            self.type_combo.config(state="readonly")
            if self.type_var.get() != "question":
                self.type_var.set("question")
        
        # Update current path
        self.update_current_path()
    
    def update_current_path(self):
        # Get paper name
        paper_name = self.paper_name_entry.get().strip()
        if not paper_name:
            self.current_path_var.set("Please enter a paper name")
            return
        
        # Get current state
        subject = self.subject_var.get()
        question = self.question_var.get()
        capture_type = self.type_var.get()
        
        # Generate filename
        if capture_type == "question":
            filename = f"Question-{question}.png"
        else:
            option_num = capture_type.replace("option", "")
            filename = f"Question-{question} Option-{option_num}.png"
        
        # Generate path
        path = os.path.join(self.base_path, paper_name, subject, filename)
        self.current_path_var.set(path)
    
    def next_item(self):
        # Get current state
        subject = self.subject_var.get()
        question = int(self.question_var.get())
        capture_type = self.type_var.get()
        
        # Check if current question has options
        has_options = question in self.questions_with_options
        
        # Logic to move to next item
        if capture_type == "question" and has_options:
            # Move to option 1
            self.type_var.set("option1")
        elif capture_type == "option1":
            # Move to option 2
            self.type_var.set("option2")
        elif capture_type == "option2":
            # Move to option 3
            self.type_var.set("option3")
        elif capture_type == "option3":
            # Move to option 4
            self.type_var.set("option4")
        else:
            # Move to next question or subject
            if question < self.question_count:
                # Next question
                self.question_var.set(str(question + 1))
                self.type_var.set("question")
            else:
                # Next subject
                if subject == "Chemistry":
                    self.subject_var.set("Maths")
                    self.question_var.set("1")
                    self.type_var.set("question")
                elif subject == "Maths":
                    self.subject_var.set("Physics")
                    self.question_var.set("1")
                    self.type_var.set("question")
                else:
                    # Finished all subjects
                    tk.messagebox.showinfo("Complete", "You have completed all items!")
        
        # Update capture options
        self.update_capture_options()
    
    def create_folder_structure(self):
        # Get paper name
        paper_name = self.paper_name_entry.get().strip()
        if not paper_name:
            tk.messagebox.showerror("Error", "Please enter a paper name")
            return
        
        try:
            # Create main paper directory
            paper_path = os.path.join(self.base_path, paper_name)
            os.makedirs(paper_path, exist_ok=True)
            
            # Create section files
            for i in range(1, 5):
                open(os.path.join(paper_path, f"Section-{i}.png"), 'a').close()
            
            # Create subject folders and their contents
            subjects = ["Chemistry", "Maths", "Physics"]
            for subject in subjects:
                subject_path = os.path.join(paper_path, subject)
                os.makedirs(subject_path, exist_ok=True)
                
                # Create question files
                for q in range(1, self.question_count + 1):
                    # Create main question file
                    open(os.path.join(subject_path, f"Question-{q}.png"), 'a').close()
                    
                    # Create option files for questions with options
                    if q in self.questions_with_options:
                        for opt in range(1, 5):
                            open(os.path.join(subject_path, f"Question-{q} Option-{opt}.png"), 'a').close()
            
            tk.messagebox.showinfo("Success", f"Folder structure for {paper_name} created successfully")
        except Exception as e:
            tk.messagebox.showerror("Error", f"Failed to create folder structure: {str(e)}")
    
    def on_enter_pressed(self, e):
        # Take screenshot when Enter is pressed
        self.take_screenshot()
    
    def take_screenshot(self):
        # Get current path
        path = self.current_path_var.get()
        if not os.path.dirname(path):
            tk.messagebox.showerror("Error", "Invalid save path")
            return
        
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(path), exist_ok=True)
            
            # Take screenshot of selected area
            img = ImageGrab.grab()
            
            # Save screenshot
            img.save(path)
            
            # Show confirmation
            tk.messagebox.showinfo("Success", f"Screenshot saved to:\n{path}")
            
            # Move to next item
            self.next_item()
        except Exception as e:
            tk.messagebox.showerror("Error", f"Failed to save screenshot: {str(e)}")

if __name__ == "__main__":
    # Create root window
    root = tk.Tk()
    
    # Create app
    app = ScreenshotTool(root)
    
    # Run the app
    root.mainloop()