
import * as XLSX from 'xlsx';

// Function to generate and download sample template
export const generateSampleTemplate = () => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Sample data for Sheet 1 (Students)
  const studentsData = [
    ['Sr No', 'Name', 'UID', 'CGPA', 'Department', 'Preference 1', 'Preference 2', 'Preference 3'],
    [1, 'John Doe', 'UID001', 9.2, 'CSE', 'Machine Learning', 'Web Development', 'Cloud Computing'],
    [2, 'Jane Smith', 'UID002', 8.7, 'ECE', 'VLSI Design', 'Embedded Systems', 'Signal Processing'],
    [3, 'Robert Johnson', 'UID003', 7.8, 'Mechanical', 'Thermodynamics', 'Robotics', 'Material Science'],
  ];

  // Sample data for Sheet 2 (Departments)
  const departmentsData = [
    ['Sr No', 'Department Name', 'Course Offered', 'Total Intake'],
    [1, 'CSE', 'Machine Learning', 50],
    [2, 'CSE', 'Web Development', 45],
    [3, 'CSE', 'Cloud Computing', 40],
    [4, 'ECE', 'VLSI Design', 35],
    [5, 'ECE', 'Embedded Systems', 30],
    [6, 'Mechanical', 'Thermodynamics', 40],
    [7, 'Mechanical', 'Robotics', 25],
  ];

  // Sample data for Sheet 3 (Courses)
  const coursesData = [
    ['Sr No', 'Course Name', 'CSE', 'ECE', 'Mechanical', 'Civil'],
    [1, 'Machine Learning', 30, 10, 5, 5],
    [2, 'Web Development', 35, 5, 3, 2],
    [3, 'Cloud Computing', 30, 5, 3, 2],
    [4, 'VLSI Design', 5, 25, 3, 2],
    [5, 'Embedded Systems', 5, 20, 3, 2],
    [6, 'Thermodynamics', 5, 5, 25, 5],
    [7, 'Robotics', 10, 5, 10, 0],
  ];

  // Add sheets to workbook
  const sheet1 = XLSX.utils.aoa_to_sheet(studentsData);
  const sheet2 = XLSX.utils.aoa_to_sheet(departmentsData);
  const sheet3 = XLSX.utils.aoa_to_sheet(coursesData);

  XLSX.utils.book_append_sheet(workbook, sheet1, 'Students');
  XLSX.utils.book_append_sheet(workbook, sheet2, 'Departments');
  XLSX.utils.book_append_sheet(workbook, sheet3, 'Courses');

  // Export and download
  XLSX.writeFile(workbook, 'course_allocation_template.xlsx');
};

// Function to process the uploaded Excel file
export const processExcelFile = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Check if all required sheets exist
        if (!workbook.SheetNames.includes('Students') || 
            !workbook.SheetNames.includes('Departments') || 
            !workbook.SheetNames.includes('Courses')) {
          throw new Error('Required sheets not found. File must contain sheets named "Students", "Departments", and "Courses".');
        }
        
        // Parse each sheet
        const studentsSheet = workbook.Sheets['Students'];
        const departmentsSheet = workbook.Sheets['Departments'];
        const coursesSheet = workbook.Sheets['Courses'];
        
        const students = XLSX.utils.sheet_to_json(studentsSheet);
        const departments = XLSX.utils.sheet_to_json(departmentsSheet);
        const courses = XLSX.utils.sheet_to_json(coursesSheet);
        
        // Perform the allocation
        const allocations = allocateCoursesToStudents(students, departments, courses);
        
        // Count statistics
        const totalStudents = students.length;
        const allocatedStudents = allocations.filter((a: any) => a.allocatedCourse).length;
        const unallocatedStudents = totalStudents - allocatedStudents;
        
        resolve({
          allocations,
          stats: {
            totalStudents,
            allocatedStudents,
            unallocatedStudents
          }
        });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject('Invalid Excel file format. Please check the template and try again.');
      }
    };
    
    reader.onerror = () => {
      reject('Error reading the file.');
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Function to allocate courses to students based on CGPA and preferences
const allocateCoursesToStudents = (students: any[], departments: any[], courses: any[]) => {
  // Sort students by CGPA (high to low)
  const sortedStudents = [...students].sort((a, b) => b.CGPA - a.CGPA);
  
  // Create a map of department name -> list of courses offered
  const departmentCourses: Record<string, any[]> = {};
  
  // Process departments data
  departments.forEach(dept => {
    const deptName = dept['Department Name'];
    if (!departmentCourses[deptName]) {
      departmentCourses[deptName] = [];
    }
    
    departmentCourses[deptName].push({
      courseName: dept['Course Offered'],
      totalIntake: dept['Total Intake']
    });
  });
  
  // Create a map of courses and their capacities by department
  const courseCapacity: Record<string, Record<string, number>> = {};
  
  // Process courses data
  courses.forEach(course => {
    const courseName = course['Course Name'];
    courseCapacity[courseName] = {};
    
    // Extract capacities for each department
    Object.keys(course).forEach(key => {
      if (key !== 'Sr No' && key !== 'Course Name') {
        courseCapacity[courseName][key] = course[key];
      }
    });
  });
  
  // Track allocated seats
  const allocatedSeats: Record<string, Record<string, number>> = {};
  courses.forEach(course => {
    const courseName = course['Course Name'];
    allocatedSeats[courseName] = {};
    
    Object.keys(course).forEach(key => {
      if (key !== 'Sr No' && key !== 'Course Name') {
        allocatedSeats[courseName][key] = 0;
      }
    });
  });
  
  // Allocate courses
  const allocations = sortedStudents.map(student => {
    let allocated = false;
    let allocatedCourse = "";
    let preferenceNumber = null;
    
    // Get student department
    const department = student.Department;
    
    // Try to allocate based on preferences
    for (let i = 1; i <= 10; i++) {
      const prefKey = `Preference ${i}`;
      const preference = student[prefKey];
      
      if (!preference) continue;
      
      // Check if course exists and has capacity
      if (courseCapacity[preference] && 
          courseCapacity[preference][department] !== undefined &&
          allocatedSeats[preference][department] < courseCapacity[preference][department]) {
        
        // Allocate the course
        allocatedSeats[preference][department]++;
        allocated = true;
        allocatedCourse = preference;
        preferenceNumber = i;
        break;
      }
    }
    
    return {
      srno: student['Sr No'],
      name: student.Name,
      uid: student.UID,
      cgpa: student.CGPA,
      department: student.Department,
      allocatedCourse: allocated ? allocatedCourse : "",
      preferenceNumber
    };
  });
  
  return allocations;
};

// Function to export results to Excel
export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Allocations');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
