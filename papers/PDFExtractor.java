import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PDFExtractor extends JFrame {
    private JTextField paperNameField;
    private JTextField pdfPathField;
    private JTextField questionsWithOptionsField;
    private JTextField pageRangesField;
    private JButton browseButton;
    private JButton extractButton;
    private JLabel statusLabel;

    private final String basePath = "C:\\Users\\HP\\myproject\\jeeapp\\src\\webapp\\Prepsharp\\papers";

    public PDFExtractor() {
        setTitle("PDF Question Extractor");
        setSize(600, 400);
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
        // Get paper name
        String paperName = paperNameField.getText().trim();
        if (paperName.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter a paper name", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Get PDF path
        String pdfPath = pdfPathField.getText().trim();
        if (pdfPath.isEmpty() || !new File(pdfPath).exists()) {
            JOptionPane.showMessageDialog(this, "Please select a valid PDF file", "Error", JOptionPane.ERROR_MESSAGE);
            return;
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
            JOptionPane.showMessageDialog(this, "Invalid format for questions with options", "Error", JOptionPane.ERROR_MESSAGE);
            return;
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
            JOptionPane.showMessageDialog(this, "Invalid format for page ranges", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Create folder structure
        Path paperPath = Paths.get(basePath, paperName);
        try {
            // Create main paper directory
            Files.createDirectories(paperPath);

            // Create section files
            for (int i = 1; i <= 4; i++) {
                Files.createFile(paperPath.resolve("Section-" + i + ".png"));
            }

            // Create subject folders
            for (String subject : pageRanges.keySet()) {
                Path subjectPath = paperPath.resolve(subject);
                Files.createDirectories(subjectPath);

                // Create question files
                for (int q = 1; q <= 17; q++) {
                    // Create main question file
                    Files.createFile(subjectPath.resolve("Question-" + q + ".png"));

                    // Create option files for questions with options
                    if (questionsWithOptions.contains(q)) {
                        for (int opt = 1; opt <= 4; opt++) {
                            Files.createFile(subjectPath.resolve("Question-" + q + " Option-" + opt + ".png"));
                        }
                    }
                }
            }
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(this, "Failed to create folder structure: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Extract questions
        try {
            statusLabel.setText("Extracting questions...");

            // Note: Actual PDF extraction requires additional libraries like Apache PDFBox or iText
            // This is a simplified version that just creates empty files
            
            JOptionPane.showMessageDialog(this, 
                "Folder structure created successfully!\n\n" +
                "To extract the actual content from the PDF, you'll need to:\n" +
                "1. Open the PDF in Adobe Acrobat Reader DC\n" +
                "2. Use the 'Take a Snapshot' tool (Edit > Take a Snapshot)\n" +
                "3. Select the area of each question/option\n" +
                "4. Save the images to the corresponding files\n\n" +
                "Files are located at: " + paperPath, 
                "Success", JOptionPane.INFORMATION_MESSAGE);
            
            statusLabel.setText("Ready");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error during extraction: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            statusLabel.setText("Error occurred");
        }
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        SwingUtilities.invokeLater(() -> {
            PDFExtractor app = new PDFExtractor();
            app.setVisible(true);
        });
    }
}