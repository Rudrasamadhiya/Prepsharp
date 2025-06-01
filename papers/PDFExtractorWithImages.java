import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

public class PDFExtractorWithImages extends JFrame {
    private JTextField paperNameField;
    private JTextField pdfPathField;
    private JTextField questionsWithOptionsField;
    private JTextField pageRangesField;
    private JButton browseButton;
    private JButton extractButton;
    private JLabel statusLabel;
    private JProgressBar progressBar;

    private final String basePath = "C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers";

    public PDFExtractorWithImages() {
        setTitle("PDF Question Extractor");
        setSize(600, 450);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        createUI();
    }

    private void createUI() {
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BoxLayout(mainPanel, BoxLayout.Y_AXIS));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Paper name
        JPanel paperNamePanel = new JPanel(new BorderLayout());
        paperNamePanel.add(new JLabel("Paper Name (e.g., 2024-2):"), BorderLayout.WEST);
        paperNameField = new JTextField("2024-2");
        paperNamePanel.add(paperNameField, BorderLayout.CENTER);
        mainPanel.add(paperNamePanel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // PDF selection
        JPanel pdfPanel = new JPanel(new BorderLayout());
        pdfPanel.add(new JLabel("Select PDF File:"), BorderLayout.NORTH);
        JPanel pdfSelectionPanel = new JPanel(new BorderLayout());
        pdfPathField = new JTextField();
        pdfSelectionPanel.add(pdfPathField, BorderLayout.CENTER);
        browseButton = new JButton("Browse...");
        browseButton.addActionListener(this::browsePDF);
        pdfSelectionPanel.add(browseButton, BorderLayout.EAST);
        pdfPanel.add(pdfSelectionPanel, BorderLayout.CENTER);
        mainPanel.add(pdfPanel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // Options panel
        JPanel optionsPanel = new JPanel();
        optionsPanel.setLayout(new BoxLayout(optionsPanel, BoxLayout.Y_AXIS));
        optionsPanel.setBorder(BorderFactory.createTitledBorder("Options"));

        // Questions with options
        JPanel questionsWithOptionsPanel = new JPanel(new BorderLayout());
        questionsWithOptionsPanel.add(new JLabel("Questions with Options (e.g., 1-7,14-17):"), BorderLayout.NORTH);
        questionsWithOptionsField = new JTextField("1-7,14-17");
        questionsWithOptionsPanel.add(questionsWithOptionsField, BorderLayout.CENTER);
        optionsPanel.add(questionsWithOptionsPanel);
        optionsPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // Page ranges
        JPanel pageRangesPanel = new JPanel(new BorderLayout());
        pageRangesPanel.add(new JLabel("Page Ranges (format: subject:start-end, e.g., Chemistry:1-20,Maths:21-40,Physics:41-60):"), BorderLayout.NORTH);
        pageRangesField = new JTextField("Chemistry:1-20,Maths:21-40,Physics:41-60");
        pageRangesPanel.add(pageRangesField, BorderLayout.CENTER);
        optionsPanel.add(pageRangesPanel);

        mainPanel.add(optionsPanel);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // Progress bar
        progressBar = new JProgressBar(0, 100);
        progressBar.setStringPainted(true);
        mainPanel.add(progressBar);
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));

        // Extract button
        extractButton = new JButton("Extract Questions");
        extractButton.setBackground(new Color(76, 175, 80));
        extractButton.setForeground(Color.WHITE);
        extractButton.addActionListener(this::extractQuestions);
        mainPanel.add(extractButton);

        // Status bar
        statusLabel = new JLabel("Ready");
        statusLabel.setBorder(BorderFactory.createLoweredBevelBorder());
        mainPanel.add(Box.createRigidArea(new Dimension(0, 10)));
        mainPanel.add(statusLabel);

