import axios from 'axios';

const exportStudentData = async (year_level, section, program) => {
  try {
    const response = await axios.get(`/api/excel/student/`, {
      params: {
        year_level,
        section,
        program
      },
      responseType: 'blob'  // Important: Tell Axios to treat the response as a Blob (file)
    });

    // Create a URL for the blob data
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create an anchor element and simulate a click to trigger the download
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `student_data_${year_level || "all"}_${section || "all"}.xlsx`);
    document.body.appendChild(link);
    link.click(); // Simulate click to start the download
    document.body.removeChild(link); // Clean up

  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
};

export default exportStudentData;
