/**
 * ICEP State Manager
 * Centralized Vanilla JS state container for handling localStorage operations, 
 * simulated network delays, and session caches to prevent data loss.
 */
class ICEPStateManager {
  
  static getActivePersona() {
    try {
      const personaStr = localStorage.getItem('activePersona');
      if (!personaStr) return null;
      const persona = JSON.parse(personaStr);
      // Coalesce dept and department to prevent schema mismatches
      if (persona.dept && !persona.department) persona.department = persona.dept;
      if (persona.department && !persona.dept) persona.dept = persona.department;
      return persona;
    } catch (e) {
      console.error("ICEPStateManager: Failed to parse activePersona", e);
      return null;
    }
  }

  static setActivePersona(persona) {
    if (persona.dept && !persona.department) persona.department = persona.dept;
    if (persona.department && !persona.dept) persona.dept = persona.department;
    localStorage.setItem('activePersona', JSON.stringify(persona));
  }

  static getTheme() {
    return localStorage.getItem('icep_modern_theme') || 'dark';
  }

  static setTheme(theme) {
    localStorage.setItem('icep_modern_theme', theme);
  }

  static prunePortals() {
    const persona = this.getActivePersona();
    const currentUrl = window.location.pathname.split('/').pop() || '';
    
    // Links to evaluate (href contains these values)
    const loginLink = 'ICEP_login_modern.html';
    
    document.querySelectorAll('.mob-nav-link, .mobile-nav-link, .portal-menu-item, .dropdown-item').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // 1. Hide Login redirect if already authenticated
      if (persona && href.includes(loginLink)) {
        link.style.display = 'none';
      }
      
      // 2. Hide link to the CURRENT page (redundant)
      if (currentUrl && href.includes(currentUrl) && !link.classList.contains('active-portal') && !link.classList.contains('btn-signout')) {
         // Keep if it's the active portal indicator or signout, otherwise hide redundant navigation
         // Actually, if it's in a dropdown of "Other Portals", we just hide it.
         if(link.closest('.portal-menu') || link.closest('.dropdown-menu') || link.textContent.includes('Portal')) {
            link.style.display = 'none';
         }
      }
    });
  }

  // --- Session Caching Engines ---

  static getAttendanceCache() {
    try {
      return JSON.parse(localStorage.getItem('TEMP_ATTENDANCE_CACHE') || '{}');
    } catch (e) {
      return {};
    }
  }

  static pushAttendance(studentId, isPresent) {
    const cache = this.getAttendanceCache();
    cache[studentId] = {
      present: isPresent,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('TEMP_ATTENDANCE_CACHE', JSON.stringify(cache));
  }

  static commitAttendanceCache() {
    // In a real app, this pushes to the backend. Here we just clear the temp cache.
    localStorage.removeItem('TEMP_ATTENDANCE_CACHE');
    console.log("Attendance finalized and cache cleared.");
  }

  static getBroadsheetCache() {
    try {
      return JSON.parse(localStorage.getItem('TEMP_BROADSHEET_CACHE') || '{}');
    } catch (e) {
      return {};
    }
  }

  static pushBroadsheetScore(studentId, courseCode, ca, exam) {
    const cache = this.getBroadsheetCache();
    if (!cache[courseCode]) cache[courseCode] = {};
    
    cache[courseCode][studentId] = {
      ca: parseInt(ca) || 0,
      exam: parseInt(exam) || 0,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('TEMP_BROADSHEET_CACHE', JSON.stringify(cache));
  }

  static commitBroadsheetCache() {
    localStorage.removeItem('TEMP_BROADSHEET_CACHE');
    console.log("Broadsheet finalized and cache cleared.");
  }

  static getExamBoardCache() {
    try {
      return JSON.parse(localStorage.getItem('TEMP_EXAM_BOARD_CACHE') || '[]');
    } catch (e) {
      return [];
    }
  }

  static pushExam(examObj) {
    const cache = this.getExamBoardCache();
    cache.push(examObj);
    localStorage.setItem('TEMP_EXAM_BOARD_CACHE', JSON.stringify(cache));
  }

  // --- Global Mock API Wrapper ---
  
  /**
   * Simulates a network fetch with an 800ms latency.
   * Returns a promise that resolves with the requested dataset.
   * @param {string} datasetName - e.g., 'ICEP_STUDENTS', 'ICEP_COURSE_REPS', 'ICEP_TIMETABLE'
   */
  static fetchMockData(datasetName) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (typeof window[datasetName] !== 'undefined') {
          let data = window[datasetName];
          // Merge custom data if requested
          try {
            if (datasetName === 'ICEP_STUDENTS') {
              const customStudents = localStorage.getItem('ICEP_STUDENTS_CUSTOM');
              if (customStudents) data = [...data, ...JSON.parse(customStudents)];
            }
            if (datasetName === 'ICEP_TIMETABLE') {
              const customTimetable = localStorage.getItem('ICEP_TIMETABLE_CUSTOM');
              if (customTimetable) data = [...data, ...JSON.parse(customTimetable)];
            }
          } catch(e) {
            console.error("ICEPStateManager: Failed to parse custom data", e);
          }
          resolve(data);
        } else {
          console.warn(`ICEPStateManager: Dataset ${datasetName} not found on window object.`);
          resolve([]);
        }
      }, 800); // 800ms Network Simulation
    });
  }
}

// Expose globally
window.ICEPStateManager = ICEPStateManager;
