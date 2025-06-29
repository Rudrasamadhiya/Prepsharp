// Direct fix to show real exams from Firebase
document.addEventListener('DOMContentLoaded', function() {
    console.log("Loading real exams from Firebase...");
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Load real exams data
    loadRealExams(db);
});

// Function to load real exams from Firebase
function loadRealExams(db) {
    console.log("Loading real exams...");
    
    // Get the table body
    const tbody = document.getElementById('recent-exams-tbody');
    if (!tbody) {
        console.error("recent-exams-tbody not found");
        return;
    }
    
    // Show loading message
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading real exams from Firebase...</td></tr>';
    
    // Get exams from Firestore
    db.collection("papers")
        .get()
        .then((querySnapshot) => {
            console.log("Exams query returned:", querySnapshot.size, "exams");
            
            if (querySnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No exams found in Firebase</td></tr>';
                return;
            }
            
            // Clear loading message
            tbody.innerHTML = '';
            
            // Add exams to table (limit to 3)
            let count = 0;
            querySnapshot.forEach((doc) => {
                if (count >= 3) return;
                
                const exam = doc.data();
                console.log("Exam data:", exam);
                
                const examName = exam.name || 'Unnamed Exam';
                const examType = exam.type || 'Unknown';
                const examYear = exam.year || 'N/A';
                
                // Count questions
                let questionCount = 0;
                if (exam.questions && Array.isArray(exam.questions)) {
                    questionCount = exam.questions.length;
                }
                
                // Create row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${examName}</td>
                    <td>${examType}</td>
                    <td>${questionCount}</td>
                    <td>${examYear}</td>
                    <td>
                        <a href="#" class="table-action"><i class="fas fa-edit"></i></a>
                        <a href="#" class="table-action delete" data-id="${doc.id}"><i class="fas fa-trash"></i></a>
                    </td>
                `;
                
                tbody.appendChild(row);
                count++;
            });
            
            // If no exams were added (might happen if all were filtered out)
            if (count === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No valid exams found</td></tr>';
            }
            
            // Add event listeners to action buttons
            document.querySelectorAll('#recent-exams-tbody .table-action').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isDelete = this.classList.contains('delete');
                    const row = this.closest('tr');
                    const examName = row.cells[0].textContent;
                    
                    if (isDelete) {
                        const examId = this.getAttribute('data-id');
                        if (confirm(`Are you sure you want to delete "${examName}"?`)) {
                            db.collection("papers").doc(examId).delete()
                                .then(() => {
                                    row.remove();
                                    alert(`Exam "${examName}" deleted successfully`);
                                })
                                .catch(error => {
                                    console.error("Error deleting exam:", error);
                                    alert(`Failed to delete exam: ${error.message}`);
                                });
                        }
                    } else {
                        alert(`Edit ${examName}`);
                    }
                });
            });
        })
        .catch((error) => {
            console.error("Error loading exams:", error);
            tbody.innerHTML = `<tr><td colspan="5" class="text-center">Error loading exams: ${error.message}</td></tr>`;
        });
}