        add(mainPanel);
    }

    private void browsePDF(ActionEvent e) {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter("PDF Files", "pdf"));
        int result = fileChooser.showOpenDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            pdfPathField.setText(selectedFile.getAbsolutePath());
        }
    }

    private void extractQuestions(ActionEvent e) {
        // Disable the extract button during extraction
        extractButton.setEnabled(false);
        progressBar.setValue(0);
        
        // Run extraction in a background thread to keep UI responsive
        SwingWorker<Void, Integer> worker = new SwingWorker<Void, Integer>() {
            @Override
            protected Void doInBackground() throws Exception {
                try {
                    // Get paper name
                    String paperName = paperNameField.getText().trim();
                    if (paperName.isEmpty()) {
                        throw new Exception("Please enter a paper name");
                    }

                    // Get PDF path
                    String pdfPath = pdfPathField.getText().trim();
                    if (pdfPath.isEmpty() || !new File(pdfPath).exists()) {
                        throw new Exception("Please select a valid PDF file");
                    }

                    // Parse questions with options
                    List<Integer> questionsWithOptions = new ArrayList<>();
                    try {
                        for (String part : questionsWithOptionsField.getText().split(",")) {
                            if (part.contains("-")) {
                                String[] range = part.split("-");
                                int start = Integer.parseInt(range[0]);
                                int end = Integer.parseInt(range[1]);
                                for (int i = start; i <= end; i++) {
                                    questionsWithOptions.add(i);
                                }
                            } else {
                                questionsWithOptions.add(Integer.parseInt(part));
                            }
                        }
                    } catch (Exception ex) {
                        throw new Exception("Invalid format for questions with options");
                    }

                    // Parse page ranges
                    Map<String, int[]> pageRanges = new HashMap<>();
                    try {
                        for (String part : pageRangesField.getText().split(",")) {
                            String[] subjectAndRange = part.split(":");
                            String subject = subjectAndRange[0];
                            String[] range = subjectAndRange[1].split("-");
                            int start = Integer.parseInt(range[0]);
                            int end = Integer.parseInt(range[1]);
                            pageRanges.put(subject, new int[]{start, end});
                        }
                    } catch (Exception ex) {
                        throw new Exception("Invalid format for page ranges");
                    }

                    // Create folder structure
                    Path paperPath = Paths.get(basePath, paperName);
                    try {
                        // Create main paper directory
                        Files.createDirectories(paperPath);

                        // Create section files (empty for now)
                        for (int i = 1; i <= 4; i++) {
                            Files.createFile(paperPath.resolve("Section-" + i + ".png"));
                        }

                        // Create subject folders
                        for (String subject : pageRanges.keySet()) {
                            Path subjectPath = paperPath.resolve(subject);
                            Files.createDirectories(subjectPath);
                        }
                    } catch (IOException ex) {
                        throw new Exception("Failed to create folder structure: " + ex.getMessage());
                    }

                    // Extract questions from PDF
                    try (PDDocument document = PDDocument.load(new File(pdfPath))) {
                        PDFRenderer pdfRenderer = new PDFRenderer(document);
                        
                        // Calculate total work to do for progress bar
                        int totalWork = 0;
                        for (String subject : pageRanges.keySet()) {
                            totalWork += 17; // 17 questions per subject
                            for (int q = 1; q <= 17; q++) {
                                if (questionsWithOptions.contains(q)) {
                                    totalWork += 4; // 4 options per question with options
                                }
                            }
                        }
                        
                        int workDone = 0;
                        
                        // Process each subject
                        for (String subject : pageRanges.keySet()) {
                            Path subjectPath = paperPath.resolve(subject);
                            int[] pageRange = pageRanges.get(subject);
                            
                            // Adjust page numbers to 0-based index
                            int startPage = pageRange[0] - 1;
                            int endPage = pageRange[1] - 1;
                            
                            // Calculate pages per question
                            int totalPages = endPage - startPage + 1;
                            double pagesPerQuestion = (double) totalPages / 17; // Assuming 17 questions per subject
                            
                            // Extract each question
                            for (int q = 1; q <= 17; q++) {
                                // Calculate page for this question
                                int qPage = startPage + (int)((q - 1) * pagesPerQuestion);
                                if (qPage > endPage) {
                                    qPage = endPage;
                                }
                                
                                // Render page to image
                                BufferedImage image = pdfRenderer.renderImageWithDPI(qPage, 300); // 300 DPI for good quality
                                
                                // Save question image
                                File outputFile = new File(subjectPath.toFile(), "Question-" + q + ".png");
                                ImageIO.write(image, "PNG", outputFile);
                                
                                workDone++;
                                publish((workDone * 100) / totalWork);
                                
                                // Extract options if this question has options
                                if (questionsWithOptions.contains(q)) {
                                    // For simplicity, we'll just use the same image for options
                                    // In a real implementation, you'd need to detect and extract the options
                                    for (int opt = 1; opt <= 4; opt++) {
                                        File optionFile = new File(subjectPath.toFile(), "Question-" + q + " Option-" + opt + ".png");
                                        ImageIO.write(image, "PNG", optionFile);
                                        
                                        workDone++;
                                        publish((workDone * 100) / totalWork);
                                    }
                                }
                            }
                        }
                    }
                    
                    return null;
                } catch (Exception ex) {
                    SwingUtilities.invokeLater(() -> {
                        JOptionPane.showMessageDialog(PDFExtractorWithImages.this, 
                            ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                        statusLabel.setText("Error: " + ex.getMessage());
                    });
                    return null;
                }
            }
            
            @Override
            protected void process(List<Integer> chunks) {
                // Update progress bar
                if (!chunks.isEmpty()) {
                    int progress = chunks.get(chunks.size() - 1);
                    progressBar.setValue(progress);
                    statusLabel.setText("Extracting... " + progress + "%");
                }
            }
            
            @Override
            protected void done() {
                try {
                    get(); // Check for exceptions
                    JOptionPane.showMessageDialog(PDFExtractorWithImages.this, 
                        "Extraction completed successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                    statusLabel.setText("Extraction completed");
                } catch (Exception ex) {
                    // Exception already handled in doInBackground
                }
                extractButton.setEnabled(true);
            }
        };
        
        worker.execute();
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        SwingUtilities.invokeLater(() -> {
            PDFExtractorWithImages app = new PDFExtractorWithImages();
            app.setVisible(true);
        });
    }
}