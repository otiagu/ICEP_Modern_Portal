function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function filterStudents(students, query) {
  if (!query || query.trim() === '') {
    return students;
  }
  
  const q = query.trim().toLowerCase();
  
  const scoredStudents = students.map(student => {
    let score = 0;
    const name = student.name ? student.name.toLowerCase() : '';
    const matric = student.matric ? student.matric.toLowerCase() : '';
    const matricDigits = matric.replace(/\D/g, '');
    const qDigits = q.replace(/\D/g, '');
    
    if (name.startsWith(q)) {
      score += 100;
    }
    
    const words = name.split(' ');
    if (words.some(word => word.startsWith(q))) {
      score += 75;
    }
    
    if (name.includes(q)) {
      score += 40;
    }
    
    if (matric.endsWith(q)) {
      score += 90;
    }
    
    if (qDigits && matricDigits.endsWith(qDigits)) {
      score += 85;
    }
    
    if (matric.includes(q)) {
      score += 60;
    }
    
    return { student, score };
  });
  
  return scoredStudents
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.student);
}

window.icepSearch = { filterStudents, debounce };
